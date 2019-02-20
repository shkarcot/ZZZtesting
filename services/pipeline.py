import traceback
from uuid import uuid4

from connections.mongodb import MongoDbConn
from config_vars import CONFIG_COLLECTION, ROOT, ELK_HOST, ELK_PORT, MOUNT_PATH, SOURCE_COLLECTION, TEMPLATE_CONFIG, \
    TEMPLATE_COLLECTION, ELEMENTS_COLLECTION, API_GATEWAY_POST_JOB_URI, DOCUMENT_ENDPOINT, CONFIGURE_EMAIL,\
    SERVICE_NAME, STATUS_CODES, PIPELINE,PIPELINE_VARIABLES,SERVICE_REQUEST_TYPES
# from api.models import S3Bucket
import json, os
from utilities.http import get, post_s3, get_response, get_nested_value, post
from utilities.common import save_to_folder, create_data, read_multiple_files, get_solution_from_session, \
    is_request_timeout, get_mountpath_fromsftp
from services.solutions import SolutionService
from services.document_templates import create_new_section
from nifi_automation_script import REF_PIPELINE
from config_vars import HTTP_PROTO, DEFAULT_SECTION
from xpms_common.service_finder import find_service
from xpms_common import trace
from utilities.http import post_job
from nifi_automation_script import get_default_nifi_pipeline_config

tracer = trace.Tracer.get_instance(SERVICE_NAME)

def pipeline_params(solution_id):
    return {"nifi_link": HTTP_PROTO + get_nifi_link(solution_id) + "/nifi/", "elk_link": HTTP_PROTO + ELK_HOST + ":" + str(ELK_PORT)}


def pl_status(solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        # url = pipeline_params()["nifi_link"]
        url = HTTP_PROTO + get_nifi_link(solution_id)
        resp = get(url)
        if resp and "status" in resp.keys() and resp["status"] == "success":
            if "result" in resp.keys() and "Unable to communicate with NiFi" in str(resp["result"]):
                return {"status": "success", "is_nifi": False}
            else:
                return {"status": "success", "is_nifi": True}
        else:
            return {"status": "success", "is_nifi": False}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "is_nifi": False}
    finally:
        context.end_span()


def update_s3_bucket(request):
    if request.method == 'POST':
        payload = json.loads(request.body.decode())
        try:
            MongoDbConn.update(CONFIG_COLLECTION, where_clause={},
                               query={"s3_claims_bucket": payload["s3_claims_bucket"]})
            resp = {"status": "success", "msg": "updated bucket."}
        except:
            resp = {"status": "failure", "msg": "failed to update bucket."}
        return resp
    elif request.method == "GET":
        return get_s3_bucket()


def get_s3_bucket():
    result = MongoDbConn.find_one(CONFIG_COLLECTION, {})
    resp = dict()
    if result is not None:
        resp['default'] = result['s3_claims_bucket']

    # resp['data'] = [e.bucket for e in S3Bucket.objects.all()]
    resp['data'] = []
    return resp


def email_service(request):
    solution_id = get_solution_from_session(request)
    if request.method == "GET":
        return get_email_details(solution_id)
    elif request.method == 'POST':
        payload = json.loads(request.body.decode())
        return update_email_details(solution_id,payload)


def update_email_details(solution_id,payload):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = dict(solution_id = solution_id, data=dict(source_type="email",service_name="source",solution_id=solution_id,
                    configuration=payload))
        response = post_job(CONFIGURE_EMAIL,data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                MongoDbConn.update(SOURCE_COLLECTION, where_clause=dict(solution_id=solution_id,source_type="email"), query=data["data"])
                temp_result = create_email_template(solution_id,payload)
                if temp_result["status"] == "success":
                    return {"status": "success", "msg": "Updated email details.",
                            'job_id': job_id}
                else:
                    return temp_result
            else:
                return {'status': 'failure', 'msg': 'Error in updating emails',
                        'error': result, 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timeout',
                    "error": response, 'job_id':job_id}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "Failed to update details.",
                    'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Failed to update details."}
    finally:
        context.end_span()



def create_email_template(solution_id,payload):
    job_id = None
    temp_result = {"status" :"failure"}
    template = MongoDbConn.find_one(TEMPLATE_COLLECTION,
                                    {"solution_id": solution_id, "template_name": "email", "is_deleted": False})
    if template is None:
        template_data = format_template_data(solution_id)
        response = post_job(TEMPLATE_CONFIG["SAVE"],template_data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                template_id = get_nested_value(response, "result.result.metadata.template_id")
                if template_id:
                    section_result = create_new_section(template_id,solution_id,DEFAULT_SECTION)
                    if section_result["status"] != "success":
                        return temp_result.update({'msg': 'Failed to create sections',
                                                   'error': section_result, 'job_id':job_id})
            else:
                return temp_result.update({'msg': 'Failed to create template',
                                           'error': result, 'job_id':job_id})
        else:
            return temp_result.update({'msg': 'Request timed out',
                                       'error': response, 'job_id':job_id})
    else:
        template_id = template["template_id"]

    element_result = update_elements(template_id,solution_id,payload)
    if element_result["status"] == "success":
        return {'status':'success'}
    else:
        return temp_result.update({'msg': 'Failed to create elements', 'error': element_result})


def format_template_data(solution_id):
    temp_data = dict(description="Email template",template_name="email",file_path="",is_display=False,
                is_draft=False)
    data = {"solution_id":solution_id,"data":temp_data}
    return data


def update_elements(template_id,solution_id,payload):
    result = {"status":"failure"}
    element = MongoDbConn.find_one(ELEMENTS_COLLECTION,
                                    {"solution_id": solution_id, "template_id": template_id, "is_deleted": False})
    email_field = dict(template_id=template_id,section_id="default",name="email_body",type="variable_field",
                       field_type="variable_field",map_to=payload["email_body"],is_doc_var=False,has_label=False,
                       value_coordinates=dict(x1=0,x2=0,y1=0,y2=0),page_no=0)
    if element is not None:
        email_field.update({"element_id":element["element_id"]})
    email_field["token"]="element"
    data = {"solution_id":solution_id,"data":email_field}
    response = post_job(TEMPLATE_CONFIG["SAVE"], data)
    if 'job_id' in response:
        result["job_id"] = response["job_id"]
    if not is_request_timeout(response):
        status, msg = get_response(response)
        if status:
            result["status"] = "success"
            result["msg"] = "Fields created/updated successfully"
        else:
            result["msg"] = msg
    else:
        result["msg"] = "Request timed out"
    return result


def get_email_details(solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        result = MongoDbConn.find_one(SOURCE_COLLECTION, dict(solution_id=solution_id,source_type="email"))
        if result is not None:
            template = MongoDbConn.find_one(TEMPLATE_COLLECTION,
                                         {"solution_id": solution_id, "template_name" : "email", "is_deleted": False})
            if result is not None:
                email_mapping = template["fields"][0]["domain_mapping"]
            else:
                email_mapping = ""
            result["configuration"]["email_body"] = email_mapping
            return result["configuration"]
        else:
            return dict(email={})
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def ingest_file(request, collection, aws_bucket, aws_path):
    response = {"status":"failure"}
    if request.method == 'POST'and len(request.FILES) != 0:
        files_list = read_multiple_files(request)
        for file_key, file_value in files_list.items():
            # Saving File to media folder.
            solution_id = get_solution_from_session(request)
            file_data = save_to_folder(solution_id, file_value[0],MOUNT_PATH,"documents","uploads",flag=True)
            if file_data["status"] == "success":
                # file_name = file_data["data"]["filename"]
                # filename = " ".join(file_name.split()).replace(" ","_")
                # uploaded_file_url = file_data['data']["file_path"]
                # # posting to Amazon S3
                # resp = post_s3(str(filename), ROOT + uploaded_file_url, aws_bucket, aws_path)
                # # Formatting data for insert
                # data = create_data(None, file_data)
                # if resp['status'] == 'success':
                #     result_id = MongoDbConn.insert(collection, data)
                #     resp["document_id"] = str(result_id)
                # else:
                #     response['msg'] = "Error while ingesting the files into S3"
                #     return response
                #pipeline_name = PIPELINE_VARIABLES["INGEST_DOCUMENT"]
                #if solution_id == 'testcm_7ba1bb84-1362-434d-b596-0f01273c172e':
                pipeline_name = PIPELINE_VARIABLES["FILE_SOURCE"]
                payload = {"data": {"file_path" : file_data["data"]["relative_path"],
                                    "pipeline_name": pipeline_name,
                                    "request_type": SERVICE_REQUEST_TYPES["INGEST_DOCUMENT"]},
                           "solution_id":solution_id}
                resp = post(API_GATEWAY_POST_JOB_URI+PIPELINE["TRIGGER_PIPELINE"],payload)
                if resp['status'] != 'success':
                    response["msg"] = resp["msg"]
                    return response
            else:
                response['msg'] = "Error while saving the file"
                return response

    elif request.method == "POST":
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        if "files" in payload and payload["files"]:
            for file in payload["files"]:
                sftp_data = get_mountpath_fromsftp(solution_id,file)
                payload = {"data": {"file_path" : sftp_data["relative_path"]}, "solution_id":solution_id}
                resp = post(API_GATEWAY_POST_JOB_URI+DOCUMENT_ENDPOINT["ingest_flow"],payload)
                if resp['status'] != 'success':
                    response["msg"] = resp["msg"]
                    return response
        else:
            response["msg"] = "No files attached to the request"
            return response

    response['status'] = "success"
    response['msg'] = "File(s) uploaded Successfully"
    return response


def get_nifi_link(solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution = SolutionService().get_solution(solution_id=solution_id)
        if solution:
            solution_name = solution['solution_name']
            deploy_mode = os.environ['DEPLOY_MODE'] if 'DEPLOY_MODE' in os.environ else ''
            domain_name = os.environ['DOMAIN_NAME'] if 'DOMAIN_NAME' in os.environ else 'dev.xpms.ai'
            if deploy_mode == 'RANCHER':
                if 'STACK_NAME' in os.environ:
                    solution_name = os.environ['STACK_NAME'] + '-' + solution_name
                return "web." + str(solution_name) + ".pl." + domain_name+":8080"
            resp = find_service(REF_PIPELINE, fetch_all=True)
            if resp["status"]["success"]:
                try:
                    ref = ':' + solution_name + '-' + REF_PIPELINE + ':'
                    for service in resp["services_list"]:
                        if ref in service['service_id']:
                            return service["host"] + ":" + str(service["port"])
                except Exception as e:
                    context.log(message=str(e), obj={"tb": traceback.format_exc()})
            else:
                return ""
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()
    return ""


def get_pipelines(request):
    """
    This function will fetch all pipeline services
    and return the dictionary as response
    :param request: Http request
    :return: dictionary as response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        result = {"status": "failure"}
        solution_id = get_solution_from_session(request)
        if request.method == 'GET':
            data_dict = {'solution_id': solution_id,
                         'data': {}}
            response = post(API_GATEWAY_POST_JOB_URI + PIPELINE['GET_PIPELINE'], data_dict)
            if 'job_id' in response:
                result["job_id"] = response["job_id"]
            if not is_request_timeout(response):
                status, msg = get_response(response)
                if status:
                    result["status"] = "success"
                    result['status_code'] = STATUS_CODES['OK']
                    services = get_nested_value(response,
                                                "result.metadata.pipelines")
                    result["data"] = services
                    result['total_services'] = len(services)
                else:
                    result["error"] = msg
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
                    result["msg"] = "Error in retrieving the services information"
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        else:
            return {'status': 'failure',
                    'status_code': STATUS_CODES['BAD_REQUEST'],
                    'msg': 'GET request will be accepted.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'msg': 'Failed to fetch pipeline services group.'}
    finally:
        context.end_span()
