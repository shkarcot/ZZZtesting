from django.http import JsonResponse
from bson import ObjectId
import json
import os
from utilities import http, common
from connections.mongodb import MongoDbConn
from utilities.common import get_solution_from_session, read_multiple_files, save_to_folder, construct_json
from config_vars import TEMPLATE_CONFIG, CLAIMS_COLLECTION, MOUNT_PATH, TEMPLATE_COLLECTION, \
    PERMISSIBLE_EXTENSIONS, POSTRULES_COLLECTION, JOB_COLLECTION, SECTIONS_COLLECTION, \
    ELEMENTS_COLLECTION, MAPPING_COLLECTION, DEFAULT_SECTION, UNKNOWN_TYPES, DOCUMENTS_COLLECTION, PIPELINE, PIPELINE_VARIABLES, \
    API_GATEWAY_POST_JOB_URI, DOC_ELEMENTS_COLLECTION, ENTITY_COLLECTION, TEMPLATE_TEST_COLLECTION, SERVICE_NAME, SERVICE_REQUEST_TYPES
from services.rules import update_rule, get_rule, delete_rule, get_rule_info
from copy import deepcopy
from uuid import uuid4
from datetime import datetime, timedelta
from xpms_common import trace
import traceback
from services.service_catalog import construct_nlp

tracer = trace.Tracer.get_instance(SERVICE_NAME)


def document_template_service(request, template_id):
    solution_id = get_solution_from_session(request)
    if request.method == "GET":
        if "test/" in request.get_full_path():
            return JsonResponse(get_test_template_docs(template_id, solution_id))
        elif template_id != "":
            return JsonResponse(get_template_data(solution_id, template_id))
        else:
            return JsonResponse(get_held_documents(solution_id))

    elif request.method == "POST":
        if "test/" in request.get_full_path():
            return JsonResponse(ingest_test_documents(request, solution_id))
        elif len(request.FILES) != 0 and dict(request.POST) != dict():
            payload = request.POST
            return JsonResponse(document_template_create(payload, solution_id, request.FILES['file']))
        elif "list/" in request.get_full_path():
            filter_object = json.loads(request.body.decode())
            return JsonResponse(get_template_data(solution_id, template_id=None, filter_object=filter_object))
        elif "unknown/" in request.get_full_path():
            payload = json.loads(request.body.decode())
            return JsonResponse(publish_template(payload, solution_id, endpoint=TEMPLATE_CONFIG["SAVE"]))
        else:
            payload = json.loads(request.body.decode())
            return JsonResponse(publish_template(payload, solution_id))

    elif request.method == "DELETE":
        payload = json.loads(request.body.decode())
        if payload is not None:
            if "rec_id" in payload.keys():
                return JsonResponse(update_held_status(payload["rec_id"]))
            elif "list/" in request.get_full_path() and "template_id" in payload.keys():
                data = {"solution_id": solution_id, "data": {"template_id": payload["template_id"]}}
                return JsonResponse(delete_template(data, "Template deleted successfully"))


def get_template_data(solution_id, template_id=None, filter_object=None):
    resp = dict()
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if template_id:
            templates = format_template_data(solution_id, template_id)
            template_data = templates
            template_data["volume"] = MOUNT_PATH
        else:
            # todo add projection to optimise?
            sort_by, order_by_asc, skip, limit = common.get_pagination_details(filter_object, sort_by='created_ts',
                                                                               order_by_asc=-1, skip=0,
                                                                               limit=0)
            projection = {"template_name": 1, "template_id": 1, "created_ts": 1, "updated_ts": 1, "doc_state": 1,
                          "is_draft": 1, "_id": 0, "template_type": 1}
            filter_query = {"solution_id": solution_id, "is_deleted": False}
            if "template_type" in filter_object and filter_object["template_type"] == "unknown":
                filter_query["template_type"] = {"$in": UNKNOWN_TYPES}
            else:
                filter_query["template_type"] = {"$nin": UNKNOWN_TYPES}
            templates = MongoDbConn.find(TEMPLATE_COLLECTION,
                                         filter_query,
                                         projection=projection).sort("created_ts", -1)
            templates_sorted = templates.sort(sort_by, order_by_asc).skip(skip).limit(limit)
            template_data = [template for template in templates_sorted]
            resp["total_count"] = MongoDbConn.count(TEMPLATE_COLLECTION, filter_query)
        resp["data"] = template_data
        resp.update({"status": "success", "msg": "Got template data."})
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        resp.update({"status": "failure", 'msg': "Failed to get template data.", "error": str(e)})
    finally:
        context.end_span()
    return resp


def format_template_data(solution_id, template_id):
    query = {"template_id": template_id, "solution_id": solution_id}
    template = MongoDbConn.find_one(TEMPLATE_COLLECTION, query)
    template.pop("_id", None)
    if template["extn"].lower() in ["xls", "xlsx", "csv"]:
        template["doc_type"] = "excel"
    else:
        template["doc_type"] = "image"
    if "no_of_pages" not in template and "pages" in template:
        template["no_of_pages"] = len(template["pages"])
    # checking for template_type
    template_type = template["template_type"] if "template_type" in template else None
    if template_type not in UNKNOWN_TYPES:
        template["pages"] = sorted(template["pages"], key=lambda x: x["page_no"])
        for page in template["pages"]:
            if template["doc_type"] == "excel":
                page["doc_html"] = get_html_data(page)
            drop = ["keywords", "text_path", "hocr_path"]
            for key in drop:
                page.pop(key, None)
    if template is not None:
        if template_type == "unknown":
            mapping_data = MongoDbConn.find_one(MAPPING_COLLECTION, query)
            domain_mapping = get_domain_mapping(mapping_data, "default")
            if isinstance(domain_mapping, dict):
                template.update(domain_mapping)
        else:
            template["sections"] = [get_sections(query)]
    return template


def get_html_data(page):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if "html_path" in page and page["html_path"] is not None:
            file_path = os.path.join(MOUNT_PATH, page["html_path"])
            with open(file_path, "r") as file:
                string = file.read()
                return string
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    context.end_span()
    return ""


def get_sections(query):
    mapping_query = deepcopy(query)
    query.update({"is_deleted": False})
    sections = MongoDbConn.find(SECTIONS_COLLECTION, query)
    mapping_data = MongoDbConn.find_one(MAPPING_COLLECTION, mapping_query)
    default_section, sections = find_default_section(sections)
    default_section = format_parent_section(default_section, sections, mapping_data, query)
    return default_section


def format_parent_section(parent_section, sections, mapping_data, query):
    parent_id = parent_section["section_id"]
    child_sections = get_all_child_sections(parent_id, sections)
    parent_section = process_section(parent_section, mapping_data, query, parent_id)
    if child_sections:
        parent_section["sections"].extend(
            process_all_child_sections(parent_id, sections, child_sections, mapping_data, query))
    return parent_section


def find_default_section(sections):
    child_sections = []
    parent_section = None
    for index, section in enumerate(sections):
        section.pop("_id")
        if "parent_section_id" not in section or section["parent_section_id"] == section["section_id"]:
            parent_section = section
        else:
            child_sections.append(section)
    return parent_section, child_sections


def get_all_child_sections(parent_id, sections):
    child_list = []
    for section in sections:
        if section["parent_section_id"] == parent_id:
            child_list.append(section)
    return child_list


def process_all_child_sections(temp_id, all_sections, child_sections, mapping_data, query):
    section_list = []
    for section in child_sections:
        section_id = section["section_id"]
        temporary_id = temp_id + "_" + section_id
        section = process_section(section, mapping_data, query, temporary_id)
        child_sections = get_all_child_sections(section_id, all_sections)
        if child_sections:
            section["sections"].extend(
                process_all_child_sections(temporary_id, all_sections, child_sections, mapping_data, query))
        section_list.append(section)
    return section_list


def process_section(section, mapping_data, query, temp_id):
    projection = {'_id': 0}
    if mapping_data is not None:
        mapping = get_domain_mapping(mapping_data, section["section_id"])
        if mapping != "" and isinstance(mapping, dict):
            section.update(mapping)
    query.update({"section_id": section["section_id"]})
    elements_result = MongoDbConn.find(ELEMENTS_COLLECTION, query, projection)
    section["temp_id"] = temp_id
    section["type"] = "section"
    section["sections"] = format_elements(mapping_data, elements_result, temp_id)
    return section


def get_hierarchy_temp_id(section, sections, temp_id):
    if "parent_section_id" in section and section["parent_section_id"] != "":
        parent_id = section["parent_section_id"]
        if temp_id == "":
            temp_id = section["parent_section_id"] + "_" + section["section_id"]
        else:
            temp_id = section["parent_section_id"] + "_" + temp_id
        [parent_section] = [data for data in sections if section["section_id"] == parent_id]
        return get_hierarchy_temp_id(parent_section, sections, temp_id)
    else:
        if temp_id == "":
            return section["section_id"]
        else:
            return temp_id


def get_held_documents(solution_id):
    resp = dict()
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        query = dict({"doc_type": {"$regex": "unknown", '$options': 'i'}})
        query['$or'] = [{"file_name": {"$regex": itm, '$options': 'i'}} for itm in PERMISSIBLE_EXTENSIONS]
        query["not_held"] = {"$exists": False}
        query["solution_id"] = solution_id
        result = MongoDbConn.find(CLAIMS_COLLECTION, query).sort("_id", -1).limit(20)
        if result is not None:
            resp["data"] = [{"url": rec["file_path"], "rec_id": str(rec["_id"])} for rec in result]
            resp.update({"status": "success", "msg": "20 latest held documents."})
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        resp.update({"status": "failure", 'msg': "Failed to get held documents.", "error": str(e)})
    finally:
        context.end_span()
    return resp


def document_template_create(payload, solution_id, uploaded_file):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        file_data = common.save_to_folder(solution_id, uploaded_file, MOUNT_PATH, "templates", "uploads", flag=True)
        data = common.create_data(payload)
        data = {"file_path": file_data["data"]["relative_path"], "template_name": data["template_name"]}
        post_data = {"solution_id": solution_id, "data": data}
        response = http.post_job(TEMPLATE_CONFIG["SAVE"], post_data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not http.is_request_timeout(response):
            status, result = http.get_response(response)
            if status:
                # Temporary way to create a default section for a template
                template_id = http.get_nested_value(response, "result.result.metadata.template_id")
                section_create = create_new_section(template_id, solution_id, DEFAULT_SECTION)
                if section_create["status"] == "success":
                    return {'status': 'success', 'msg': 'Template created/updated successfully', 'job_id':job_id}
                else:
                    return {'status': 'failure', 'msg': section_create["msg"], 'job_id':job_id}
            else:
                return {'status': 'failure', 'msg': 'Failed to create/update template', 'error': result, 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timeout', "error": response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "Failed to create/update template.",
                    "error": str(e), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Failed to create/update template.",
                    "error": str(e)}
    finally:
        context.end_span()


def publish_template(payload, solution_id, endpoint=TEMPLATE_CONFIG["PUBLISH"]):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        post_data = {"solution_id": solution_id, "data": payload}
        if "is_draft" in payload and not payload["is_draft"]:
            if "template_type" in payload and payload["template_type"] in ["unknown","unknown_known"]:
                pass
            else:
                template_domain_mapping = get_all_used_domainmappings(solution_id, payload["template_id"])
                is_valid, missed_attr = validate_template_mappings(template_domain_mapping, solution_id)
                if not is_valid:
                    return {'status': 'failure', 'msg': 'Failed to publish template due to missing domain objects',
                            'error': missed_attr}
        response = http.post_job(endpoint, post_data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not http.is_request_timeout(response):
            status, result = http.get_response(response)
            if status:
                template_id = http.get_nested_value(response, "result.result.metadata.template_id")
                return {'status': 'success', 'msg': 'Template updated successfully',
                        "template_id": template_id, 'job_id':job_id}
            else:
                return {'status': 'failure', 'msg': 'Failed to update template',
                        'error': result, 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timeout',
                    "error": response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "Failed to publish template.",
                    "error": str(e), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Failed to publish template.",
                    "error": str(e)}
    finally:
        context.end_span()


def create_new_section(template_id, solution_id, section_data):
    result = {"status": "failure"}
    section = section_data
    section["template_id"] = template_id
    section["solution_id"] = solution_id
    section['token']='section'
    data = {"solution_id": solution_id, "data": section}
    response = http.post_job(TEMPLATE_CONFIG["SAVE"], data)
    if 'job_id' in response:
        result["job_id"] = response["job_id"]
    if not http.is_request_timeout(response):
        status, msg = http.get_response(response)
        if status:
            result["section_id"] = http.get_nested_value(response, "result.result.metadata.section_id")
            result["status"] = "success"
            result["msg"] = "Section created successfully"
        else:
            result["msg"] = msg
    else:
        result["msg"] = "Timeout"
    return result


def update_held_status(ref_id):
    resp = dict()
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if ref_id is not None:
            MongoDbConn.update(CLAIMS_COLLECTION, {"_id": ObjectId(str(ref_id))},
                               {"not_held": True})
        resp.update({"status": "success", "msg": "Removed from held documents"})
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        resp.update({"status": "failure", 'msg': "Failed to remove from held documents", "error": str(e)})

    context.end_span()
    return resp


def delete_template(data, msg):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        response = http.post_job(TEMPLATE_CONFIG["DELETE"], data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not http.is_request_timeout(response):
            status, result = http.get_response(response)
            if status:
                return {'status': 'success', 'msg': msg, 'job_id':job_id}
            else:
                return {'status': 'failure', 'msg': 'Failed to delete',
                        'error': result, 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timeout',
                    "error": response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "Failed to delete.",
                    "error": str(e), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Failed to delete.", "error": str(e)}
    finally:
        context.end_span()


def post_process_rules(request, template_id):
    solution_id = get_solution_from_session(request)
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "GET":
            return get_post_process_rules(solution_id, template_id)
        elif request.method == "POST":
            rule = json.loads(request.body.decode())
            return update_post_process_rules(solution_id, template_id, rule)
        elif request.method == "DELETE":
            rule = json.loads(request.body.decode())
            return delete_post_process_rules(solution_id, template_id, rule)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def get_post_process_rules(solution_id, template_id):
    result = dict(status="success")
    query = {"template_id": template_id, "solution_id": solution_id, "is_deleted": False}
    template_rules = MongoDbConn.find_one(POSTRULES_COLLECTION, query)
    rules = []
    result["doc_variables"] = get_all_doc_variables(query)
    if template_rules is not None:
        template_rules.pop('_id')
        for rule in template_rules["rules"]:
            resp = get_rule(solution_id, rule)
            if resp["status"] == "success":
                rules.append(resp["data"])
        template_rules["data"] = dict(rules=rules)
        result["msg"] = "Data retrieved successfully"
        result.update(template_rules)
    else:
        result.update({"data": {}, "msg": "No data for the template"})
    return result


def update_post_process_rules(solution_id, template_id, rule):
    result = dict(status="success")
    template_rule = MongoDbConn.find_one(POSTRULES_COLLECTION,
                                         {"template_id": template_id, "solution_id": solution_id, "is_deleted": False})
    resp = update_rule(solution_id, rule)
    if resp["status"] == "success":
        if "rule_id" not in rule and "rule_id" in resp:
            if template_rule is None:
                template_rule = dict(template_id=template_id, solution_id=solution_id, rules=[resp["rule_id"]])
                resp = post_postprocess_rules(solution_id, template_rule)
                if "job_id" in resp:
                    result['job_id'] = resp['job_id']
                if resp["status"] == "success":
                    result.update({"msg": "Post processing rule created successfully"})
                else:
                    result["msg"] = resp["msg"]
            else:
                template_rule["rules"].append(resp["rule_id"])
                resp = post_postprocess_rules(solution_id, template_rule)
                if "job_id" in resp:
                    result['job_id'] = resp['job_id']
                if resp["status"] == "success":
                    result.update({"msg": "New rule added successfully"})
                else:
                    result["msg"] = resp["msg"]
        else:
            result["msg"] = "Rule updated successfully"
    else:
        result = resp
    return result


def delete_post_process_rules(solution_id, template_id, rule):
    result = dict(status="success")
    template_rule = MongoDbConn.find_one(POSTRULES_COLLECTION,
                                         {"template_id": template_id, "solution_id": solution_id})
    if "rule_id" in rule:
        resp = delete_rule(solution_id, rule["rule_id"])
        if resp["status"] == "success":
            template_rule["rules"].remove(rule["rule_id"])
            resp = post_postprocess_rules(solution_id, template_rule)
            if resp["status"] == "success":
                result["msg"] = "Rule Deleted successfully"
            else:
                result["msg"] = resp["msg"]
        else:
            result["status"] = "failed"
    return result



def get_all_doc_variables(query):
    query.pop("is_deleted")
    template = MongoDbConn.find_one(TEMPLATE_COLLECTION, query)
    template = json.loads(template["template"]) if template else {}
    return [v[0]["name"] for v in template["document_variables"].values()] if template["document_variables"] else[]

def get_all_doc_variables(query):
    query.pop("is_deleted")
    template = MongoDbConn.find_one(TEMPLATE_COLLECTION, query)
    template = json.loads(template["template"]) if template else {}
    if "document_variables" in template.keys() and template["document_variables"] is not None:
        return [v[0]["name"] for v in template["document_variables"].values()]
    else:
        return []
    # return [v[0]["name"] for v in template["document_variables"].values()] if template["document_variables"] else[]


def post_postprocess_rules(solution_id, template_rule):
    result = dict(status="failure")
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        post_rule_post = deepcopy(template_rule)
        if "_id" in post_rule_post.keys():
            post_rule_post.pop("_id")
        post_rule_post["token"]="post_processing_rules"
        response = http.post_job(TEMPLATE_CONFIG["SAVE"],
                                 {"solution_id": solution_id, "data": post_rule_post})
        if 'job_id' in response:
            result["job_id"] = response['job_id']
        if not http.is_request_timeout(response):
            status, msg = http.get_response(response)
            if status:
                result["status"] = "success"
                result["msg"] = "Post processing rules posted successfully"
            else:
                result["msg"] = msg
        else:
            result["msg"] = "Request timed out"
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        result["msg"] = str(e)
    context.end_span()
    return result


def templates_fields(request):
    solution_id = get_solution_from_session(request)
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "POST":
            payload = json.loads(request.body.decode())
            payload["solution_id"] = solution_id
            if payload["type"] == "table":
                payload["map_to"], payload["headings"] = format_table_mapping(payload["headings"])
            else:
                if "domain_mapping" in payload:
                    payload["map_to"] = payload.pop("domain_mapping")
                    payload["is_doc_var"] = False
                elif "document_variable" in payload:
                    payload["map_to"] = payload.pop("document_variable")
                    payload["is_doc_var"] = True
            if payload["type"] == "section":
                return create_new_section(payload["template_id"], solution_id, payload)
            else:
                return create_new_element(payload, solution_id)

        elif request.method == "DELETE":
            payload = json.loads(request.body.decode())
            delete_data = {"template_id": payload["template_id"], "section": payload["section_id"],
                           "section_id": payload["section_id"]}
            if payload["type"] == "section":
                token = "section"
                msg = "Section deleted successfully"
            else:
                delete_data.update({"element_id": payload["element_id"]})
                token = "element"
                msg = "Element deleted successfully"
            delete_data["token"]=token
            data = {"solution_id": solution_id, "data": delete_data}
            return delete_template(data, msg)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def create_new_element(payload, solution_id):
    result = {"status": "failure"}
    payload["page_no"] = int(payload["page_no"]) if "page_no" in payload else 1
    payload["token"]= "element"
    data = {"solution_id": solution_id, "data": payload}
    response = http.post_job(TEMPLATE_CONFIG["SAVE"], data)
    if 'job_id' in response:
        result["job_id"] = response["job_id"]
    if not http.is_request_timeout(response):
        status, msg = http.get_response(response)
        if status:
            result["element_id"] = http.get_nested_value(response, "result.result.metadata.element_id")
            result["status"] = "success"
            result["msg"] = "Fields created/updated successfully"
        else:
            result["msg"] = msg
    else:
        result["msg"] = "Request timed out"
    return result


def format_elements(mapping_data, elements_result, temp_id):
    elements_list = []
    for element in elements_result:
        if mapping_data is not None:
            mapping = get_domain_mapping(mapping_data, element["section_id"], element["element_id"])
            if mapping != "" and isinstance(mapping, dict):
                if element["type"] == "table" and "headings" in element:
                    element["headings"] = format_headings_mapping(element["headings"], mapping["data"])
                element.update(mapping)
        element["temp_id"] = temp_id + "_" + element["element_id"]
        elements_list.append(element)
    return elements_list


def get_domain_mapping(mapping_data, section_id=None, element_id=None):
    if "sections" in mapping_data:
        for section, value in mapping_data["sections"].items():
            if section_id == section:
                if element_id is None:
                    if "map_to" in value:
                        if "is_doc_var" in value and value["is_doc_var"] and "doc_var" in value:
                            return {"document_variable": value["map_to"], "doc_var": value["doc_var"]}
                        else:
                            return {"domain_mapping": value["map_to"]}
                if "elements" in value:
                    elements_mapped = value["elements"]
                    for element_key, data in elements_mapped.items():
                        if element_id == element_key:
                            if "map_to" in data:
                                if isinstance(data["map_to"], list):
                                    return {"data": data["map_to"]}
                                else:
                                    if not data["is_deleted"]:
                                        if "is_doc_var" in data and data["is_doc_var"] and "doc_var" in data:
                                            return {"document_variable": data["map_to"], "doc_var": data["doc_var"]}
                                        else:
                                            return {"domain_mapping": data["map_to"]}
    return ""


def format_headings_mapping(headings, data):
    for index in range(len(data)):
        mapping = data[index]
        if mapping["is_doc_var"]:
            headings[index]["document_variable"] = mapping["map_to"]
        else:
            headings[index]["domain_mapping"] = mapping["map_to"]
    return headings


def format_table_mapping(headings):
    map_list = []
    for heading in headings:
        maps = dict()
        if "domain_mapping" in heading:
            maps["map_to"] = heading["domain_mapping"]
            maps["is_doc_var"] = False
            heading.pop("domain_mapping")
        elif "document_variable" in heading:
            maps["map_to"] = heading["domain_mapping"]
            maps["is_doc_var"] = True
            heading.pop("document_variable")
        map_list.append(maps)
    return map_list, headings


def get_all_used_domainmappings(solution_id, template_id=None):
    query = {"solution_id": solution_id, "is_deleted": False, "is_draft": False}
    if template_id:
        query.update({"template_id": template_id, "is_draft": True})
        published_templates = [MongoDbConn.find_one(TEMPLATE_COLLECTION, query)]
    else:
        published_templates = MongoDbConn.find(TEMPLATE_COLLECTION, query)
    map_data = dict()
    for template in published_templates:
        mapping_query = {"template_id": template["template_id"], "solution_id": solution_id}
        mapping = MongoDbConn.find_one(MAPPING_COLLECTION, mapping_query)
        if mapping:
            section_data = mapping["sections"]
            for section_id, data in section_data.items():
                if "map_to" in data and not data["is_deleted"]:
                    map_data = get_all_mappings(map_data, data["map_to"])
                if "elements" in data:
                    element_data = data["elements"]
                    for element_id, element_data in element_data.items():
                        if "map_to" in element_data and not element_data["is_deleted"]:
                            map_data = get_all_mappings(map_data, element_data["map_to"])
    return map_data


def get_all_mappings(maps, data):
    if isinstance(data, list):
        for item in data:
            if "map_to" in item:
                maps = format_domain_data(maps, item["map_to"])
        return maps
    else:
        return format_domain_data(maps, data)


def format_domain_data(maps, data):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        domain_split = data.split('.')
        if len(domain_split) < 2:
            return maps
        else:
            for index in range(len(domain_split) - 1):
                domain = domain_split[index + 1]
                if domain_split[index] in maps.keys():
                    if domain not in maps[domain_split[index]]:
                        maps[domain_split[index]].append(domain)
                else:
                    maps[domain_split[index]] = [domain]
            return maps
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def get_test_template_docs(template_id, solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)

    filter_query = {"solution_id": solution_id, "template_id": template_id, "is_test": True}
    projection = {"_id": 0, "doc_id": 1, "metadata": 1, "pages.file_path": 1, "pages.page_no": 1, "doc_state": 1,
                  "no_of_pages": 1, "ref_id": 1, 'created_ts': 1}

    temp_files = MongoDbConn.find(TEMPLATE_TEST_COLLECTION, {"solution_id": solution_id, "template_id": template_id}
                                  , projection)
    temp_files_list = [file for file in temp_files]

    test_files = MongoDbConn.find(DOCUMENTS_COLLECTION, filter_query, projection)
    files_list = [file for file in test_files] if test_files is not None else []
    for f_item in files_list:
        f_item['created_ts'] = datetime.strptime(f_item['created_ts'], '%Y-%m-%dT%H:%M:%S.%f')
    all_files_list = []
    for temp_file in temp_files_list:
        temp_doc_data = next((item for item in files_list
                              if "ref_id" in item and item["ref_id"] == temp_file["doc_id"]), None)
        if temp_doc_data:
            MongoDbConn.remove(TEMPLATE_TEST_COLLECTION, {"doc_id": temp_file["doc_id"], "template_id": template_id,
                                                          "solution_id": solution_id})
        else:
            all_files_list.append(temp_file)

    all_files_list.extend(files_list)

    # sorting the pages in all files
    for file in all_files_list:
        if "pages" in file:
            file["pages"] = sorted(file["pages"], key=lambda f: f['page_no'])
    all_files_list.sort(key=lambda f: f['created_ts'], reverse=True)

    context.end_span()
    return {"status": "success", "data": {"documents": all_files_list, "volume": MOUNT_PATH},
            "msg": "Test documents list retrieved successfully"}


def ingest_test_documents(request, solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        payload_qdict = request.POST
        payload = json.loads(payload_qdict.get("data", "0"))
        template_dict = payload
        files_list = read_multiple_files(request)
        for file_key, file_value in files_list.items():
            file_data = save_to_folder(solution_id, file_value[0], MOUNT_PATH, "documents", "uploads", True)
            if file_data["status"] == "success":
                post_data = {}
                ref_id = str(uuid4())
                template_dict["ref_id"] = ref_id
                post_data["template"] = template_dict
                post_data["file_path"] = file_data['data']["relative_path"]
                post_data["pipeline_name"] = PIPELINE_VARIABLES["INGEST_DOCUMENT"]
                post_data["request_type"] = SERVICE_REQUEST_TYPES["INGEST_DOCUMENT"]
                post_result = http.post(API_GATEWAY_POST_JOB_URI + PIPELINE["TRIGGER_PIPELINE"],
                                        {"data": post_data, "solution_id": solution_id})
                if post_result["status"] == "success":
                    file_data = file_data["data"]
                    file_name = file_data["filename"].rsplit(".", 1)[0]
                    data = {"doc_id": ref_id, "metadata": {"file_name": file_name, "extn": file_data["extn"]},
                            "template_id": payload["template_id"], "created_ts": datetime.now(), "solution_id": solution_id}
                    MongoDbConn.insert(TEMPLATE_TEST_COLLECTION, data)
                else:
                    return {'status': 'failure', 'msg': 'Failed to injest the file', 'error': post_result}
            else:
                return {'status': 'failure', 'msg': 'Failed to save the file'}
        return {"status": "success", "msg": "File(s) uploaded for Processing"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def process_test_documents(request, doc_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        if request.method == "GET":
            projection = {"_id": 0, "element_id": 1, "page_no": 1, "value_coordinates": 1, "value_coordinates_list": 1}
            query = dict(solution_id=solution_id)
            query.update({"$or": [{"doc_id": doc_id}, {"ref_id": doc_id}]})
            document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query)
            if document:
                if "doc_state" in document and document["doc_state"] == "processed":
                    if "entity" in document:
                        entity_data = json.loads(document["entity"])
                        elements = MongoDbConn.find(DOC_ELEMENTS_COLLECTION, query, projection)
                        element_info = [get_coordinates_list(element,"value_coordinates", "value_coordinates_list") for element in elements]

                        review_data = dict(attributes_extracted=0, review_required=0, confidence=0)
                        review_data["entity_feedback"] = document[
                            "entity_feedback"] if "entity_feedback" in document else []

                        enriched_data = format_enriched_data(entity_data, element_info,review_data,
                                                             rules_reqd=False)

                        return {"status": "success", "enriched_data": enriched_data,"elements":element_info,
                                "msg": "Enriched data retrieved successfully"}
                    else:
                        return {"status": "failure", "msg": "Document failed to enrich"}
                else:
                    return {"status": "success", "msg": "Document is being processed"}
            else:
                temp_data = MongoDbConn.find_one(TEMPLATE_TEST_COLLECTION, query)
                if temp_data:
                    if datetime.now() > temp_data["created_ts"] + timedelta(minutes=10):
                        return {"status": "failure", "msg": "Document failed to ingest"}
                    else:
                        return {"status": "success", "msg": "Document is being processed"}
                else:
                    return {"status": "failure", "msg": "Document not found"}
        elif request.method == "POST":
            entity_formatted = json.loads(request.body.decode())
            query = {"doc_id": doc_id, "solution_id": solution_id}
            MongoDbConn.update(DOCUMENTS_COLLECTION, query, {"entity_formatted": entity_formatted["feedback"]})
            return {"status": "success", "msg": "Feedback Saved Successfully"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Error occurred while processing", "error": str(e)}
    finally:
        context.end_span()


def format_enriched_data(raw_entity,elements,review_data,enrich_data, rules_reqd=True):
    if isinstance(raw_entity, list):
        enriched_data = raw_entity[0]
    else:
        if "raw_entity" in raw_entity:
            enriched_data = raw_entity["raw_entity"]
        else:
            enriched_data = raw_entity
    domain_object = []
    if "data" in enriched_data and isinstance(enriched_data["data"],dict):
        for key, value in enriched_data["data"].items():
            if key == "insight_id":
                continue
            if isinstance(value,dict):
                value = [value]
            for value_dict in value:
                entity_id = value_dict["entity_id"]
                insight_id = value_dict["insight_id"] if "insight_id" in value_dict else None
                domain_data = populate_fields(key, "domain", key, entity_id=entity_id,
                                              insight_id=insight_id, cardinality="1",entity_key=key)
                domain_data["attributes"] = []
                solution_id = value_dict["solution_id"]
                if "data" in value_dict:
                    if isinstance(value_dict["data"],dict):
                        rules = value_dict["rules_apply"] if "rules_apply" in value_dict and rules_reqd else None
                        entities = get_entities(value_dict["data"],key,rules,elements,solution_id,entity_id,insight_id,
                                                review_data,rules_reqd,parent=key,
                                                parent_insight_id=insight_id,entity_name=key,enrich_data=enrich_data)
                        domain_data["attributes"].extend(entities)
                domain_object.append(domain_data)
    review_data["confidence"] = review_data["confidence"] / max(review_data["attributes_extracted"], 1)
    return domain_object


def get_entities(entity_data,temp_id,rules,elements,solution_id,entity_id,insight_id,
                 review_data,rules_reqd=True,parent="",parent_insight_id="",entity_name="",enrich_data={}):
    all_entities = []
    processed_rules = get_all_rules_processed(rules)
    attribute_list = []
    for key_name,value in entity_data.items():
        if key_name == "insight_id":
            continue
        temp_entity_id = temp_id + "-" + key_name
        if isinstance(value,dict):
            entity_id = value["entity_id"]
            entity_key = parent + "." + key_name
            entity_object = populate_fields(key_name,"entity",temp_entity_id,entity_id=entity_id,
                                            cardinality="1",entity_key=entity_key,insight_id=value["insight_id"],
                                            extracted_name=key_name,parent_insight_id=parent_insight_id)
            if "data" in value and isinstance(value["data"],dict):
                rules = value["rules_apply"] if "rules_apply" in value and rules_reqd else None
                insight_id = value["insight_id"] if "insight_id" in value else None
                entity_object["attributes"] = get_entities(value["data"],temp_entity_id,rules,elements,solution_id,
                                                           entity_id,insight_id,review_data,rules_reqd,
                                                           parent=entity_key,parent_insight_id=insight_id,entity_name=key_name,
                                                           enrich_data=enrich_data)
                all_entities.append(entity_object)
        elif list_of_dict(value):
            entity_key = parent + "." + key_name
            entity_object = populate_fields(key_name,"grouped_entity",temp_entity_id,entity_id="",
                                            cardinality="n",entity_key=entity_key,
                                            extracted_name=key_name,parent_insight_id=parent_insight_id)
            for val in value:
                rules = val["rules_apply"] if "rules_apply" in val and rules_reqd else None
                if "data" in val and isinstance(val["data"],dict):
                    entity_id = val["entity_id"]
                    insight_id = val["insight_id"] if "insight_id" in val else None
                    entity_object["groups"].extend(get_entities(val["data"],temp_entity_id,rules,elements,
                                                                    solution_id,entity_id,insight_id,
                                                                review_data,rules_reqd,parent=entity_key,
                                                                parent_insight_id=insight_id,entity_name=key_name,
                                                                enrich_data=enrich_data))
            all_entities.append(entity_object)
        else:
            if rules_reqd:
                temp_entity_id = temp_entity_id + "-" + str(entity_id).replace("-","_")
            else:
                temp_entity_id = temp_entity_id + "-" + str(entity_id).replace("-","~")
            attribute = populate_fields(key_name,"attribute",temp_entity_id,review_data,elements,value,processed_rules,
                                        entity_id,entity_key=parent, extracted_name=key_name,enrich_data=enrich_data)
            attribute_list.append(attribute)
    if attribute_list:
        entity_object = dict(type="attribute",attributes=attribute_list,entity_id=entity_id,
                             insight_id=insight_id,name=entity_name)
        all_entities.append(entity_object)
    return all_entities


def populate_fields(name,type,temp_id,review_data=[],elements=[],value=None,rules={},insight_id="",entity_id="",
                    cardinality="",entity_key="",parent_insight_id='',extracted_name='',enrich_data={}):
    data = dict(name=name,type=type,temp_id=temp_id, extracted_name=extracted_name)
    if type in ["domain","entity","grouped_entity"]:
        data["entity_id"] = entity_id
        data["insight_id"] = insight_id
        data["parent_insight_id"] = parent_insight_id
        data["entity_key"] = entity_key
        data["cardinality"] = cardinality
        if type == "grouped_entity":
            data["groups"] = []
        else:
            data["attributes"] = []
    else:
        if isinstance(value,list):
            value_data,confidence,count = get_value_info(value,elements,rules,name,temp_id)
            review_data["attributes_extracted"] += count
            review_data["confidence"] += confidence
            #data["confidence"] = round((confidence/max(count,1)),2)
            if len(value_data) > 0:
                extracted_value = value_data[0]['extracted_value']
            else:
                extracted_value = value_data['extracted_value']
        else:
            value_data = value
            extracted_value = value
        domain_mapped = entity_key + "." + name
        nlp_data = construct_nlp(enrich_data, domain_mapped)
        if nlp_data:
            value_data["nlp"] = nlp_data
        reviewed = False
        data["is_accept"] = False
        data["is_corrected"] = False
        data["need_review"] = True
        if review_data["entity_feedback"] is not None:
            for feedback in reversed(review_data["entity_feedback"]):
                if "entity_id" in feedback and entity_id == feedback["entity_id"]:
                    if "upsert" in feedback:
                        feed_data = feedback["upsert"]
                        key = "is_corrected"
                    elif "accept" in feedback:
                        feed_data = feedback["accept"]
                        key = "is_accept"
                    else:
                        feed_data = []
                    for item in feed_data:
                        attr = item["key"].split(".",1)[-1]
                        if attr == name:
                            data[key] = True
                            data["need_review"] = False
                            reviewed = True
                            break
                    if reviewed:
                        break
        if not reviewed:
            review_data["review_required"] += 1
        data["values"] = value_data
        data["justification"] = ""
        data["entity_key"] = entity_key
    return data


def list_of_dict(text):
    if text and isinstance(text, list) and isinstance(text[0], dict):
        return True
    return False


def get_value_info(values, elements, rules, domain_map,temp_id):
    confidence = count = 0
    all_values = []
    for value_list in values:
        if isinstance(value_list, list):
            final_value, is_list_of_list = listoflist(value_list)
            data, confidence, count = get_value(final_value, elements, confidence, count, rules, domain_map)
            data["temp_id"] = str(temp_id) + "_" + str(count)
            all_values.append(data)
        elif isinstance(value_list, str):
            data, confidence, count = get_value(values, elements, confidence, count, rules, domain_map)
            data["temp_id"] = str(temp_id) + "_" + str(count)
            all_values.append(data)
            break
    return all_values, confidence, count


def get_value(value_list, elements, confidence, count, rules, domain_map):
    value_dict = {}
    for index, value in enumerate(value_list):
        if index == 1:
            value_dict.update(get_element_info(value, elements))
            value_dict.update({'is_checked': True})
        elif index == 0:
            value_dict = {"value": value,'extracted_value': value, 'is_checked': True}
            context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
            context.start_span(component=__name__)
            try:
                rule_data = dict()
                if "rules" in rules and rules["rules"]:
                    for rule in rules["rules"]:
                        if rule["key_name"] == domain_map.split(".", 1)[-1] and \
                                "source" in rule and rule["source"] == value:
                            rule_info = get_rule_info(rules["solution_id"], rule["rule_id"])
                            if rule_info["status"]["success"]:
                                rule_type = rule_info["metadata"]["rule"]["rule_type"]
                                if rule_type == "V":
                                    rule_data = construct_json(rule, ["status", "rule_id"])
                                    rule_data["validation_message"] = rule_info["metadata"]["rule"][
                                        "validation_message"]
                                if rule_type == "S" and rule["value"] != "":
                                    rule_data = construct_json(rule, ["value", "rule_id", "source"])
                                    value_dict["value"] = rule_data["value"]
                    value_dict.update({"rules": rule_data})
            # TODO raise specific exception
            except Exception as e:
                context.log(message=str(e), obj={"tb": traceback.format_exc()})
            finally:
                context.end_span()
        elif index == 2:
            if isinstance(value, float):
                confidence += value * 100
                count += 1
            context1 = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
            context1.start_span(component=__name__)
            try:
                if value_dict:
                    value_dict["score"] = confidence
            # TODO raise specific exception
            except Exception as e:
                context1.log(message=str(e), obj={"tb": traceback.format_exc()})
            finally:
                context1.end_span()

        # else:
        #     if isinstance(value_dict["value"], list):
        #         value_dict["value"] = value_dict["value"].append(value)
        #     else:
        #         value_dict["value"] = [value_dict["value"]] + [value]
    return value_dict, confidence, count


def listoflist(value):
    if (isinstance(value, list)) and len(value) == 1:
        value_sub = value[0]
        if isinstance(value_sub, list):
            return value_sub, True
    return value, False


def get_element_info(element_id, elements):
    element_info = next((item for item in elements if item["id"] == element_id), None)
    element = {}
    if element_info is not None:
        try:
            if element_info["node_type"] == "field":
                regions = element_info["value"]["regions"]
            elif element_info["node_type"] in ["heading","sentence","paragraph","omr_field","list","table","section"]:
                regions = element_info["regions"]
            element = dict(id=element_id,regions=regions)
        except Exception as e:
            print("Element not added due to an exception " + str(e))
    return element

def get_coordinates_list(data,input,output):
    if output not in data and input in data:
        coordinates = data[input]
        coordinates["page_no"] = data["page_no"] if "page_no" in data else 1
        data[output] = [coordinates]
        #data.pop(input)
    if output in data:
        temp_out = data[output]
        if not isinstance(temp_out, list):
            temp_out = [temp_out]
        data[output] = sorted(temp_out, key=lambda f: f['page_no'],reverse=True)
    return data

def get_all_rules_processed(rules):
    rules_data = dict()
    if rules:
        for rule in rules:
            key_name = rule.pop("key_name")
            rules_data[key_name] = rule
    return rules_data

def get_rules_info(domain_mapped,all_rules,solution_id,value=None):
    value_dict = dict(value=value,is_checked=True, extracted_value= value)
    rule_dict = dict()
    if domain_mapped in all_rules:
        processed_rule = all_rules[domain_mapped]
        rule_dict = construct_json(processed_rule,["rule_name","status","value"])
        rule_info = get_rule_info(solution_id,processed_rule["rule_id"])
        if rule_info["status"]["success"]:
            rule_type = rule_info["metadata"]["rule"]["rule_type"]
            if rule_type == "V":
                rule_dict["validation_message"] = rule_info["metadata"]["rule"]["validation_message"]
                rule_dict.pop("value",None)
            elif rule_type == "S":
                if rule_dict["value"] == "":
                    rule_dict["validation_message"] = rule_info["metadata"]["rule"]["validation_message"]
                    rule_dict.pop("value", None)
                else:
                    value_dict["value"] = rule_dict["value"]
    value_dict["rules"] = rule_dict
    value_dict['is_checked'] = True
    return value_dict


def validate_template_mappings(template_mappings,solution_id):
    is_valid=True
    missed_attr_list = []
    for entity, temp_attr_list in template_mappings.items():
        entity_data = MongoDbConn.find_one(ENTITY_COLLECTION, {"entity_name": entity, "solution_id": solution_id})
        if not entity_data:
            is_valid = False
            missed_attr_list = [entity]
            break
        else:
            entity_attr_list = [attr["key_name"] for attr in entity_data["attributes"]]
            missed_attr_list = [attr for attr in temp_attr_list if attr not in entity_attr_list]
            if missed_attr_list:
                is_valid = False
                break
    return is_valid, missed_attr_list


def get_doc_types(solution_id=None):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        filter_query = {"is_deleted": False, "is_draft": False}
        if solution_id is not None:
            filter_query['solution_id'] = solution_id
        data = MongoDbConn.find(TEMPLATE_COLLECTION, filter_query)
        template_list = []
        for rec in data:
            temp = dict(template_id=rec["template_id"], template_name=rec["template_name"])
            template_list.append(temp)
        return {"status": "success", "doc_types": template_list}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()
