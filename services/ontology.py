import json
import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import SERVICE_NAME, STATUS_CODES, ONTOLOGY_ENDPOINT, AMAZON_AWS_BUCKET
from xpms_common.storage_handler import StorageHandler
from utilities.http import post_job, is_request_timeout, get_response, get_nested_value

tracer = trace.Tracer.get_instance(SERVICE_NAME)


class Ontology:
    def __init__(self):
        self.tracer = trace.Tracer.get_instance(SERVICE_NAME)
        self.context = self.tracer.get_context(request_id=str(uuid4()),
                                               log_level="ERROR")
        self.context.start_span(component=__name__)

    def ontology_service(self, request, solution_id, id):
        try:
            path = request.get_full_path()
            if solution_id == None:
                return {'status': 'failure', 'msg': 'Solution_id is not provided.',
                        'status_code': STATUS_CODES['PRECONDITION_FAILED']}
            if request.method == 'GET':
                if id == None:
                    return self.get_all_ontologies(solution_id)
                else:
                    return self.get_ontology_versions(solution_id,id)
            if request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                if 'enable/' in path:
                    payload["id"]=id
                    return self.enable_ontology(solution_id, payload)
                return self.create_ontology(solution_id, payload)
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}
        finally:
            self.context.end_span()

    def get_all_ontologies(self, solution_id):
        try:
            result = {"status": "failure"}
            res_data = {"solution_id": solution_id, "data": {}}
            func_result = post_job(ONTOLOGY_ENDPOINT["GET"], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.ontologies")
                    result["data"] = func_result
                    result["msg"] = "ontologies fetched successfully"
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
                    result["msg"] = "Error in retrieving the list of ontologies."
            else:
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
                result["msg"] = "Request timed out"
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while fetching '
                           'the Ontologies_list.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def create_ontology(self, solution_id, payload):
        try:
            result = {"status": "failure"}
            req_data = {'solution_id': solution_id, 'data': payload}
            func_result = post_job(ONTOLOGY_ENDPOINT['SAVE'], req_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result, "result.result.metadata.ontology")
                    result["data"] = func_result
                    result["msg"] = func_result["msg"]
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = "Error in creating the ontology."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while creating '
                           'the ontology.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def get_ontology_versions(self, solution_id, id):
        try:
            result = {"status": "failure"}
            res_data = {"solution_id": solution_id, "data": {"id":id}}
            func_result = post_job(ONTOLOGY_ENDPOINT["GET_DETAILS"], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.ontology_versions")
                    #to get presigned path of versions
                    # version_url = []
                    # for version in func_result["versions_info"]:
                    #     path_url = version["file_path"].split("xpms-dev-d1109/")[-1]
                    #     try:
                    #         url=StorageHandler.presigned_get_url(AMAZON_AWS_BUCKET, path_url)
                    #     except Exception as e:
                    #         print(str(e))
                    #         url = ""
                    #     version['get_ontology_version_path'] = url
                    #     version_url.append(version)
                    # func_result["versions_info"] = version_url
                    result["data"] = func_result
                    result["msg"] = "ontology versions fetched successfully"
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
                    result["msg"] = "Error in retrieving the list of ontology versions"
            else:
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
                result["msg"] = "Request timed out"
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while fetching '
                           'the Ontology versions_list.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def enable_ontology(self, solution_id, payload):
        try:
            result = {"status": "failure"}
            req_data = {'solution_id': solution_id, 'data': payload}
            func_result = post_job(ONTOLOGY_ENDPOINT['ENABLE'], req_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result, "result.result.metadata.ontology_enableing")
                    result["data"] = func_result["ontology"]
                    result["msg"] = func_result["ontology"]["msg"]
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = "Error in enable/disable the ontology  "
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while enable/disable the ontology.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}