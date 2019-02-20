"""
@author: Rohit Kumar Jaju
@date: October 22, 2018
@purpose: The functions mentioned in this python class are responsible
          for all kind of sources related CRUD operations.
          All functions are exposed as APIs.
"""

import json
import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import SERVICE_NAME, STATUS_CODES, CONSOLE_API_URL,\
    SOURCES_COLLECTION, PIPELINE, PIPELINE_VARIABLES, API_GATEWAY_POST_JOB_URI
from connections.mongodb import MongoDbConn
from datetime import datetime
import imaplib
from utilities.http import post


class SourcesServices:
    """
    The functions mentioned in this python class are responsible
    for all kind of sources related CRUD operations.
    All functions are exposed as APIs.
    """

    def __init__(self):
        """
        This is constructor for the SourcesService class.
        It is responsible for creating the logger object.
        """
        self.tracer = trace.Tracer.get_instance(SERVICE_NAME)
        self.context = self.tracer.get_context(request_id=str(uuid4()),
                                               log_level="ERROR")
        self.context.start_span(component=__name__)
        self.source_type = 'direct'

    def fetch_sources(self, solution_id, source_id):
        """
        This function will fetch the all/particular sources information
        and return the dictionary as response
        :param solution_id: Session Solution Id
        :param source_id: Sources Id
        :return: Dictionary as response
        """
        try:
            query = {'solution_id': solution_id, 'is_deleted': False,
                     'source_type': self.source_type}
            if source_id:
                query.update({'source_id': source_id})
            projection = {'_id': 0}
            resp = MongoDbConn.find(SOURCES_COLLECTION, query,
                                    projection=projection)
            source_recs = [item for item in resp]
            source_recs.sort(key=lambda f: f['updated_ts'], reverse=True)
            return {'status': 'success',
                    'status_code': STATUS_CODES['OK'],
                    'msg': 'Source fetched successfully for this solution.',
                    'data': source_recs,
                    'total_recs': len(source_recs)}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to fetch the source/s information.'}

    def save_sources(self, payload, solution_id):
        """
        This function will save the sources in the MongoDB
        and return the dictionary as response
        :param payload: Request payload
        :param solution_id: session Solution Id
        :return: dictionary as response
        """
        try:
            name = ''
            if 'name' in payload:
                name = payload['name']
            if 'source_type' in payload:
                self.source_type = payload['source_type']
            if self.source_type == 'email':
                query = {'solution_id': solution_id, 'name': name,
                         'is_deleted': False, 'source_type': self.source_type}
                projection = {'_id': 0}
                source_recs = MongoDbConn.find_one(SOURCES_COLLECTION, query,
                                                   projection=projection)
                if source_recs:
                    return {'status': 'failure',
                            'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                            'msg': 'Email source with ' + name +
                                   ' already present in this solution.'}
            payload = self.update_payload(payload)
            # Trigger pipeline when source is uploaded
            pipeline_name = PIPELINE_VARIABLES["FILE_SOURCE"]
            pipeline_payload = {"data": {"file_path": payload['file_path'],
                                         "pipeline_name": pipeline_name,
                                         "workflow_id": payload['workflow_id']},
                                "solution_id": solution_id}
            resp = post(API_GATEWAY_POST_JOB_URI + PIPELINE["TRIGGER_PIPELINE"], pipeline_payload)
            if resp['status'] == 'success':
                MongoDbConn.insert(SOURCES_COLLECTION, payload)
                return {'status': 'success',
                        'status_code': STATUS_CODES['OK'],
                        'msg': 'Source ' + name +
                               ' saved successfully in this solution and triggered the pipeline.'}
            else:
                return {'status': 'failure',
                        'status_code': STATUS_CODES['BAD_REQUEST'],
                        'msg': 'Source ' + name +
                               ' not saved in this solution and not triggered the pipeline.'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to save the source/s information.'}

    def update_payload(self, payload):
        """
        This function will update the payload
        and return the updated payload
        :param payload: request payload to be updated
        :return: updated payload
        """
        try:
            source_id = str(uuid4())
            created_ts = datetime.utcnow().isoformat()
            updated_ts = datetime.utcnow().isoformat()
            payload.update({'source_id': source_id,
                            'created_ts': created_ts,
                            'updated_ts': updated_ts,
                            'is_deleted': False})
            if 'triggers' in payload:
                updated_triggers = self.update_values(payload['triggers'],
                                                      'trigger')
                payload.update({'triggers': updated_triggers})
            if 'schedules' in payload:
                updated_schedules = self.update_values(payload['schedules'],
                                                       'schedule')
                payload.update({'schedules': updated_schedules})
            return payload
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return payload

    def update_values(self, values, key):
        """
        This function will read the values list and update the time-stamp
        and return the updated values
        :param values: List of value
        :param key: uuid need to be added for this key
        :return: updated list of value
        """
        try:
            updated_values = []
            for value in values:
                value[key+'_id'] = str(uuid4())
                value['created_ts'] = datetime.utcnow().isoformat()
                value['updated_ts'] = datetime.utcnow().isoformat()
                updated_values.append(value)
            return updated_values
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return values

    def get_source(self, solution_id, source_id):
        """
        This function will fetch the source record
        and return the dictionary as response
        :param solution_id: Session Solution Id
        :param source_id: Id of the source
        :return: source record
        """
        try:
            if not source_id:
                return {'status': 'failure',
                        'status_code': STATUS_CODES['PRECONDITION_FAILED'],
                        'msg': 'Source Id is not available in the request.'}
            query = {'solution_id': solution_id,
                     'source_type': self.source_type,
                     'source_id': source_id, 'is_deleted': False}
            projection = {'_id': 0}
            source_rec = MongoDbConn.find_one(SOURCES_COLLECTION, query,
                                              projection=projection)
            status_code = STATUS_CODES['OK']
            return source_rec, query, status_code
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return None, None, None

    def process_source_request(self, request, source_type,
                               solution_id=None, source_id=None):
        """
        This function is responsible for handling all requests related
        to sources and return the dictionary as response
        :param request: Http request
        :param source_type: Source of documents
        :param solution_id: Session Solution Id
        :param source_id: Source Id
        :return: dictionary as response
        """
        try:
            if not solution_id:
                return {'status': 'failure',
                        'status_code': STATUS_CODES['PRECONDITION_FAILED'],
                        'msg': 'Solution Id is not available in the request.'}
            self.source_type = source_type
            if request.method == 'GET':
                return self.fetch_sources(solution_id, source_id)
            elif request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                return self.save_sources(payload, solution_id)
            elif request.method == 'PUT':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                return self.update_sources(payload, solution_id,
                                           source_id)
            elif request.method == 'DELETE':
                return self.delete_source(solution_id, source_id)
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to process sources request.'}
        finally:
            self.context.end_span()

    def delete_source(self, solution_id, source_id):
        """
        This function will delete the particular source
        and return the dictionary as response
        :param solution_id: Session Solution Id
        :param source_id: Sources Id
        :return: Dictionary as response
        """
        try:
            source_rec, query, status_code = self.get_source(solution_id,
                                                             source_id)
            if not source_rec or \
                    status_code == STATUS_CODES['PRECONDITION_FAILED']:
                return {'status': 'failure',
                        'status_code': STATUS_CODES['NO_CONTENT'],
                        'msg': 'Source/s not available to delete.'}
            source_rec['is_deleted'] = True
            source_rec['updated_ts'] = datetime.utcnow().isoformat()
            MongoDbConn.update(SOURCES_COLLECTION, query, source_rec)
            return {'status': 'success',
                    'status_code': STATUS_CODES['OK'],
                    'msg': 'Source/s has been deleted successfully.'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to delete the source/s.'}

    def update_sources(self, payload, solution_id, source_id):
        """
        This function will save the sources in the MongoDB
        and return the dictionary as response
        :param payload: Request payload
        :param solution_id: session Solution Id
        :param source_id: Id of the Source which needs to be updated
        :return: dictionary as response
        """
        try:
            source_rec, query, status_code = self.get_source(solution_id,
                                                             source_id)
            if not source_rec or \
                    status_code == STATUS_CODES['PRECONDITION_FAILED']:
                return {'status': 'failure',
                        'status_code': STATUS_CODES['NO_CONTENT'],
                        'msg': 'Source/s not available to update.'}
            payload['updated_ts'] = datetime.utcnow().isoformat()
            if 'triggers' in payload:
                triggers = payload['triggers']
                for trigger in triggers:
                    trigger['updated_ts'] = datetime.utcnow().isoformat()
                payload['triggers'] = triggers
            if 'schedules' in payload:
                schedules = payload['schedules']
                for schedule in schedules:
                    schedule['updated_ts'] = datetime.utcnow().isoformat()
                payload['schedules'] = schedules
            MongoDbConn.update(SOURCES_COLLECTION, query, payload)
            return {'status': 'success',
                    'status_code': STATUS_CODES['OK'],
                    'msg': 'Source ' + payload['name'] +
                           ' updated successfully in this solution.'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to save the source/s information.'}

    def get_s3_bucket_url(self, request):
        """
        This function will prepare the S3 bucket url
        and return the response
        :param request: Http request
        :return: S3 bucket URL
        """
        try:
            if request.method == 'GET':
                url = CONSOLE_API_URL + 'api/presignedurl/'
                return {'status': 'success',
                        'status_code': STATUS_CODES['OK'],
                        'msg': 'S3 bucket url prepared successfully',
                        'data': url}
            return {'status': 'failure',
                    'status_code': STATUS_CODES['BAD_REQUEST'],
                    'msg': 'Only GET request will be accepted.'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['INTERNAL_SERVER_ERROR'],
                    'msg': 'Failed to prepare S3 Bucket URL.'}

    def test_email_connection(self, request):
        """
        This function will check the email connection
        and return the response
        :param request: Http Response
        :return: Email connection response
        """
        con = None
        try:
            if request.method == 'POST':
                try:
                    payload = json.loads(request.body.decode())
                except:
                    payload = request.POST
                con = imaplib.IMAP4_SSL(payload['host'],
                                        payload['port'])
                status, msg = con.login(payload['email'],
                                        payload['password'])
                if status == 'OK':
                    return {'status': 'success',
                            'status_code': STATUS_CODES['OK'],
                            'msg': str(msg)}
                return {'status': 'failure',
                        'status_code': STATUS_CODES['NOT_FOUND'],
                        'msg': 'Test connection failed'}
            return {'status': 'failure',
                    'status_code': STATUS_CODES['BAD_REQUEST'],
                    'msg': 'Only POST request will be accepted.'}
        except Exception as e:
            self.context.log(message=str(e),
                             obj={"tb": traceback.format_exc()})
            return {'status': 'failure',
                    'status_code': STATUS_CODES['FORBIDDEN'],
                    'msg': str(e)}
        finally:
            if con:
                con.logout()
