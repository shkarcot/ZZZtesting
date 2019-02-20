import json, traceback, os
from uuid import uuid4

from bson import ObjectId
from datetime import datetime

from xpms_common import trace

from utilities.common import get_solution_from_session, is_request_timeout
from utilities.http import post_job, is_message_published, post_s3, download_file
from services.resource import training_set_get
from connections.mongodb import MongoDbConn
from config_vars import TRAINING_SET_MODELS_COLLECTION, TRAINING_SET_TRAIN_MODEL_TEST_URI, \
    TRAINING_SET_TRAIN_MODEL_TEST_ACTION_URI, ROOT, TRAINING_SET_TRAIN_MODEL_URI, TRAINING_SET_ACTION_CLASSIFIER_URI, \
    AMAZON_AWS_BUCKET, AMAZON_AWS_KEY_PATH, TRAINING_SET_TRAIN_MODEL_STATUS_URI, \
    TRAINING_SET_GET_LEARNING_MODEL_VERSIONS_URI, TRAINING_SET_GET_WORD_DISAMBIGUATION_URI, TRAINING_SET_COLLECTION, \
    NLP_CREATE_INTENT_API, SERVICE_NAME

tracer = trace.Tracer.get_instance(SERVICE_NAME)


def process_action_test(solution_id, payload, model):
    data = dict()
    data['solution_id'] = solution_id
    data['data'] = payload['data']
    data['data']['model_name'] = model['name']
    data['data']['model_type'] = model['type']
    response = post_job(TRAINING_SET_TRAIN_MODEL_TEST_URI, data)
    if not is_request_timeout(response):
        if is_message_published(response):
            return response
        else:
            return {'status': 'failure', 'msg': 'Error in service while publishing model to test'}
    else:
        return {'status': 'failure', 'msg': 'Timeout Error while processing model to test'}


def process_action_test_action(solution_id, payload, model):
    data = dict()
    data['solution_id'] = solution_id
    data['data'] = payload['data']
    data['data']['model_name'] = model['name']
    data['data']['model_type'] = model['type']
    response = post_job(TRAINING_SET_TRAIN_MODEL_TEST_ACTION_URI, data)
    print(response)
    if not is_request_timeout(response):
        if is_message_published(response):
            return response
        else:
            return {'status': 'failure', 'msg': 'Error in service while publishing action model to test'}
    else:
        return {'status': 'failure', 'msg': 'Timeout Error while processing action model to test'}


def process_action_retrain(solution_id, payload, model, result_id):
    file_name = model['name'] + '_' + str(len(model['model_ref']) + 1) + '.json'
    with open(file_name, 'w') as outfile:
        json.dump(payload['data'], outfile)

    s3_resp = post_s3(str(file_name), ROOT + '/' + str(file_name), AMAZON_AWS_BUCKET, AMAZON_AWS_KEY_PATH)
    if s3_resp['status'] == 'success':
        os.remove(file_name)
        uri = TRAINING_SET_TRAIN_MODEL_URI
        if model['type'] == 'action_classifier':
            uri = TRAINING_SET_ACTION_CLASSIFIER_URI

        response = post_train_model_job(solution_id, model, s3_resp['key'], uri)
        if not is_request_timeout(response):
            if is_message_published(response):
                model['model_ref'].append({'bucket_name': AMAZON_AWS_BUCKET,
                                           'key_name': AMAZON_AWS_KEY_PATH + file_name})
                query = {'is_enabled': True, 'updated_ts': datetime.now(), 'model_ref': model['model_ref']}
                MongoDbConn.update(TRAINING_SET_MODELS_COLLECTION,
                                   where_clause={"_id": ObjectId(result_id)}, query=query)
                return {'status': 'success', 'msg': 'Retrain model completed'}
            else:
                return {'status': 'failure', 'msg': 'Error in service while publishing retrained model'}
        else:
            return {'status': 'failure', 'msg': 'Timeout Error while processing retrained model'}
    else:
        return {'status': 'failure', 'msg': 'Error in uploading retrained model to s3'}


def process_action_enable(solution_id, result_id, model):
    job_data = dict()
    data = dict()
    job_data['solution_id'] = solution_id
    data['model_name'] = model['name']
    data['model_type'] = model['type']
    job_data['data'] = data
    response = post_job(TRAINING_SET_TRAIN_MODEL_STATUS_URI, job_data)
    is_timeout = True if response is not None and 'msg' in response.keys() and 'Timeout' == response['msg'] else False

    if not is_timeout:
        result = response['result'] if response is not None and 'result' in response.keys() \
            else None

        if result is not None and 'status' in result.keys() and result['status']['success']:
            query = {'is_enabled': True, 'updated_ts': datetime.now()}
            disable_query = {'is_enabled': False, 'updated_ts': datetime.now()}
            MongoDbConn.update(TRAINING_SET_MODELS_COLLECTION,
                               where_clause={"solution_id": solution_id, 'type': model['type']},
                               query=disable_query)
            MongoDbConn.update(TRAINING_SET_MODELS_COLLECTION,
                               where_clause={"_id": ObjectId(result_id)}, query=query)

            return {'status': 'success', 'msg': 'Updated model status to enabled'}
        else:
            return {'status': 'failure', 'msg': 'Error from service while updating the model status'}
    else:
        return {'status': 'failure', 'msg': 'Timeout error while updating the model status'}


def process_action_disable(result_id):
    query = {'is_enabled': False, 'updated_ts': datetime.now()}
    MongoDbConn.update(TRAINING_SET_MODELS_COLLECTION,
                       where_clause={"_id": ObjectId(result_id)}, query=query)
    return {'status': 'success', 'msg': 'Updated model status to disabled'}


def process_action_get_model(model):
    if model['model_ref'] is not None and len(model['model_ref']) > 0:
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)

        try:
            sz = len(model['model_ref'])
            bucket_name = model['model_ref'][sz - 1]['bucket_name']
            key_name = model['model_ref'][sz - 1]['key_name']
            return download_file(bucket_name, key_name)
        # TODO raise specific exception
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            return {'status': 'failure', 'msg': 'Error in getting model file contents',"error": str(e)}
        finally:
            context.end_span()
    else:
        return {'status': 'failure', 'msg': 'Model file does not exists'}


def process_action_get_versions(solution_id, model):
    data = dict()
    data['solution_id'] = solution_id
    data['data'] = {}
    data['data']['model'] = {}
    data['data']['model']['id'] = model['model_id']
    data['metadata'] = {}
    response = post_job(TRAINING_SET_GET_LEARNING_MODEL_VERSIONS_URI, data)
    is_timeout = True if response is not None and 'msg' in response.keys() \
                         and 'Timeout' == response['msg'] else False
    if not is_timeout:
        result = response['result'] if response is not None and 'result' in response.keys() \
            else None

        if result is not None and 'status' in result.keys() and result['status']['success']:

            return {'status': 'success', 'msg': 'Model versions', 'data': response}
        else:
            return {'status': 'failure', 'data': response, 'msg': 'Error from service while getting the model versions'}
    else:
        return {'status': 'failure', 'msg': 'Timeout error while getting the model versions'}


def process_action_classifier(solution_id, payload, model):
    job_data = dict()
    data = dict()
    job_data['solution_id'] = solution_id
    data['model_name'] = model['name']
    data['model_type'] = model['type']
    data['training_data'] = payload['data']
    job_data['data'] = data
    response = post_job(TRAINING_SET_ACTION_CLASSIFIER_URI, job_data)
    return {'status': 'success', 'result': response, 'msg': 'NLP train action classifier service response'}


def process_action_delete(result_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        query = {'is_deleted': True, 'deleted_ts': datetime.now()}
        MongoDbConn.update(TRAINING_SET_MODELS_COLLECTION,
                           where_clause={"_id": ObjectId(result_id)},
                           query=query)
        return {'status': 'success', 'msg': 'Model has been deleted'}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "failed to delete the model"}
    finally:
        context.end_span()


def process_action_disambigution(solution_id, payload):
    job_data = dict()
    job_data['solution_id'] = solution_id
    job_data['data'] = payload['data']
    response = post_job(TRAINING_SET_GET_WORD_DISAMBIGUATION_URI, job_data)
    return {'status': 'success', 'msg': 'NLP work disambiguation service response', 'result': response}


def process_action_default(solution_id, payload, request):
    training_set_id = payload['training_set_id']
    training_set = MongoDbConn.find_one(TRAINING_SET_COLLECTION,
                                        {'_id': ObjectId(training_set_id)})
    if training_set is not None:
        # post job
        uri = TRAINING_SET_TRAIN_MODEL_URI
        if payload['type'] == 'action_classifier':
            uri = TRAINING_SET_ACTION_CLASSIFIER_URI
        file_name = AMAZON_AWS_KEY_PATH + training_set['file_name']
        if 's3_key' in training_set.keys():
            file_name = training_set['s3_key']
        response = post_train_model_job(solution_id, payload, file_name, uri)
        is_published = False
        if not is_request_timeout(response):
            if is_message_published(response):

                data = dict()
                data['name'] = payload['name']
                data['model_id'] = response['result']['result']['metadata']['model_id']
                data['description'] = payload['description'] if 'description' in payload.keys() else ''
                data['type'] = payload['type']
                data['solution_id'] = get_solution_from_session(request)
                data['model_ref'] = []
                data['model_ref'].append({'bucket_name': AMAZON_AWS_BUCKET,
                                          'key_name': AMAZON_AWS_KEY_PATH + training_set['file_name']})
                data['is_published'] = is_published
                data['service'] = payload['service']
                data['created_ts'] = datetime.now()
                data['updated_ts'] = datetime.now()
                data['is_enabled'] = False
                data['is_deleted'] = False
                MongoDbConn.insert(TRAINING_SET_MODELS_COLLECTION, query=data)
                return {'status': 'success', 'msg': payload['name'] + ' model created'}
            else:
                status = response['result']['status']
                return {'status': 'failure', 'msg': 'Error from service while creating model',
                        'error': status['message']}
        else:
            return {'status': 'failure', 'msg': 'Service is not running or taking more time to process',
                    'error': response}
    else:
        return {'status': 'failure', 'msg': 'Selected training set is not available'}


def process_training_set_models(request, type):
    if request.method == 'POST':
        payload = json.loads(request.body.decode())
        resp = dict()
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            solution_id = get_solution_from_session(request)
            if '_id' in payload.keys():
                result_id = str(payload['_id'])
                model = MongoDbConn.find_one(TRAINING_SET_MODELS_COLLECTION,
                                             query={"_id": ObjectId(result_id)})
                if model is not None:
                    if type is not None:
                        if type == 'test':
                            return process_action_test(solution_id, payload, model)
                        elif type == 'test_action':
                            return process_action_test_action(solution_id, payload, model)
                        elif type == 'retrain' or type == 'retrain_action_model' or type == 'retrain_intent_model':
                            return process_action_retrain(solution_id, payload, model, result_id)
                        elif type == 'enable':
                            return process_action_enable(solution_id, result_id, model)
                        elif type == 'disable':
                            return process_action_disable(result_id)
                        elif type == 'get_model_data':
                            return process_action_get_model(model)
                        elif type == 'get_versions':
                            return process_action_get_versions(solution_id, model)
                        elif type == 'train_action_classifier':
                            return process_action_classifier(solution_id, payload, model)
                        elif type == 'delete':
                            return process_action_delete(result_id)
                        else:
                            return {'status': 'failure', 'msg': 'Invalid operation on model'}
                else:
                    return {'status': 'failure', 'msg': 'Selected model is not available'}
            else:
                if type == 'nlp_word_disambiguation':
                    return process_action_disambigution(solution_id, payload)
                else:
                    return process_action_default(solution_id, payload, request)
        # TODO raise specific exception
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
            traceback.print_exc()
            resp['status'] = 'failure'
            resp['msg'] = 'Error in processing training set models'
            resp['error'] = traceback.format_exc()
        context.end_span()
        return resp

    elif request.method == "GET":
        return training_set_get(TRAINING_SET_MODELS_COLLECTION, {"service": type,"is_deleted" : False},
                                get_solution_from_session(request), flag=True)


def post_train_model_job(solution_id, payload, file_name, uri):
    job_data = dict()
    job_data['solution_id'] = solution_id
    data = dict()
    data['model_name'] = payload['name']
    data['model_type'] = payload['type']
    data['bucket_name'] = AMAZON_AWS_BUCKET
    data['key_name'] = file_name
    job_data['data'] = data
    response = post_job(uri, job_data)
    return response


def post_training_set(request):
    if request.method == "POST":
        payload = json.loads(request.body.decode())
        payload['solution_id'] = get_solution_from_session(request)
        response = post_job(NLP_CREATE_INTENT_API, payload)
        return response


def nlpEngine_processors():
    true, false = True, False
    return {"result":[
    {
        "_id": "58da0c53c05793000c190cf3",
        "created_by": "5897d2bf7426d2367f0ed920",
        "created_on": "2017-03-28 07:10:11.676000",
        "is_enabled": true,
        "name": "/getActions",
        "path": "/getActions",
        "service": "nlp",
        "summary": "Extract all actions from sentences"
    },
    {
        "_id": "58da0c53c05793000c190cf2",
        "created_by": "5897d2bf7426d2367f0ed920",
        "created_on": "2017-03-28 07:10:11.675000",
        "is_enabled": true,
        "name": "/getEntities",
        "path": "/getEntities",
        "service": "nlp",
        "summary": "Gets all the entities along with their attributes."
    },
    {
        "_id": "58da0c53c05793000c190cf5",
        "created_by": "5897d2bf7426d2367f0ed920",
        "created_on": "2017-03-28 07:10:11.677000",
        "is_enabled": true,
        "name": "/getIntents",
        "path": "/getIntents",
        "service": "nlp",
        "summary": "Desc here."
    },
    {
        "_id": "58da0c53c05793000c190cf4",
        "created_by": "5897d2bf7426d2367f0ed920",
        "created_on": "2017-03-28 07:10:11.676000",
        "is_enabled": true,
        "name": "/getTimeContext",
        "path": "/getTimeContext",
        "service": "nlp",
        "summary": "Gets the time context (if available) of the sentences."
    }
]}