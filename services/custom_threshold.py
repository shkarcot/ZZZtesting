"""
@author: Arshpreet Singh Khagura
@date: October 5, 2018
@purpose: The functions mentioned in this python file are responsible
          for Updating threshold values on solution level as well as on
          domain level.
"""

import json
from connections.mongodb import MongoDbConn
from datetime import datetime
from config_vars import WORKFLOW_COLLECTION, THRESHOLD_COLLECTION, \
    STATUS_CODES, SERVICE_NAME
import traceback
from uuid import uuid4
from xpms_common import trace

tracer = trace.Tracer.get_instance(SERVICE_NAME)


def custom_threshold(request, solution_id=None, workflow_id=None,
                     task_id=None):

    """this function will handle all the GET, POST and PUT methods
    from the API call to Update Threshold values"""
    context = tracer.get_context(request_id=str(uuid4()),
                                 log_level="ERROR")
    context.start_span(component=__name__)
    try:
        if request.method == 'GET':
            query = {'task_id': task_id,
                     'solution_id': solution_id,
                     'workflow_id': workflow_id,
                     'is_deleted': False}
            projection = {'_id': 0}
            thresholds = MongoDbConn.find_one(THRESHOLD_COLLECTION, query,
                                          projection=projection)
            if not thresholds:
                thresholds = {}
            return {"status": "success", "data": thresholds,
                    'status_code': STATUS_CODES['OK'],
                    'msg': 'Threshold fetched successfully.'}
        elif request.method == 'POST':
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            query = {'task_id': task_id,
                     'solution_id': solution_id,
                     'workflow_id': workflow_id,
                     'is_deleted': False}
            projection = {'_id': 0}
            thresholds = MongoDbConn.find_one(THRESHOLD_COLLECTION, query,
                                          projection=projection)
            if thresholds:
                return {'status': 'failure', 'status_code': STATUS_CODES['FOUND'],
                        'msg': 'threshold already available for this configuration.'}
            data_dict = dict()
            data_dict.update({'created_ts': datetime.utcnow().isoformat(),
                              'updated_ts': datetime.utcnow().isoformat(),
                              'is_deleted': False,
                              'solution_id': solution_id,
                              'workflow_id': workflow_id,
                              'task_id': task_id,
                              'thresholds': payload['threshold'],
                              'applicable': payload['applicable']})
            try:
                MongoDbConn.insert(THRESHOLD_COLLECTION, data_dict)
                return {"status": "success", 'status_code': STATUS_CODES['OK'],
                        'msg': 'Threshold saved successfully.'}
            except Exception as e:
                context.log(message=str(e), obj={"tb": traceback.format_exc()})
                return {"status": "Failure", "msg": "not able to save threshold",
                        'status_code': STATUS_CODES['FORBIDDEN']}
        elif request.method == 'PUT':
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            payload.update({'updated_ts': datetime.utcnow().isoformat()})
            query = {'task_id': task_id,
                     'solution_id': solution_id,
                     'workflow_id': workflow_id,
                     'is_deleted': False}
            projection = {'_id': 0}
            thresholds = MongoDbConn.find_one(THRESHOLD_COLLECTION, query,
                                              projection=projection)
            if not thresholds:
                return {'status': 'failure', 'status_code': STATUS_CODES['NOT_FOUND'],
                        'msg': 'threshold record not available for this configuration.'}
            thresholds['thresholds'] = payload['threshold']
            thresholds['applicable'] = payload['applicable']
            thresholds.update({'updated_ts': datetime.utcnow().isoformat()})
            MongoDbConn.update(THRESHOLD_COLLECTION, query, thresholds)
            return {"status": "success", 'status_code': STATUS_CODES['OK'],
                    'msg': 'Threshold updated successfully.'}
        elif request.method == 'DELETE':
            query = {'task_id': task_id,
                     'solution_id': solution_id,
                     'workflow_id': workflow_id}
            projection = {'_id': 0}
            th_recs = MongoDbConn.find_one(THRESHOLD_COLLECTION, query,
                                           projection=projection)
            if th_recs:
                th_recs['is_deleted'] = True
                th_recs['updated_ts'] = datetime.utcnow().isoformat()
                MongoDbConn.update(THRESHOLD_COLLECTION, query, th_recs)
                return {"status": "success", 'status_code': STATUS_CODES['OK'],
                        'msg': 'Threshold deleted successfully.'}
            else:
                return {"status": "failure", 'status_code': STATUS_CODES['OK'],
                        'msg': 'Threshold not available.'}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'msg': 'Internal error occurred while fetching '
                       'the custom functions list.',
                'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                'error': str(e)}


def insert_threshold(request,solution_id,workflow_id,task_id,threshold_id):
    try:
        if request.method == 'POST':
            payload = json.loads(request.body.decode())
            query = {"solution_id": "developer_7f3970b4-8589-41a8-9030-d0065e407056"}
            wf_data_dict = MongoDbConn.find_one(WORKFLOW_COLLECTION,query)
            for value, soln_id in zip(payload, wf_data_dict["case_object"]):
                if (value == soln_id['variable_id']):
                    soln_id.update({"thresholds": payload[value]})
                    post_response = MongoDbConn.insert('thresholds_data', payload)
                    return ({"response":"success"})
        else:
            return ({"response": "method not working out"})
    except:
        pass




