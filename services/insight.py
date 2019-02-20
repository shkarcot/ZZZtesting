from datetime import datetime
import traceback, json
from uuid import uuid4

from django.http.response import JsonResponse
from xpms_common import trace

from config_vars import INSIGHT_CONFIG, NLP_CONFIG, DEFAULT_ENTITY_ID, LEARNING_CONFIG, SERVICE_NAME
from connections.mongodb import MongoDbConn
from utilities.common import get_file_contents, is_request_timeout, get_solution_from_session
from utilities.http import is_message_published, post_job


tracer = trace.Tracer.get_instance(SERVICE_NAME)


class InsightService:
    """"
     Service class to configure insight engine.
    """
    def __init__(self, request_type, solution_id):
        self.collection_name = INSIGHT_CONFIG['collection']
        self.type = request_type
        self.solution_id = solution_id

    def process(self, request_method, request_data):
        if request_method == 'POST':
            if self.type == 'configure':
                return self.configure_insight_template(request_data)
            elif self.type == 'initialize':
                return self.initialize_service()
            elif self.type == 'test':
                return self.test_insight_template(request_data)
        elif request_method == 'GET':
            if self.type == 'insight_templates':
                # get insight templates from db, if not exists for that solution then get load from file
                return self.get_insight_templates()

    def get_insight_templates(self):
        # get the insight template details from the default/seed json file.
        insight_template_defs = self.get_insight_template_from_db()
        if insight_template_defs is None or len(insight_template_defs) == 0:
            insight_definitions = get_file_contents("insight_templates_def.json")
            if insight_definitions is not None:
                template_defs = insight_definitions['realtime_requests']
                for key, value in template_defs.items():
                    insight_template = dict()
                    insight_template['solution_id'] = self.solution_id
                    insight_template['template_key'] = key
                    insight_template['template_value'] = value
                    insight_template['is_active'] = True
                    insight_template['created_ts'] = datetime.now()
                    self.store_insight_templates(insight_template)

                insight_template_defs = self.get_insight_template_from_db()
        return {'status': 'success', 'msg': 'Insight templates list', 'data': insight_template_defs}

    def store_insight_templates(self, insight_template):
        MongoDbConn.insert(self.collection_name, insight_template)

    def update_insight_templates(self, insight_template):
        filter_query = {'solution_id': self.solution_id, 'template_key': insight_template['template_key']}
        update_query = {'template_value': insight_template['template_value'], 'updated_ts': datetime.now()}
        MongoDbConn.update(self.collection_name, filter_query, update_query)

    def get_insight_template_from_db(self):
        filter_query = {'is_active': True, 'solution_id': self.solution_id}
        insight_template_defs = MongoDbConn.find(self.collection_name, filter_query)
        if insight_template_defs is not None:
            resp = list()
            for rec in insight_template_defs:
                rec['_id'] = str(rec['_id'])
                resp.append(rec)
            return resp
        return None

    def configure_insight_template(self, data):
        job_id = None
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            # construct insight configure message
            req_data = dict()
            #req_data['configuration'] = {"defaults": {"realtime_requests": {data['template_key']: data['template_value']}}}
            req_data['configuration'] = {"defaults": {"realtime_requests": data}}
            req_data['service_name'] = 'insight-microservice'
            req = {"solution_id": self.solution_id, "data": req_data}
            response = post_job(INSIGHT_CONFIG['configure_template_api'], req)
            if 'job_id' in response:
                job_id = response["job_id"]
            if not is_request_timeout(response):
                if is_message_published(response):
                    #self.update_insight_templates(data)
                    return {'status': 'success',
                            'msg': 'Configured insight template',
                            'job_id': job_id}
                else:
                    return {'status': 'failure',
                            'msg': 'Failed in configure insight template',
                            'error': '', 'job_id':job_id}
            return {'status': 'failure', 'msg': 'Request timed out',
                                                'job_id': job_id}
        # TODO raise specific exception
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            traceback.print_exc()
            if job_id:
                return {'status': 'failure', 'msg': 'Error in configure insight template',
                        'error': traceback.format_exc(), 'job_id': job_id}
            else:
                return {'status': 'failure', 'msg': 'Error in configure insight template',
                        'error': traceback.format_exc()}
        finally:
            context.end_span()


    def test_insight_template(self, data):
        job_id = None
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            # construct insight configure message
            req_data = dict()
            payload = data['template_value']
            payload['request_type'] = data['template_key']
            req_data['entity_id'] = DEFAULT_ENTITY_ID
            req_data['solution_id'] = self.solution_id
            req_data['data'] = payload

            response = post_job(INSIGHT_CONFIG['get_insight'], req_data)
            if 'job_id' in response:
                job_id = response["job_id"]
            if not is_request_timeout(response):
                if is_message_published(response):
                    processed_request = False
                    req_data['data'] = {'insight_id': self.get_insight_id_from_response(response),
                                        'request_type': 'default'}
                    initiated_dt = datetime.now()
                    while not processed_request:
                        response = post_job(INSIGHT_CONFIG['get_insight'], req_data)
                        if 'job_id' in response:
                            job_id = response["job_id"]
                        if not is_request_timeout(response) and is_message_published(response):
                            data = self.get_insight_from_response(response)
                            curr_date = datetime.now()
                            if ('insights' in data.keys() and len(data['insights']) > 0) or \
                                            (curr_date - initiated_dt).total_seconds() > 60:
                                return {'status': 'success', 'msg': 'Get insight response',
                                        'data': data, 'job_id': job_id}
                        else:
                            return {'status': 'failure', 'msg': 'Request timed out',
                                    'job_id': job_id}

                else:
                    return {'status': 'failure', 'msg': 'Failed in configure insight template',
                            'error': '', 'job_id': job_id}
            return {'status': 'failure', 'msg': 'Request timed out', 'job_id': job_id}
        # TODO raise specific exception
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            traceback.print_exc()
            if job_id:
                return {'status': 'failure', 'msg': 'Error in configure insight template',
                    'error': traceback.format_exc(), 'job_id': job_id}
            else:
                return {'status': 'failure', 'msg': 'Error in configure insight template',
                        'error': traceback.format_exc()}
        finally:
            context.end_span()


    @staticmethod
    def get_insight_id_from_response(resp):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            return resp['result']['result']['metadata']['insight_id']
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return None
        finally:
            context.end_span()

    @staticmethod
    def get_insight_from_response(resp):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            return resp['result']['result']['metadata']
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return None
        finally:
            context.end_span()

    def initialize_service(self):
        engine_config = dict()
        engine_config['insight_service'] = self.initialize_insight_service()
        engine_config['nlp_service'] = self.initialize_nlp_service()
        engine_config['learning_service'] = self.initialize_learning_service()
        return engine_config

    def initialize_insight_service(self):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            default_insight_config = get_file_contents("insight_default_config.json")
            # construct insight configure message
            req_data = dict()
            req_data['configuration'] = default_insight_config
            req_data['service_name'] = 'insight-microservice'
            req = {"solution_id": self.solution_id, "data": req_data}
            response = post_job(INSIGHT_CONFIG["initialize_defaults_api"], req)
            if not is_request_timeout(response):
                if is_message_published(response):
                    return True
        # TODO raise specific exception
        except Exception as e:
            traceback.print_exc()
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
        context.end_span()
        return False

    # TODO: move to NLP Engine Service
    def initialize_nlp_service(self):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            default_config = get_file_contents("nlp_default_config.json")
            # construct insight configure message
            req_data = dict()
            req_data['configuration'] = default_config
            req_data['service_name'] = 'nlp_service'
            req = {"solution_id": self.solution_id, "data": req_data}
            response = post_job(NLP_CONFIG['INIT_DEFAULTS'], req)
            if not is_request_timeout(response):
                if is_message_published(response):
                    return True
        # TODO raise specific exception
        except Exception as e:
            traceback.print_exc()
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
        context.end_span()
        return False

    def initialize_learning_service(self):
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            default_config = get_file_contents("learning_default_config.json")
            # construct insight configure message
            req_data = dict()
            req_data['configuration'] = default_config
            req_data['service_name'] = 'learning-microservice'
            req = {"solution_id": self.solution_id, "data": req_data, "metadata":{}}
            response = post_job(LEARNING_CONFIG['initialize_defaults_api'], req)
            if not is_request_timeout(response):
                if is_message_published(response):
                    return True
        # TODO raise specific exception
        except Exception as e :
            traceback.print_exc()
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
        context.end_span()
        return False


def insight_request(request, type):
    solution_id = get_solution_from_session(request)
    if request.method == 'GET':
        result = InsightService(type, solution_id).process(request.method, None)
        return JsonResponse(result, safe=False)
    else:
        payload = json.loads(request.body.decode())
        result = InsightService(type, solution_id).process(request.method, payload)
        return JsonResponse(result, safe=False)