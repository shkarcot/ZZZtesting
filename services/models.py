from utilities.http import post_job, is_request_timeout, get_response, get_nested_value
from utilities.common import get_solution_from_session,save_to_folder, download_file_from_efs,\
    get_mountpath_fromsftp, get_pagination_details
from config_vars import LEARNING_CONFIG, MOUNT_PATH, SERVICE_NAME, MODEL_GROUPS_COLLECTION,\
    INSIGHT_CONFIG
import json, os
from connections.mongodb import MongoDbConn
from uuid import uuid4
from xpms_common import trace
import traceback
from datetime import datetime

tracer = trace.Tracer.get_instance(SERVICE_NAME)

score_parameters = {"accuracy":"Accuracy","precision":"Precision","recall":"Recall","neg_mean_squared_error":"Neg mean square error",
                    "mean_absolute_error": "Mean Absolute error","r2":"r2","f1":"f1"}
graph_parameters = {"accuracy":"Accuracy","precision":"Precision","recall":"Recall", "r2":"r2","name":"name","f1":"f1"}

def process_models(request):
    context = tracer.get_context(request_id=str(uuid4()),
                                 log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "GET":
            return get_model_information(solution_id)
        elif request.method == "POST":
            path = request.get_full_path()
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            if 'ensembles/' in path:
                return get_ensembles(solution_id, payload, context)
            elif 'evaluationdetails/' in path:
                return get_evaluation_details(solution_id, payload)
            elif "test/" in path:
                return train_test_model(solution_id,payload,"run")
            elif "retrain/" in path:
                return train_test_model(solution_id,payload,"retrain")
            elif "evaluate/" in path:
                return train_test_model(solution_id,payload,"score")
            elif "train/" in path:
                return train_test_model(solution_id,payload,"train")
            elif "details/" in path:
                return get_model_information(solution_id, payload)
            elif "components/" in path:
                return get_model_components(solution_id,payload)
            elif "config/" in path:
                return update_model_config(solution_id,payload,"configure")
            elif "flowupdate/" in path:
                return update_model_flow(solution_id,payload,"save_flow")
            elif "save/" in path:
                data = format_save_model(payload)
                data["save_as"] = payload["save_as"]
                if 'resource_ids' in payload:
                    data.update({'resources_ids': payload['resource_ids']})
                return update_model_config(solution_id,data,"save_model")
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":"Internal error occurred","error":str(e)}
    finally:
        context.end_span()


"""
This function will return all the previous run details for an algorithm
"""
def get_previous_run_details(request):
    """
    :param request: Http request
    :return: result Json
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        result = {"status": "failure"}
        if request.method == "POST":
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            solution_id = get_solution_from_session(request)
            data = {"solution_id": solution_id,
                    "data": {'model': {'model_id': payload['model_id'],
                                       'version_id': payload['version_id']}}}
            runs_result = post_job(LEARNING_CONFIG['get_prev_run'], data)
            if 'job_id' in runs_result:
                result["job_id"] = runs_result["job_id"]
            if not is_request_timeout(runs_result):
                status, msg = get_response(runs_result)
                if status:
                    result["status"] = "success"
                    runs_result = get_nested_value(runs_result,
                                                "result.result.metadata.run_data")
                    runs_result.sort(key=lambda f: f['update_ts'], reverse=True)
                    result['data'] = runs_result
                    result['total_runs'] = len(runs_result)
                else:
                    if 'message' in msg and 'error_message' in msg['message']:
                        result["error"] = msg['message']['error_message']
                    else:
                        result["error"] = 'Error'
                    result["msg"] = "Error in retrieving the previous runs information"
            else:
                result["msg"] = "Request timed out"
            return result
        else:
            result["msg"] = 'POST api is expected'
            return result
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Binaries list not available.",
                "error": str(e)}
    finally:
        context.end_span()


"""
This function will return the details of the evaluation results
"""
def get_evaluation_details(solution_id, payload):
    """
    :param solution_id: Solution Id
    :param payload: request Payload
    :return: Json
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        result = {"status": "failure"}
        data = {"solution_id": solution_id, "data": {'model': {'model_id': payload['model_id']}}}
        evaluation_data = post_job(LEARNING_CONFIG['get_evaluation'], data)
        if 'job_id' in evaluation_data:
            result["job_id"] = evaluation_data["job_id"]
        if not is_request_timeout(evaluation_data):
            status, msg = get_response(evaluation_data)
            if status:
                result["status"] = "success"
                evaluation_data = get_nested_value(evaluation_data,
                                                   "result.result.metadata.evaluation_data")
                for res in evaluation_data:
                    res['update_ts'] = datetime.strptime(res['update_ts'],
                                                            '%Y-%m-%dT%H:%M:%S.%f')
                evaluation_data.sort(key=lambda f: f['update_ts'], reverse=True)
                result['data'] = evaluation_data
            else:
                if 'message' in msg and 'error_message' in msg['message']:
                    result["error"] = msg['message']['error_message']
                else:
                    result["error"] = 'Error'
                result["msg"] = "Error in retrieving the binaries information"
        else:
            result["msg"] = "Request timed out"
        return result
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Binaries list not available.",
                "error": str(e)}
    finally:
        context.end_span()


"""
This function will return the list of binaries exist in the DB
"""
def get_binaries(request):
    """
    :param request: API request
    :return: json response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        result = {"status": "failure"}
        if request.method == "POST":
            try:
                payload = json.loads(request.body.decode())
            except:
                payload = request.POST
            filter_obj = None
            if 'filter_obj' in payload:
                filter_obj = payload['filter_obj']
            solution_id = get_solution_from_session(request)
            data = {"solution_id": solution_id, "data": {}, 'metadata': {}}
            bin_result = post_job(LEARNING_CONFIG['get_binaries'], data)
            if 'job_id' in bin_result:
                result["job_id"] = bin_result["job_id"]
            if not is_request_timeout(bin_result):
                status, msg = get_response(bin_result)
                if status:
                    result["status"] = "success"
                    binaries = get_nested_value(bin_result,
                                                "result.result.metadata.binaries")
                    # for ele in binaries:
                    #     ele['file_path'] = MOUNT_PATH + ele['file_path']
                    if filter_obj:
                        result["data"], total_binaries = implement_pagination(binaries,
                                                                              filter_obj,
                                                                              'created_ts')
                    else:
                        result['data'] = binaries
                        total_binaries = len(binaries)
                    result['total_binaries'] = total_binaries
                else:
                    result["error"] = msg
                    result["msg"] = "Error in retrieving the binaries information"
            else:
                result["msg"] = "Request timed out"
            return result
        else:
            result["msg"] = 'POST api is expected'
            return result
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Binaries list not available.",
                "error": str(e)}
    finally:
        context.end_span()


def get_model_information(solution_id, payload=None):
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        result = {"status":"failure"}
        if payload is None:
            model_data = {"is_active": True}
        else:
            model_data = payload
        data = {"solution_id": solution_id, "data": model_data, "metadata": {}}
        # for future use
        # model_result, ensemble_found = get_ensembles(solution_id, context)
        ensemble_found = False
        if not ensemble_found:
            model_result = post_job(LEARNING_CONFIG["get"], data)
            if 'job_id' in model_result:
                result["job_id"] = model_result["job_id"]
            if not is_request_timeout(model_result):
                status, msg = get_response(model_result)
                if status:
                    result["status"] = "success"
                    models = get_nested_value(model_result, "result.result.metadata.models")
                    if payload is not None:
                        result["data"] = process_model_data(models)
                    else:
                        result["data"] = select_required_scores(models)
                        # if not ensemble_found:
                        #     for future use
                        #     push_data_into_models(models, solution_id, context)
                else:
                    result["error"] = msg
                    result["msg"] = "Error in retrieving the model information"
            else:
                result["msg"] = "Request timed out"
            return result
        # return prepare_ensembles_result_json(model_result) # For future use
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Some error has occurred.'
                                            'Request can not be processed.'}
    finally:
        context.end_span()


"""
This function will fetch the data from database 
and return the list of ensembles
"""
def get_ensembles(solution_id, payload, context):
    """
    :param solution_id : solution id of the loggedin user
    :param payload: Request payload
    :param context: Logger object
    :return: list of ensembles and boolean flag
    """
    try:
        result = {"status": "failure"}
        ensemble_type = payload['ensemble_type']
        model_data = {"is_active": True}
        if ensemble_type.lower() == 'integrated':
            model_data.update({'is_integrated': True})
        elif ensemble_type.lower() == 'independent':
            model_data.update({'is_integrated': False})
        data = {"solution_id": solution_id, "data": model_data, "metadata": {}}
        model_result = post_job(LEARNING_CONFIG["get"], data)
        if 'job_id' in model_result:
            result["job_id"] = model_result["job_id"]
        if not is_request_timeout(model_result):
            status, msg = get_response(model_result)
            if status:
                result["status"] = "success"
                models = get_nested_value(model_result,
                                          "result.result.metadata.models")
                models, total_ensembles = implement_pagination(models,
                                                               payload['filter_obj'],
                                                               'update_ts')
                result["data"] = select_required_scores(models)
                result['total_ensembles'] = total_ensembles
            else:
                result["error"] = msg
                result["msg"] = "Error in retrieving the model information"
        else:
            result["msg"] = "Request timed out"
        return result
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None, False


"""
This function will implement the pagination
and return the required result based on the 
filter object and sorting by value
"""
def implement_pagination(results, filter_obj, sorting_by):
    """
    :param results: Data received from learning service
    :param filter_obj : filters which needs to be apply on models
    :param sorting_by : timestamp
    :return: required models list
    """
    # filter_obj = {"page_no":1,"no_of_recs":12,"sort_by":"update_ts","order_by":False}
    # sorting_by = 'update_ts'
    sort_by, order_by_asc, skip, limit = get_pagination_details(filter_obj,
                                                                sort_by=sorting_by,
                                                                order_by_asc=-1, skip=0,
                                                                limit=0)
    for result in results:
        result[sorting_by] = datetime.strptime(result[sorting_by], '%Y-%m-%dT%H:%M:%S.%f')
    order = True if order_by_asc == -1 else False
    total_results = len(results)
    results.sort(key=lambda f: f[sorting_by], reverse=order)
    if total_results > limit:
        results = results[skip:skip + limit]
    return results, total_results


def get_model_components(solution_id,payload=None):
    result = {"status":"failure"}
    if payload is None:
        model_data = {"is_active":True}
    else:
        model_data = payload
    data = {"solution_id": solution_id, "data": {"model":model_data}, "metadata": {}}
    model_result = post_job(LEARNING_CONFIG["components"], data)
    if 'job_id' in model_result:
        result["job_id"] = model_result["job_id"]
    if not is_request_timeout(model_result):
        status, msg = get_response(model_result)
        if status:
            result["status"] = "success"
            data = get_nested_value(model_result, "result.result.metadata")
            models = data["models"]
            result["data"] = {"ensemble":data["ensemble_strategy"],"models":select_required_scores(models)}
        else:
            result["error"] = msg
            result["msg"] = "Error in retrieving the model components"
    else:
        result["msg"] = "Request timed out"
    return result


def select_required_scores(models):
    input_dict = False
    if isinstance(models,dict):
        models = [models]
        input_dict = True
    for model in models:
        if "model_score" in model and model["model_score"]:
            model_score = model["model_score"]
            new_model_score = dict()
            for score,value in model_score.items():
                if score in score_parameters.keys():
                    key = score_parameters[score]
                    new_model_score[key] = value
            model["model_score"] = new_model_score
    if input_dict:
        [models] = models
    return models


def update_model_config(solution_id,payload,request):
    result = {"status":"failure"}
    data = {"solution_id": solution_id, "data": payload, "metadata": {}}
    update_result = post_job(LEARNING_CONFIG[request], data)
    if 'job_id' in update_result:
        result["job_id"] = update_result["job_id"]
    if not is_request_timeout(update_result):
        status, msg = get_response(update_result)
        if status:
            result["status"] = "success"
            result["msg"] = "Model updated successfully"
        else:
            if 'message' in msg and 'error_message' in msg['message']:
                result["error"] = msg['message']['error_message']
            else:
                result["error"] = 'Some error occurred while processing the result'
            result["msg"] = "Error while updating model config"
    else:
        result["msg"] = "Request timed out"
    return result


def update_model_flow(solution_id,payload,request):
    result = {"status":"failure"}
    data = {"solution_id": solution_id, "data": payload, "metadata": {}}
    update_result = post_job(LEARNING_CONFIG[request], data)
    if 'job_id' in update_result:
        result["job_id"] = update_result["job_id"]
    if not is_request_timeout(update_result):
        status, msg = get_response(update_result)
        if status:
            result["status"] = "success"
            result["msg"] = "Model flow updated successfully"
        else:
            result["error"] = msg
            result["msg"] = "Error while updating model flow"
    else:
        result["msg"] = "Request timed out"
    return result


def process_model_data(model_detail_data):
    version_fields = ["version_id","training_ts","name","display_name","description","model_score","is_active","is_tagged","status"]
    total_version_count = 0
    version_list = []
    graph_score = dict()
    available_scores = []
    model_data = dict()

    if "versions" in model_detail_data:
        data = model_detail_data["versions"]
    else:
        data = []

    for parameter in graph_parameters.keys():
        graph_score[parameter] = []
    for model in data:
        total_version_count += 1
        version, graph_score, available_scores = get_version_values(model, version_fields, graph_score,available_scores)
        version_list.append(version)
        if model["is_active"]:
            model_data = select_required_scores(model)

    final_score = {}
    for parameter,value in graph_score.items():
        if value != []:
            final_score[graph_parameters[parameter]] = value

    model_data["versions"] = version_list
    model_data["version_scores"] = final_score
    model_data["total_versions"] = total_version_count
    model_data["Available_scores"] = available_scores
    model_data['model_type'] =  model_detail_data['model_type']
    model_data['model_id'] = model_detail_data['model_id']
    model_data['name'] = model_detail_data['name']
    return model_data


def get_version_values(version,ver_fields,graph_score,available_scores):
    version_data = dict()
    version_data['confusion_matrix'] = version['confusion_matrix'] \
        if 'confusion_matrix' in version else []
    version_data['dataset_name'] = version['dataset_name'] \
        if 'dataset_name' in version else ''
    version_data['previous_version_id'] = version['previous_version_id'] \
        if 'previous_version_id' in version else ''
    version_data['previous_version_name'] = version['previous_version_name'] \
        if 'previous_version_name' in version else ''
    for key in ver_fields:
        if key in version:
            version_data[key] = version[key]
    if version["is_active"]:
        # Add active model score as the first element in the array
        for parameter in graph_score.keys():
                if parameter == "name":
                    graph_score[parameter] = [str(version["name"])+"(Active)"] + graph_score[parameter]
                else:
                    if "model_score" in version and parameter in version["model_score"] and \
                            version["model_score"][parameter] is not None:
                        graph_score[parameter] = [version["model_score"][parameter]] + graph_score[parameter]
    else:
        if "model_score" in version:
            if version["is_tagged"]:
                for key,value in graph_score.items():
                    if key == "name":
                        value.append(version["name"])
                    else:
                        if key in version["model_score"] and version["model_score"][key] is not None:
                            value.append(version["model_score"][key])
    version_data = select_required_scores(version_data)
    if "model_score" in version_data:
        for score in version_data["model_score"].keys():
            if score not in available_scores:
                available_scores.append(score)
    return version_data, graph_score, available_scores


def train_test_model(solution_id,payload,request):
    result = {"status":"failure"}
    dataset_list = ["dataset_id"]
    if request == "train":
        model_list = ["model_type"]
    else:
        model_list = ["model_id","version_id"]
    if "train" in request:
        model_list.extend(["name","description"])
        dataset_list.append({"target_columns" :"column"})
    model = create_dict(payload,model_list)
    model.update({"parameters":{}})
    if request == 'train':
        model.update({'is_integrated': False})
    dataset = create_dict(payload,dataset_list)
    data = {"solution_id": solution_id,"data": {"model": model, "dataset": dataset},"metadata": {}}
    if "resource_ids" in payload:
        data["data"]["resources_ids"] = payload['resource_ids']
    if request == 'run':
        data['data'].update({"request_type": "run_model"})
        train_result = post_job(INSIGHT_CONFIG["get_insight"], data)
    else:
        train_result = post_job(LEARNING_CONFIG[request], data)
    if 'job_id' in train_result:
        result["job_id"] = train_result["job_id"]
    if not is_request_timeout(train_result):
        status, msg = get_response(train_result)
        if status:
            result["status"] = "success"
            result["data"] = get_nested_value(train_result, "result.result.metadata")
        else:
            if 'message' in msg and 'error_message' and "traceback" in msg['message']:
                result["error"] = msg['message']['traceback']
                result["msg"] = msg['message']['error_message']
            else:
                result["error"] = 'Some error occurred while processing the result'
                result["msg"] = "Error occurred while processing request"
    else:
        result["msg"] = "Request timed out"
    return result


def process_learning_datasets(request,path=None):
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "GET":
            if path is None:
                return get_all_datasets(solution_id, None)
            else:
                if path.startswith("/"):
                    path = path.split('/', 1)[1]
                file_path = os.path.join(MOUNT_PATH, path)
                return download_file_from_efs(file_path, solution_id)
        elif request.method == "POST" and len(request.FILES) != 0:
            payload = request.POST
            return upload_dataset(request.FILES['file'],solution_id,payload)
        elif request.method == "POST":
            payload = json.loads(request.body.decode())
            path = request.get_full_path()
            if 'dataset/list/' in path:
                return get_all_datasets(solution_id, payload=payload)
            elif "files" in payload:
                return upload_dataset(None, solution_id, payload)
            else:
                return update_dataset(solution_id,payload)
    except Exception as e:
        return {"status":"failure","msg":"Internal Error occurred","error":str(e)}


"""
This function will upload and download the binaries
and return the json response
"""
def process_learning_binaries(request, path=None):
    """
    :param request: Http Request
    :param path: file path
    :return: Json response
    """
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "GET":
            if path.startswith("/"):
                path = path.split('/', 1)[1]
            file_path = os.path.join(MOUNT_PATH, path)
            return download_file_from_efs(file_path, solution_id)
        elif request.method == "POST" and len(request.FILES) != 0:
            payload = request.POST
            return upload_binary(request.FILES['file'],solution_id, payload)
    except Exception as e:
        return {"status":"failure","msg":"Internal Error occurred","error":str(e)}


"""
This function will download the retrieved results
and return the response
"""
def download_results(request, path=None):
    """
    :param request: Http request
    :param path: result file path
    :return: response
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "GET":
            if path.startswith("/"):
                path = path.split('/', 1)[1]
            file_path = os.path.join(MOUNT_PATH, path)
            return download_file_from_efs(file_path, solution_id)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":"Internal Error occurred","error":str(e)}
    finally:
        context.end_span()


def update_dataset(solution_id, payload):
    result = {"status":"failure"}
    data = {"solution_id": solution_id, "data": payload, "metadata": {}}
    update_result = post_job(LEARNING_CONFIG["update_dataset"], data)
    if 'job_id' in update_result:
        result["job_id"] = update_result["job_id"]
    if not is_request_timeout(update_result):
        status, msg = get_response(update_result)
        if status:
            result["status"] = "success"
            result["msg"] = "Dataset updated successfully"
        else:
            result["error"] = msg
            result["msg"] = "Error while deleting model dataset"
    else:
        result["msg"] = "Request timed out"
    return result


"""
This method will archive the binaries and return the response
"""
def update_learning_binary(solution_id, payload):
    """
    :param solution_id: Session solution id
    :param payload: request payload
    :return: response
    """
    result = {"status":"failure"}
    data = {"solution_id": solution_id, "data": payload, "metadata": {}}
    update_result = post_job(LEARNING_CONFIG["update_binary"], data)
    if 'job_id' in update_result:
        result["job_id"] = update_result["job_id"]
    if not is_request_timeout(update_result):
        status, msg = get_response(update_result)
        if status:
            result["status"] = "success"
            result["msg"] = "Binary updated successfully"
        else:
            result["error"] = msg
            result["msg"] = "Error while deleting binary"
    else:
        result["msg"] = "Request timed out"
    return result



def get_all_datasets(solution_id, payload=None):
    filter_obj = None
    if payload and 'filter_obj' in payload:
        filter_obj = payload['filter_obj']
    result = {"status": "failure"}
    data = {"solution_id": solution_id, "data": {}, "metadata": {}}
    model_result = post_job(LEARNING_CONFIG["datasets"], data)
    if 'job_id' in model_result:
        result["job_id"] = model_result["job_id"]
    if not is_request_timeout(model_result):
        status, msg = get_response(model_result)
        if status:
            result["status"] = "success"
            dataset_list = get_nested_value(model_result,
                                            "result.result.metadata.datasets")
            # for ele in dataset_list:
            #     ele['file_path'] = MOUNT_PATH + ele['file_path']
            if filter_obj:
                result["data"], result['total_datasets'] = implement_pagination(dataset_list,
                                                                                filter_obj, 'ts')
            else:
                result["data"] = dataset_list
                result['total_datasets'] = len(dataset_list)
        else:
            result["error"] = msg
            result["msg"] = "Error getting dataset lists"
    else:
        result["msg"] = "Request timed out"
    return result


def upload_dataset(uploaded_file,solution_id,payload):
    result = {"status":"failure"}

    if uploaded_file:
        save_result = save_to_folder(solution_id,uploaded_file, MOUNT_PATH,"datasets","uploads",flag=True)
    else:
        save_result = dict(status="success",data={})
        sftp_data = get_mountpath_fromsftp(solution_id,payload["files"][0])
        save_result["data"]["file_path"] =  sftp_data["file_path"]

    if save_result["status"] == "success":
        file_data = save_result["data"]
        dataset = {"name":payload["file_name"],"description":payload["description"],"data_format":payload["format"],
                   "value":file_data["file_path"]}
        data = {"solution_id":solution_id,"data":{"dataset":dataset},"metadata":{}}
        upload_result = post_job(LEARNING_CONFIG["upload"], data)
        if 'job_id' in upload_result:
            result["job_id"] = upload_result["job_id"]
        if not is_request_timeout(upload_result):
            status, msg = get_response(upload_result)
            if status:
                result["status"] = "success"
                result["msg"] = "File uploaded successfully"
            else:
                result["error"] = msg
                result["msg"] = "Error while uploading file"
        else:
            result["msg"] = "Request timed out"
    else:
        result["msg"] = "Internal error occurred in saving file"
    return result


"""
This function will upload the binaries and return the response
"""
def upload_binary(uploaded_file,solution_id,payload):
    """
    :param uploaded_file: File to be uploaded
    :param solution_id: Session solution id
    :param payload: request payload
    :return: response
    """
    result = {"status":"failure"}
    if uploaded_file:
        save_result = save_to_folder(solution_id,uploaded_file,
                                     MOUNT_PATH,"binaries","uploads",flag=True)
    else:
        save_result = dict(status="success",data={})
        sftp_data = get_mountpath_fromsftp(solution_id,payload["files"][0])
        save_result["data"]["file_path"] =  sftp_data["file_path"]

    if save_result["status"] == "success":
        file_data = save_result["data"]
        dataset = [{"name":payload["file_name"],"description":payload["description"],
                   "value":file_data["file_path"]}]
        data = {"solution_id":solution_id,"data":{"binaries":dataset},"metadata":{}}
        upload_result = post_job(LEARNING_CONFIG["upload_binary"], data)
        if 'job_id' in upload_result:
            result["job_id"] = upload_result["job_id"]
        if not is_request_timeout(upload_result):
            status, msg = get_response(upload_result)
            if status:
                result["status"] = "success"
                result["msg"] = "File uploaded successfully"
            else:
                if 'message' in msg and 'error_message' in msg['message']:
                    result["error"] = msg['message']['error_message']
                else:
                    result["error"] = 'Some error occurred while uploading the binary file'
                result["msg"] = "Error while uploading file"
        else:
            result["msg"] = "Request timed out"
    else:
        result["msg"] = "Internal error occurred in saving file"
    return result


def get_learn_configs(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "GET":
            path = request.get_full_path()
            if "dataset/type/" in path:
                return get_config(solution_id,"dataset_types")
            elif "type/" in path:
                return get_config(solution_id,"model_types",)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":"Internal error occurred while processing","error":str(e)}
    finally:
        context.end_span()


def get_config(solution_id,endpoint):
    result = {"status": "failure"}
    data = {"solution_id": solution_id, "data": {}, "metadata": {}}
    model_result = post_job(LEARNING_CONFIG[endpoint], data)
    if 'job_id' in model_result:
        result["job_id"] = model_result["job_id"]
    if not is_request_timeout(model_result):
        status, msg = get_response(model_result)
        if status:
            result["status"] = "success"
            metadata = get_nested_value(model_result, "result.result.metadata")
            if endpoint in metadata or 'algo_type' in metadata:
                result["data"] = metadata
            else:
                result["data"] = []
        else:
            result["error"] = msg
            result["msg"] = "Error reading model configurations"
    else:
        result["msg"] = "Request timed out"
    return result


def custom_notebook_session(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "POST":
            payload = json.loads(request.body.decode())
            return create_new_session(solution_id,payload)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":"Internal error occurred while processing","error":str(e)}
    finally:
        context.end_span()


def create_new_session(solution_id,payload):
    result = {"status":"failure"}
    data_post = format_save_model(payload)
    if 'resource_ids' in payload:
        data_post.update({'resources_ids': payload['resource_ids']})
    data = {"solution_id": solution_id, "data": data_post, "metadata": {}}
    response = post_job(LEARNING_CONFIG['get_session'], data)
    if 'job_id' in response:
        result["job_id"] = response["job_id"]
    if not is_request_timeout(response):
        status, msg = get_response(response)
        if status:
            result["status"] = "success"
            result["data"] = get_nested_value(response, "result.result.metadata")
        else:
            if 'message' in msg and 'error_message' and "traceback" in msg['message']:
                result["error"] = msg['message']['traceback']
                result["msg"] = msg['message']['error_message']
            else:
                result["error"] = 'Some error occurred while processing the result'
                result["msg"] = "Error occurred while processing request"
    else:
        result["msg"] = "Request timed out"
    return result


def create_dict(data,columns_list):
    data_dict = {}
    for column in columns_list:
        if isinstance(column,dict):
            for key,value in column.items():
                if value in data:
                    data_dict[key] = data[value]
        elif isinstance(column,str):
            if column in data:
                data_dict[column] = data[column]
    return data_dict


def format_save_model(data):
    model_list = ["model_id","name","description","model_type"]
    dataset_list = ["dataset_id",{"target_columns":"column"}]
    model = create_dict(data,model_list)
    model.update({'is_integrated': False})
    dataset = create_dict(data,dataset_list)
    data_dict = {"model":model,"dataset":dataset}
    return data_dict
