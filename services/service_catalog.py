from config_vars import GET_CATALOG_SERVICE, DEFAULT_ENTITY_ID, POST_CATALOG_SERVICE, MOUNT_PATH, INSIGHT_CONFIG, DOCUMENTS_COLLECTION
from utilities.http import post_job, get_nested_value, get_response, create_job, check_job
from utilities.common import *
import json, os
from copy import deepcopy
import traceback

tracer = trace.Tracer.get_instance(SERVICE_NAME)

digital_doc_extns = ["excel", "csv", "doc", "pdf_form", "pdf_regular_pdf"]
document_detail_fields = ["label", "value_coordinates", "slice_path", "score", "type", "id", "domain_mapping", "text",
                          "groups", "field_type", "insight_id", "feedback"]


def services_util(request):
    solution_id = get_solution_from_session(request)
    if request.method == "POST":
        if len(request.FILES) != 0 and "ingest/" in request.get_full_path():
            return ingest_service(request.FILES['file'], solution_id)
        else:
            payload = json.loads(request.body.decode())
            if "test/" in request.get_full_path():
                return test_service_job(payload, solution_id)
            else:
                return post_services(payload, solution_id)
    elif request.method == "GET":
        return get_services(solution_id)


def get_services(solution_id):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id": solution_id, "entity_id": DEFAULT_ENTITY_ID, "data": {}}
        response = post_job(GET_CATALOG_SERVICE, data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                resp = get_nested_value(response, "result.result.metadata")
                # check_service_version(resp) # check service version change
                return {"status": 'success', "msg": "Successfully retrieved services list",
                        "data": resp, 'job_id':job_id}
            else:
                return {'status': "failure", "msg": "Failed to retrieve services",
                        "data": [], "error": result, 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Request Timeout", "data": {},
                    'error': response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={'tb': traceback.format_exc()})
        if job_id:
            return {'status': 'failure', 'msg': 'Request failed ' + str(e),
                    'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request failed ' + str(e)}
    finally:
        context.end_span()


def post_services(payload, solution_id):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        req_data = dict({"service_name": "insight-microservice"})
        req_data.update(payload)
        data = {"solution_id": solution_id, "data": req_data}
        response = post_job(POST_CATALOG_SERVICE, data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                return {'status': 'success', 'msg': 'Configured services',
                        'job_id': job_id}
            else:
                return {'status': 'failure',
                        'msg': 'Failed to configure services',
                        "error": result, 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timed out',
                    'error': response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "Request failed " + str(e),
                    'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Request failed " + str(e)}
    finally:
        context.end_span()


def ingest_service(uploaded_file, solution_id):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        file_data = save_to_folder(solution_id,uploaded_file, MOUNT_PATH,"documents","uploads", flag=True)
        if file_data["status"] == "success":
            file_path = file_data["data"]["relative_path"]
            data = {"solution_id": solution_id,
                    "data": {"file_path": file_path, "request_type": "ingest_document"}}
            response = post_job(INSIGHT_CONFIG["get_insight"], data)
            if 'job_id' in response:
                job_id = response["job_id"]
            if not is_request_timeout(response):
                status, result = get_response(response)
                if status:
                    resp = get_nested_value(response, "result.result.metadata")
                    return {"status": "success", "msg": "Document Ingested",
                            "data": resp, 'job_id':job_id}
                else:
                    return {"status": "failure", "msg": "Failed Ingest Document",
                            'error': result, 'job_id':job_id}
            else:
                return {"status": "failure", "msg": "Request Timeout",
                        'error': response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "Error in ingesting file " + str(e),
                    'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Error in ingesting file " + str(e)}
    finally:
        context.end_span()


summary_config = [{
    "key": "file_name",
    "value": "Document name"
}, {
    "key": "updated_ts",
    "value": "Received"
}, {
    "key": "template_name",
    "value": "Classified as"
}, {
    "key": "classification_score",
    "value": "Classification Confidence"
}, {
    "key": "confidence_score",
    "value": "Document Confidence"
}, {
    "key": "review_text",
    "value": "Assign to you & Start Review"
}]

details_config = {
    "record_data": {
        "columns": summary_config
    },
    "fields_data": {
        "columns": [{
            "key": "label",
            "value": "Field Label",
            "type": "string"
        }, {
            "key": "text",
            "value": "Field Value",
            "type": "string"
        }, {
            "key": "slice_path",
            "value": "Sliced Image",
            "type": "image"
        }, {
            "key": "score",
            "value": "Confidence",
            "type": "string"
        }, {
            "key": "domain_mapping",
            "value": "Domain Mapping",
            "type": "string"
        }]
    }
}


def construct_nlp(enrichments, domain_mapping):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        attribute = domain_mapping.rsplit(".", 1)[1]
        for enrich in enrichments:
            data = enrich["extract_intent"]
            entity_name = data["entity_name"]
            if attribute == data["attribute"]:
                processed = data["processed"]
                resp = []
                for key in processed.keys():
                    if key == "insight_id":
                        continue
                    processed_data = processed[key]
                    attributes = []
                    for k, v in processed_data.items():
                        if k == "insight_id":
                            continue
                        k = k.strip(".entity") if ".entity" in k else k
                        if "qualifiers" in v and v["qualifiers"]:
                            attributes = attributes + [{"action": key, "attribute": k,
                                                        "value": str(remove_insight(v["qualifiers"]))}]

                        if "entity_value" in v and v["entity_value"]:
                            value = v["entity_value"]
                            value = ",".join(value) if isinstance(value, list) else str(value)
                            attributes = attributes + [{"action": key, "attribute": k, "value": value}]

                        if "entity_candidates" in v and v["entity_candidates"]:
                            metadata = v["entity_candidates"]
                            attributes = attributes + [{"action": key, "attribute": c, "value": d} for a in metadata
                                                       if isinstance(a, dict) for c, d in remove_innerloop(a).items()]
                    if attributes:
                        resp.append({"action": key, "entity": entity_name, "attributes": attributes})
                return resp
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()

def remove_insight(data):
   if isinstance(data, dict) and "insight_id" in data:
       data.pop("insight_id")
       if 'from' in data and 'to' in data:
           data = data['to'] + "-" + data['from']
       if 'from' in data:
           data = data['from']
       if 'to' in data:
           data = data['to']
   if isinstance(data, str):
       return data
   else:
       return None


def remove_innerloop(data):
   if isinstance(data, dict) and "insight_id" in data:
       data.pop("insight_id")
       update = {}
       for eachk, eachv in data.items():
           if isinstance(eachv, dict):
               if 'from' in eachv and 'to' in eachv:
                   update[eachk] = eachv['to'] + "-" + eachv['from']
               if 'from' in eachv:
                   update[eachk] = eachv['from']
               if 'to' in eachv:
                   update[eachk] = eachv['to']
               else:
                   update[eachk] = None
           else:
               update[eachk] = eachv
   return update


def train_set_upload(request):
    solution_id = get_solution_from_session(request)
    resp = {"status":"success"}
    if request.method == "POST":
        files_list = read_multiple_files(request)
        print(files_list)

        file_list = []
        for file_key, file_value in files_list.items():
            print(file_key, file_value)
            file_single = dict()
            file_data = None
            try:
                file_data = save_to_folder(solution_id, file_value[0], MOUNT_PATH,"datasets","uploads",flag=True)
            except Exception as e:
                print(str(e))

            if file_data:
                if file_data["status"] == "success":
                    file_single["file_name"] = file_data["data"]["filename"]
                    file_single["file_path"] = file_data["data"]["file_path"]
                    file_list.append(file_single)
                else:
                    resp["status"] = "failure"

        if resp["status"] == "success":
            resp = {"file_list":file_list}

    return JsonResponse(resp)


def construct_domain_object(domain_object):
    if isinstance(domain_object, dict):
        if 'data' in domain_object:
            domain_object = construct_domain_object(domain_object['data'])
        return {key: construct_domain_object(value) for key, value in domain_object.items() if key != "enrichments"}
    if isinstance(domain_object, list):
        return [construct_domain_object(value) for value in domain_object]
    return domain_object


def get_enrichments(dictionary, key):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if isinstance(dictionary, list):
            for a in dictionary:
                for result in get_enrichments(a, key):
                    yield result
        elif isinstance(dictionary, dict):
            for k, v in dictionary.items():
                if k == key:
                    yield v
                elif isinstance(v, dict):
                    for result in get_enrichments(v, key):
                        yield result
                elif isinstance(v, list):
                    for d in v:
                        for result in get_enrichments(d, key):
                            yield result
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def create_new_service(request):
    solution_id = get_solution_from_session(request)
    payload = json.loads(request.body.decode())
    schema = get_content("schema/create_service.json")
    if not is_draft_valid(schema,payload):
        return {"status":"failure","msg":"Request payload failed schema validation"}
    service_key_result = get_service_key(solution_id)
    if service_key_result["status"] == "success":
        if payload["service_key"] not in service_key_result["data"]:
            return create_service(payload,solution_id)
        else:
            return {"status":"failure","msg":"Service key unavailable"}
    else:
        return service_key_result


def get_service_key(solution_id):
    job_id = None
    response = post_job(INSIGHT_CONFIG["service_keys"],{"data":{},"solution_id":solution_id})
    if 'job_id' in response:
        job_id = response["job_id"]
    if not is_request_timeout(response):
        status, result = get_response(response)
        if status:
            service_keys = get_nested_value(response, "result.result.metadata.service_keys")
            return {"status": "success", "data": service_keys, 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Failed to get service keys",
                    "data": {}, 'error': result, 'job_id':job_id}
    else:
        return {"status": "failure", "msg": "Request Timeout",
                "data": {}, 'error': response, 'job_id':job_id}


def create_service(payload,solution_id):
    job_id = None
    response = post_job(INSIGHT_CONFIG["create_service"],{"data":payload,"solution_id":solution_id})
    if 'job_id' in response:
        job_id = response["job_id"]
    if not is_request_timeout(response):
        status, result = get_response(response)
        if status:
            return {"status": "success", "msg": "Service created successfully",
                    'job_id': job_id}
        else:
            return {"status": "failure", "msg": "Failed to get service keys",
                    "data": {}, 'error': result, 'job_id':job_id}
    else:
        return {"status": "failure", "msg": "Request Timeout",
                "data": {}, 'error': response, 'job_id':job_id}


def get_content(file_name, base_path=None):
    if base_path is None:
        base_path = os.path.abspath(__file__)
        base_path = base_path.rsplit('/', 1)[0]
    file_path = os.path.join(base_path, file_name)
    with open(file_path, encoding='utf-8') as data_file:
        return json.loads(data_file.read())


def test_service_job(payload, solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        ### Adding root id for request related to documents
        if "doc_id" in payload and "root_id" not in payload:
            query = {"doc_id":payload["doc_id"],"solution_id":solution_id}
            document = MongoDbConn.find_one(DOCUMENTS_COLLECTION,query)
            if document and "root_id" in document:
                payload["root_id"] = document["root_id"]
        data = {"solution_id": solution_id, "data": payload, "entity_id": DEFAULT_ENTITY_ID}
        job_id = create_job(INSIGHT_CONFIG["get_insight"], data)
        if job_id is not None:
            return {"status": "success", "msg": "job created successfully @" + str(job_id), "data": {"job_id": job_id}}
        else:
            return {"status": "failure", "msg": "failed to create job", "data": {}}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e), "data": {}}
    finally:
        context.end_span()


def test_job_status(job_id,source=None):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        job_data = check_job(job_id)
        if job_data is not None:
            response = get_nested_value(job_data, "result.result")
            metadata = response['metadata']
            status_code = response['status']['code'] if 'status' in response and 'code' in response['status'] else 200
            if status_code == 505:
                return {"status": "in-progress", "msg": "job is in progress", "data": {"job_id": job_id}}
            else:
                if source:
                    return process_result_set(metadata,source)
                return {"status": "success", "msg": "test successful", 'data': metadata}
        else:
            return {"status": "in-progress", "msg": "job is in progress", "data": {"job_id": job_id}}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "error while checking job status, " + str(e),
                    "error": traceback.format_exc()}

    finally:
        context.end_span()

def process_result_set(metadata,source):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if source == "entity":
            failed_entities = []
            if "failed_entities" in metadata and metadata["failed_entities"]:
                for entities in metadata["failed_entities"]:
                    failed_dict = {}
                    if "entity" in entities and "entity_name" in entities["entity"]:
                        failed_dict["message"] = entities["message"]
                        failed_dict["entity_name"] = entities["entity"]["entity_name"]
                        failed_entities.append(failed_dict)
            if failed_entities:
                msg = "Entities Uploaded except for the failed entites below"
            else:
                msg = "All Entities uploaded successfully"
            return {"status":"success","data":failed_entities,"msg":msg}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "error": str(e), "msg": "Internal Error Occured"}
    finally:
        context.end_span()
