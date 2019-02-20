import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import FEEDBACK_ENDPOINT, DEFAULT_ENTITY_ID, RETRAIN_ENDPOINT, REVIEW_ENDPOINT, DOCUMENTS_COLLECTION, \
    SERVICE_NAME
from utilities.http import get_response, is_request_timeout, post_job
from utilities.common import is_draft_valid
from connections.mongodb import MongoDbConn
import json


tracer = trace.Tracer.get_instance(SERVICE_NAME)
feedback_schema = {
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "required": ["feedback"],
    "properties": {
        "feedback": {
            "type": "array"
        },
        "request_type": {
            "type": "string"
        },
        "element_id": {
            "type": "string"
        }
    }
}


def feedback(payload, solution_id):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if is_draft_valid(feedback_schema, payload):
            data = {"solution_id": solution_id, "entity_id": DEFAULT_ENTITY_ID, "data": payload}
            response = post_job(FEEDBACK_ENDPOINT, data)
            if 'job_id' in response:
                job_id = response["job_id"]
            if not is_request_timeout(response):
                status, result = get_response(response)
                if status:
                    return {"status": "success", "msg": "feedback submitted",
                            'job_id': job_id}
                else:
                    return {"status": "failure",
                            "msg": "failed to submit feedback",
                            "error": result, 'job_id': job_id}
            else:
                return {"status": "failure", "msg": "request timeout", "error": response, 'job_id': job_id}
        else:
            return {"status": "failure", "msg": "Invalid Json", 'job_id': job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "failed to submit feedback", "error": str(e), 'job_id': job_id}
        else:
            return {"status": "failure", "msg": "failed to submit feedback", "error": str(e)}
    finally:
        context.end_span()


def retrain_model(solution_id):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id": solution_id, "data": {}}
        response = post_job(RETRAIN_ENDPOINT, data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                return {"status": "success", "msg": "request for retrain submitted", 'job_id': job_id}
            else:
                return {"status": "failure", "msg": "failed to request retrain", "error": result, 'job_id': job_id}
        else:
            return {"status": "failure", "msg": "request timeout", "error": response, 'job_id': job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "failed to request retrain", "error": str(e), 'job_id': job_id}
        else:
            return {"status": "failure", "msg": "failed to request retrain", "error": str(e)}
    finally:
        context.end_span()


def review_model(payload, solution_id):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id": solution_id, "data": payload}
        response = post_job(REVIEW_ENDPOINT, data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                return {"status": "success", "msg": "request for review submitted", 'job_id': job_id}
            else:
                return {"status": "failure", "msg": "failed to request review", "error": result, 'job_id': job_id}
        else:
            return {"status": "failure", "msg": "request timeout", "error": response, 'job_id': job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "failed to request review", "error": str(e), 'job_id': job_id}
        else:
            return {"status": "failure", "msg": "failed to request review", "error": str(e)}
    finally:
        context.end_span()


def update_intent_review(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        payload = json.loads(request.body.decode())
        doc_id = payload["doc_id"]
        MongoDbConn.update(DOCUMENTS_COLLECTION, {"doc_id": doc_id}, {"elements_updated": payload["elements"]})
        return {"status": "success", "msg": "Intent updated successfully"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()
