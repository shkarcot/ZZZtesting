"""
@author: Manoj.kr
@date: october, 2018
@purpose: The functions mentioned in this python file are responsible
          for all kind of NER service related operations.
          All functions are exposed as APIs.
"""

import json
import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import SERVICE_NAME, NER_LABEL_ENDPOINT, STATUS_CODES
from utilities.common import get_solution_from_session
from utilities.http import post_job, is_request_timeout, get_response, \
    get_nested_value


class NERConsole:
    """
    The functions mentioned in this python file are responsible
    for all kind of ner service related operations.
    All functions are exposed as APIs.
    """

    def __init__(self):
        self.tracer = trace.Tracer.get_instance(SERVICE_NAME)
        self.context = self.tracer.get_context(request_id=str(uuid4()),
                                               log_level="ERROR")
        self.context.start_span(component=__name__)

    def ner_service_label(self, request):
        """
        This function will fetch the list of all the ner labels
        and return the dictionary format response
        :param request: Http Request
        :return: Dict response
        """
        try:
            solution_id = get_solution_from_session(request)
            path = request.get_full_path()
            if request.method == 'GET':
                if 'nerservice/' in path:
                    return self.get_ner_labels(solution_id)
            if request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                if 'nerservice/' in path:
                    return self.create_ner_label(solution_id, payload)
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}
        finally:
            self.context.end_span()

    def get_ner_labels(self, solution_id):
        try:
            result = {"status": "failure"}
            res_data = {"solution_id": solution_id, "data": {}}
            func_result = post_job(NER_LABEL_ENDPOINT['GET'], res_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.ner_label_response")
                    result["data"] = func_result
                    result["msg"] = "NER labels fetched successfully"
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
                    result["msg"] = "Error in retrieving the list of NER labels."
            else:
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
                result["msg"] = "Request timed out"
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while fetching '
                           'the NER LABELS list.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}

    def create_ner_label(self, solution_id, payload):
        """
        This function will call the function service API to
        create a new ner label
        and return the response as dictionary
        :param solution_id: Session solution id
        :param payload: Http request payload
        :return: response as dictionary
        """
        try:
            result = {"status": "failure"}
            req_data = {'solution_id': solution_id, 'data': {}}
            req_data["data"].update(payload)
            func_result = post_job(NER_LABEL_ENDPOINT['CREATE'], req_data)
            if 'job_id' in func_result:
                result["job_id"] = func_result["job_id"]
            if not is_request_timeout(func_result):
                status, msg = get_response(func_result)
                if status:
                    result["status"] = "success"
                    func_result = get_nested_value(func_result,
                                                   "result.result.metadata.create_ner_response")
                    result["data"] = func_result
                    result['status_code'] = STATUS_CODES['OK']
                else:
                    result["error"] = msg
                    result["msg"] = "Error in creating the NER label."
                    result['status_code'] = STATUS_CODES['NOT_FOUND']
            else:
                result["msg"] = "Request timed out"
                result['status_code'] = STATUS_CODES['REQUEST_TIMEOUT']
            return result
        except Exception as e:
            self.context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'msg': 'Internal error occurred while creating '
                           'the NER label.',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'error': str(e)}
