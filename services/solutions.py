import traceback
import uuid, json
from uuid import uuid4
from xpms_common import trace
from config_vars import SOLN, DEFAULT_ENTITY_ID, NEW_SOLN_TRIGGER, CASE_MANAGEMENT_SERVICE_URL, \
    SERVICE_NAME, SOLUTION_COLLECTION,WORKFLOW_COLLECTION,STATUS_CODES
from test.vars_testing import TEST_SOLN_NAME
from connections.mongodb import MongoDbConn
from utilities import common
from utilities.http import post_job, is_message_published, post
from utilities.common import is_request_timeout, get_solution_from_session
from datetime import datetime
from nifi_automation_script import create_nifi_pipeline_config, remove_nifi_pipeline_config
# from api.models import Solution
from builtins import staticmethod
from jrules_lib.rule_manager import RuleManager
import re, requests
import math
# from xpms_common.sftp_handler import SFTPManager

tracer = trace.Tracer.get_instance(SERVICE_NAME)


def solution_request(request, solution_name):
    if request.method == 'GET':
        payload = dict()
        if solution_name != '':
            payload['solution_name'] = solution_name
        result = SolutionService().process(request.method, payload)
        return result
    if request.method == 'PUT':
        payload = json.loads(request.body.decode())
        result = SolutionService().process(request.method, payload)
        return result
    else:
        payload = json.loads(request.body.decode())
        result = SolutionService().process(request.method, payload)
        return result


class SolutionService:

    def __init__(self):
        self.collection_name = SOLN['collection']

    def process(self, request_method, request_data):
        if request_method == 'POST':
            return self.create_solution(request_data)
        elif request_method == 'GET':
            return self.get_solutions()
        elif request_method == 'PUT':
            return self.update_solutions(request_data)
        elif request_method == 'DELETE':
            return self.delete_solution(request_data)

    @staticmethod
    def create_solution(soln):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            # verify solution name already exists
            soln_name = soln["solution_name"]
            if bool(re.match('^[a-zA-Z0-9\s]+$', soln_name)):
                soln_ref_name = str(soln_name).lower().replace(' ', '-')
            else:
                return {"status": "failure", "msg": "invalid characters in solution name"}
            soln_ref_id = soln_ref_name + "_" + str(uuid.uuid4())
            soln_exists = None
            try:
                query = {'solution_name': soln_name, 'is_deleted': False}
                projection = {'_id': 0}
                soln_exists = MongoDbConn.find_one(SOLUTION_COLLECTION, query,
                                               projection=projection)
            except Exception as e:
                context.log(message=str(e), obj={"tb": traceback.format_exc()})
                return {'status': 'failure', 'msg': 'Error occurred while creating solution'}
            if soln_exists:
                return {'status': 'failure',
                        'msg': (soln['solution_name']) + ' - solution name already exists'}
            else:
                # Initialising Nifi
                if "is_pipeline" in soln and soln["is_pipeline"]:
                    create_nifi_pipeline_config(soln_ref_id, soln_ref_name)
                data_dict = {'solution_id': soln_ref_id, 'solution_name': soln_name,
                             'solution_type': soln["solution_type"],
                             'description': soln["description"], 'is_deleted': False,
                             'created_ts': datetime.utcnow().isoformat(),
                             'updated_ts': datetime.utcnow().isoformat(),
                             'hocr_type': 'XPMS'}
                resp = SolutionService.create_default_caseflow(soln_ref_id, context)
                if resp['status'] == 'success':
                    wf_msg = 'Default Workflow, BPMN and Queues has been created.'
                else:
                    wf_msg = 'Error while creating default Workflow, BPMN and Queues.'
                MongoDbConn.insert(SOLUTION_COLLECTION, data_dict)
                try:
                    RuleManager().process("saveDefaultRules", {"solution_id": soln_ref_id})
                except Exception as e:
                    context.log(message=str(e), obj={"tb": traceback.format_exc()})
                # Initialising Services
                SolutionService().solution_trigger(soln_ref_id)
                return {'status': 'success',
                        'msg': (soln['solution_name']) + ' - solution has been created. ' + wf_msg}
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {"status": "failure", "msg": str(e)}
        finally:
            context.end_span()

    @staticmethod
    def get_solution(solution_id=None, solution_name=None):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            query = {'is_deleted': False}
            projection = {'_id': 0}
            if solution_id is not None:
                query.update({'solution_id': solution_id})
            elif solution_name is not None:
                query.update({'solution_name': solution_name})
            soln_data = MongoDbConn.find_one(SOLUTION_COLLECTION, query,
                                             projection=projection)
            return soln_data
        # TODO raise specific exception
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return None
        finally:
            context.end_span()

    @staticmethod
    def get_solutions():
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            solns_data = None
            try:
                query = {'is_deleted': False}
                projection = {'_id': 0}
                solns_data = MongoDbConn.find(SOLUTION_COLLECTION, query,
                                         projection=projection).sort('updated_ts', -1)
            # TODO raise specific exception
            except Exception as e:
                context.log(message=str(e), obj={"tb": traceback.format_exc()})
                return {'status': 'failure', 'msg': 'Error occurred while fetching solutions'}
            if solns_data:
                solns = [soln for soln in solns_data]
                resp = [{"solution_id": e['solution_id'], "solution_name": e['solution_name'],
                         "solution_type": e['solution_type'], "description": e['description'],
                         "timestamp": e['updated_ts'],
                         'hocr_type': e['hocr_type']} for e in solns]
                return {'status': 'success', 'msg': 'Solutions list', "data": resp}
            else:
                return {'status': 'success', 'msg': 'No solutions exists'}
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure', 'msg': 'Error occurred while fetching solutions'}
        finally:
            context.end_span()

    @staticmethod
    def delete_solution(soln):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            solution_id = soln["solution_id"]
            soln_exists = None
            try:
                query = {'solution_id': solution_id}
                projection = {'_id': 0}
                soln_exists = MongoDbConn.find_one(SOLUTION_COLLECTION, query,
                                               projection=projection)
            # TODO raise specific exception
            except Exception as e:
                context.log(message=str(e), obj={"tb": traceback.format_exc()})
                return {'status': 'failure', 'msg': 'Error occurred while deleting solution'}
            if soln_exists:
                solution_name = soln_exists['solution_name']
                remove_nifi_pipeline_config(solution_name)
                SolutionService.delete_workflows_bpmn_queues(solution_id, context)
                soln_exists['is_deleted'] = True
                soln_exists['updated_ts'] = datetime.utcnow().isoformat()
                MongoDbConn.update(SOLUTION_COLLECTION, query, soln_exists)
                status = {'status': 'success', 'msg': solution_name + ' - solution has been deleted'}
                return status
            else:
                status = {'status': 'failure', 'msg': 'Solution does not exists'}
                return status
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure', 'msg': 'Error occurred while deleting solution'}
        finally:
            context.end_span()

    @staticmethod
    def solution_trigger(solution_id):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            job_id = None
            payload = {"solution_id": solution_id, "entity_id": DEFAULT_ENTITY_ID, "data": {}}
            response = post_job(NEW_SOLN_TRIGGER, payload)
            if 'job_id' in response:
                job_id = response["job_id"]
            if not is_request_timeout(response):
                if is_message_published(response):
                    return {'status': 'success', 'msg': 'Solution initialized',
                            'job_id': job_id}
                else:
                    return {'status': 'failure', 'msg': 'Failed to initialise',
                            'job_id': job_id}
            else:
                return {'status': 'failure', 'msg': 'Request timeout',
                        'job_id': job_id}
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure', 'msg': 'exception occerd : '+ str(e)}
        finally:
            context.end_span()

    @staticmethod
    def update_solutions(req_data):
        solns = None
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            query = {'is_deleted':False,'solution_id':req_data["solution_id"]}
            projection = {'_id': 0}
            solns = MongoDbConn.find_one(SOLUTION_COLLECTION, query,
                                         projection=projection)
            # solns = Solution.objects.get(deleted=False,solution_id=req_data["solution_id"])
            if solns:
                solns['hocr_type'] = req_data["hocr_type"]
                # Solution.objects.update(solns)
                # solns.save()
                MongoDbConn.update(SOLUTION_COLLECTION, query, solns)
                return {'status': 'success', 'msg': 'updated Solutions list'}
            else:
                return {'status': 'success', 'msg': 'No solutions exists'}
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure', 'msg': 'exception occerd : '+ str(e)}
        finally:
            context.end_span()

    @staticmethod
    def create_default_caseflow(solution_id, context):
        """
        This function is responsible for creation of the
        default workflows, BPMN and Queues
        :param solution_id: Solution Id
        :param context: Logger Object
        :return: Dictionary
        """
        try:
            wf_url = CASE_MANAGEMENT_SERVICE_URL+'workflow/default'
            wf_payload = {"data":{"name": "default_case_flow","description": "default case flow"},
                          "solution_id":solution_id}
            resp = post(wf_url, wf_payload)
            return resp
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure'}

    @staticmethod
    def delete_workflows_bpmn_queues(solution_id, context):
        try:
            wf_url = CASE_MANAGEMENT_SERVICE_URL+'workflow/delete'
            wf_payload = {"data":{}, "solution_id":solution_id}
            requests.delete(wf_url, data=json.dumps(wf_payload))
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})


def get_solution_id(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        solution_name = ""
        query = {'solution_id': solution_id}
        projection = {'_id': 0}
        soln_exists = MongoDbConn.find_one(SOLUTION_COLLECTION, query,
                                       projection=projection)
        if soln_exists:
            solution_name = soln_exists['solution_name']
        return {"solution_id": solution_id, 'solution_name': solution_name,
                'case_management_url': CASE_MANAGEMENT_SERVICE_URL, "status": "success"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()
