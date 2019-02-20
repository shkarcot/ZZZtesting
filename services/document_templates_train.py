import traceback
import json
from uuid import uuid4

from xpms_common import trace

from config_vars import MOUNT_PATH, TEMPLATE_TRAIN_TRIGGER_ENDPOINT, TEMPLATE_TRAIN_UPLOAD_ENDPOINT, \
    TEMPLATE_TRAIN_SAMPLES_COLLECTION, SERVICE_NAME
from utilities import common
from utilities.common import read_multiple_files, get_solution_from_session, save_to_folder
from utilities.http import is_request_timeout, get_response, get_nested_value, post_job
from connections.mongodb import MongoDbConn


tracer = trace.Tracer.get_instance(SERVICE_NAME)

def template_train_upload_post(request):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)

        # asserting for key items
        assert len(request.FILES) > 0
        data = json.loads(request.POST.get("data","0"))
        assert "template_id" in data

        files = read_multiple_files(request)
        data = {"template_id": data["template_id"]}
        file_paths = list()

        # iterating files and saving each file
        for file_key, file_value in files.items():
            file_data = save_to_folder(solution_id, file_value[0], MOUNT_PATH, "templates", "samples", flag=True)
            assert file_data['status'] == "success"
            file_path = file_data["data"]["relative_path"]
            file_paths.append(file_path)

        data["file_path"] = file_paths

        # payload to post
        payload = {"solution_id": solution_id, "data": data}
        response = post_job(TEMPLATE_TRAIN_UPLOAD_ENDPOINT, payload)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                resp = get_nested_value(response, "result.result.metadata")
                return {"status": "success", "msg": "files uploaded successfully",
                        'data': resp, 'job_id':job_id}
            else:
                return {"status": "failure", "msg": "failed to upload",
                        'error': result, 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "request timeout",
                    'error': response, 'job_id':job_id}
    # TODO raise specific exception
    except AssertionError as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        if job_id:
            return {"status": "failure", "msg": "Assertion failed, " + str(e),
                    "traceback": str(tb), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Assertion failed, " + str(e),
                    "traceback": str(tb)}

    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        if job_id:
            return {"status": "failure", "msg": "unknown error, " + str(e),
                    "traceback": str(tb), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "unknown error, " + str(e),
                    "traceback": str(tb)}
    finally:
        context.end_span()



def template_train_upload_get(request, template_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        query = {"solution_id": solution_id, "template_id": template_id}
        documents = MongoDbConn.find(TEMPLATE_TRAIN_SAMPLES_COLLECTION, query, {"_id": 0})
        documents = [a for a in documents]
        return {"status": "success", "msg": "retrieved template samples", "data": documents}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        return {"status": "failure", "msg": "unknown error, " + str(e), "traceback": str(tb)}
    finally:
        context.end_span()


def template_train_trigger(request):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())

        # assertions for essentials
        assert "template_id" in payload
        assert "documents" in payload
        assert len(payload["documents"]) > 0

        data = {"template_id": payload["template_id"], "documents": payload["documents"]}

        # payload to post
        payload = {"solution_id": solution_id, "data": data}
        response = post_job(TEMPLATE_TRAIN_TRIGGER_ENDPOINT, payload)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                return {"status": "success", "msg": "triggered training successfully",
                        'job_id': job_id}
            else:
                return {"status": "failure", "msg": "failed to trigger training",
                        'error': result, 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "request timeout",
                    'error': response, 'job_id':job_id}
    # TODO raise specific exception
    except AssertionError as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        if job_id:
            return {"status": "failure", "msg": "Assertion failed, " + str(e),
                    "traceback": str(tb), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Assertion failed, " + str(e),
                    "traceback": str(tb)}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        if job_id:
            return {"status": "failure", "msg": "unknown error, " + str(e),
                    "traceback": str(tb), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "unknown error, " + str(e),
                    "traceback": str(tb)}
    finally:
        context.end_span()
