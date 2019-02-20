"""
@author: Rohit Kumar Jaju
@date: August 21, 2018
@purpose: The functions mentioned in this python file are responsible
          for all kind of Custom Functions related CRUD operations.
          All functions are exposed as APIs.
"""

import json
import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import SERVICE_NAME, CUSTOM_FUNCTIONS_ENDPOINT, STATUS_CODES
from utilities.common import get_solution_from_session
from utilities.http import post_job, is_request_timeout, get_response, \
    get_nested_value
from services.models import implement_pagination


class ConsoleFaaS:
    """
    The functions mentioned in this python file are responsible
    for all kind of Custom Functions related CRUD operations.
    All functions are exposed as APIs.
    """

    def __init__(self):
        """
        The functions mentioned in this python file are responsible
        for all kind of Custom Functions related CRUD operations.
        All functions are exposed as APIs.
        """
        self.tracer = trace.Tracer.get_instance(SERVICE_NAME)
        self.context = self.tracer.get_context(request_id=str(uuid4()),
                                               log_level="ERROR")
        self.context.start_span(component=__name__)

    def custom_functions(self, request, function_name=None):
        """
        This function will fetch the list of all the custom functions
        and return the dictionary format response
        :param request: Http Request
        :param function_name: Specific function name
        :return: Dict response
        """
        try:
            solution_id = get_solution_from_session(request)
            path = request.get_full_path()
            if request.method == 'GET':
                if 'customfunctions/' in path:
                    return self.get_custom_functions_detail(solution_id, function_name)
            if request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                if 'enable/' in path:
                    return self.enable_custom_function(solution_id, payload)
                elif 'open/' in path:
                    return self.open_custom_function(solution_id, payload)
                elif 'save/' in path:
                    return self.save_custom_function(solution_id, payload)
                elif 'create/' in path:
                    return self.create_custom_function(solution_id, payload)
                elif 'publish/' in path:
                    return self.publish_custom_function(solution_id, payload)
                elif 'test/' in path:
                    return self.test_custom_function(solution_id, payload)
                elif 'logs/' in path:
                    return self.custom_function_logs(solution_id, payload)
                if 'enable_version/' in path:
                    return self.enable_version_custom_function(solution_id, payload)
                return self.get_custom_functions_list(solution_id, payload)
            if request.method == 'DELETE':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                if 'customfunctions/' in path:
                    return self.delete_custom_function(solution_id, payload)
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}
        finally:
            self.context.end_span()

    def get_custom_functions_list(self, solution_id, payload):
        """
        This function will call the function service API to
        get the all custom functions
        and return the dict response with all required fields
        :param solution_id: Session solution id
        :param payload: request payload
        :return: dict response
        """
        try:
            result = {"status": "failure"}
            searched_text, filter_obj = None, None
            res_data={"solution_id":solution_id,"data":{}}
            if 'searched_text' in payload:
                searched_text = payload['searched_text']
            if 'filter_obj' in payload:
                filter_obj = payload['filter_obj']
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['GET'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.list_functions_response")
                    if searched_text and searched_text.strip() != '':
                        func_result = self.get_filtered_result(func_result,
                                                               searched_text)
                    if filter_obj and len(func_result) > 0:
                        func_result, total_functions = implement_pagination(func_result,
                                                                            filter_obj,
                                                                            'updated_ts')
                        func_result=self.change_version(func_result)
                    else:
                        total_functions = len(func_result)
                    result["data"] = func_result
                    result['total_functions'] = total_functions
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
                    result["msg"] = msg['message'] if "message" in msg else "Error in retrieving the list of custom function."
            else:
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
                result["msg"] = "Request timed out"
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while fetching '
                           'the custom functions list.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def get_filtered_result(self, results, searched_text):
        """
        This function will filter the input result
        and filter the content based on the searched text
        and return the filtered result
        :param results: list of dictionaries get by post job response
        :param searched_text : text to be searched
        :return: filtered results
        """
        try:
            filtered_result = []
            for res in results:
                if searched_text in res['function_name']:
                    filtered_result.append(res)
            return filtered_result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return []

    def change_version(self,data):
        filtered_result=[]
        for res in data:
            if "versions" in res.keys():
                for each in res["versions"]:
                    var = dict({"version": ""})
                    if "is_active" in each.keys() and each["is_active"] == True:
                        var["version"] = each["version"]
                res["current_version"] = var["version"]
            filtered_result.append(res)
        return filtered_result

    def get_custom_functions_detail(self, solution_id, function_name=None):
        """
        This function will call the function service API to
        get the custom functions detail
        and return the dict response with all required fields
        :param solution_id: Session solution id
        :param function_name: Specific function name
        :return: dict response
        """
        try:
            result = {"status": "failure"}
            res_data = {"solution_id": solution_id, "data": {}}
            if function_name:
                res_data["data"].update({'function_name': function_name})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['DETAILS'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.list_functions_response")
                    func_result.sort(key=lambda f: f['updated_ts'], reverse=True)
                    total_functions = len(func_result)
                    result["data"] = func_result
                    result['total_functions'] = total_functions
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in retrieving the details of custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while fetching '
                           'the custom functions detail.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def enable_custom_function(self, solution_id, payload):
        """
        This function will call the function service API to
        enable the required custom function
        and disables the other versions of the custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: Dictionary response
        """
        try:
            result = {"status": "failure"}
            res_data = {'solution_id': solution_id,"data":{}}
            res_data["data"].update({'function_name': payload['function_name'],
                         'is_active': payload['is_active']})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['ENABLE'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.enable_function_response")
                    result["data"] = func_result
                    result["msg"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in enabling the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while enabling '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def enable_version_custom_function(self, solution_id, payload):
        """
        This function will call the function service API to
        enable the required custom function
        and disables the other versions of the custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: Dictionary response
        """
        try:
            result = {"status": "failure"}
            res_data = {'solution_id': solution_id,'data':{}}
            res_data["data"].update({'function_name': payload['function_name'],'is_active': payload['is_active'],
                         'function_version': payload['function_version']})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['ENABLE_VERSION'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.enable_version_response")
                    result["data"] = func_result
                    result["msg"] = func_result  # "version enabled for the custom function."
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in enabling the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while enabling '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}


    def delete_custom_function(self, solution_id, payload=None):
        """
        This method will call the function service API to
        delete the particular custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param function_name: Specific Function Name
        :return: response as dictionary
        """
        try:
            result = {"status": "failure"}
            res_data = {'solution_id': solution_id,"data":{}}
            if payload:
                res_data["data"].update({'function_name': payload["function_name"],
                                         'function_version': payload['function_version']})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['DELETE'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.delete_function_response")
                    result["data"] = func_result
                    result["msg"] = "deleted the custom function version."
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = "Error in deleting the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while deleting '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def open_custom_function(self, solution_id, payload):
        """
        This function will call the function service API to
        return the Jupyter notebook path to open
        a particular custom function for editing purpose.
        :param solution_id: Session Solution Id
        :param payload: Http request Payload
        :return: Jupyter Notebook path for a particular custom function
        """
        try:
            result = {"status": "failure"}
            res_data = {'solution_id': solution_id,"data":{}}
            res_data["data"].update({'function_name': payload['function_name'],
                         'function_version': payload['function_version'],'is_fork':payload["is_fork"]})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['OPEN'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.open_function_response")
                    result["data"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in opening the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while opening '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def create_custom_function(self, solution_id, payload):
        """
        This function will call the function service API to
        create a new custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: response as dictionary
        """
        try:
            result = {"status": "failure"}
            req_data = {'solution_id': solution_id, 'data': {}}
            req_data["data"].update({'function_name': payload['function_name'],
                                     'function_desc': payload['function_desc'],
                                     'function_type': payload['function_type']})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['CREATE'], req_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.create_function_response")
                    result["data"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in creating the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while creating '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def save_custom_function(self, solution_id, payload):
        """
        This function will call the function service API to
        create a new custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: response as dictionary
        """
        try:
            result = {"status": "failure"}
            req_data = {'solution_id': solution_id, 'data': {}}
            req_data["data"].update({'function_name': payload['function_name'],
                                     'function_version': payload['function_version']})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['SAVE'], req_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.save_function_response")
                    result["data"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in saving the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while saving '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def publish_custom_function(self, solution_id, payload):
        """
        This function will call the function service API to
        publish the custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: response as dictionary
        """
        try:
            result = {"status": "failure"}
            res_data = {'solution_id': solution_id,"data":{}}
            res_data["data"].update({'function_name': payload['function_name'],
                         'function_version': payload['function_version']})
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['PUBLISH'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,"result.result.metadata.publish_function_response")
                    result["msg"] = "custom function published and deployed sucessfully"
                    result["data"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in publishing the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while publishing '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def test_custom_function(self, solution_id, payload):
        """
        This function will call the function service API to
        test the custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: response as dictionary
        """
        try:
            result = {"status": "failure"}
            req_data = {'solution_id': solution_id,"data":{}}
            payload["exec_id"] = str(uuid4())
            if 'params' not in payload.keys():
                payload["params"]={}
            req_data["data"].update(payload)
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['TEST'], req_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.execution_response")
                    result["data"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in testing the custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while testing '
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def custom_function_logs(self, solution_id, payload):
        """
        This function will call the function service API to
        get the logs for a particular custom function
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: response as dictionary
        """
        try:
            result = {"status": "failure"}
            req_data = {'solution_id': solution_id,'data':{}}
            if 'exec_id' in payload:
                req_data["data"].update(payload)
            func_result = post_job(CUSTOM_FUNCTIONS_ENDPOINT['LOGS'], req_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.function_logs_response")
                    result["data"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = msg['message'] if "message" in msg else "Error in getting the logs for custom function."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while getting the logs for'
                           'the custom function.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}
