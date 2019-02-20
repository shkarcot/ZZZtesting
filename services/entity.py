import json
import os
import ontospy
import traceback
from django.core.files.storage import FileSystemStorage

from utilities import common
from utilities.http import post_job, get_nested_value, get_response, create_job
from utilities.common import is_request_timeout, get_solution_from_session, delete_files, save_to_folder
from config_vars import ENTITY_DEFN_COLL, MOUNT_PATH, ENTITY_COLLECTION, JOB_COLLECTION, SERVICE_NAME,\
    TEMPLATE_COLLECTION, ENTITY_CONFIG, MAPPING_COLLECTION ,UNKNOWN_TYPES
from connections.mongodb import MongoDbConn
from copy import deepcopy
from services.document_templates import get_all_used_domainmappings
from services.service_catalog import process_result_set
from uuid import uuid4
from xpms_common import trace
import traceback
tracer = trace.Tracer.get_instance(SERVICE_NAME)

entity_schema = {
    "definitions": {

    },
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "entity_cfg": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "entity_name": {
                        "type": "string",

                    },
                    "entity_synonym": {
                        "type": "array",
                        "items": {

                        }
                    },
                    "entity_type": {
                        "type": "string",

                    },
                    "primary_key": {
                        "type": "array",
                        "items": {
                            "type": "string",

                        }
                    },
                    "attributes": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "key_name": {
                                    "type": "string",

                                },
                                "synonym": {
                                    "type": "array",
                                    "items": {
                                        "type": "string",

                                    }
                                },
                                "type": {
                                    "type": "string",

                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
tracer = trace.Tracer.get_instance(service_name=SERVICE_NAME)


def entity_save(solution_id, entity_definitions, config):
    job_id = None
    delete_domain_object = []
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if "saveType" in entity_definitions.keys() and entity_definitions["saveType"] == "import":
            entity_definitions.pop("saveType")
            return process_uploaded_entities(solution_id, entity_definitions, config)
        else:
            if "old_domain_name" in entity_definitions or "entity_removed" in entity_definitions:
                valid, delete_domain_object = process_deletion(entity_definitions, delete_domain_object, solution_id)
                if not valid:
                    return invalid_edit_msg()

            updated_entities = convert_heirarchial_to_flat(entity_definitions["entity_cfg"])
            valid = validate_entity_updates(solution_id, updated_entities)
            if not valid:
                return invalid_edit_msg()
            entity_definitions["entity_cfg"] = updated_entities

        response = post_job(config['SAVE'], {"solution_id": solution_id, "data": entity_definitions})
        if 'job_id' in response:
            job_id = response['job_id']
        if not is_request_timeout(response):
            status, result = get_response(response)
            # Calculating Failed Entities status and error message
            failed_entity_status, err_msg = getFailedEntityStatus(response)
            # Integarting Failed Entities status as well and error message
            if status and failed_entity_status:
                if delete_domain_object:
                    result = entity_delete(delete_domain_object, solution_id, config, validated=True)
                    if result["status"] != "success":
                        return {"status": "failure",
                                "msg": "New domain object saved successfully but "
                                "failed to delete the old domain object",
                                                    'job_id': job_id}
                return {'status': 'success',
                        'msg': "Domain Objects created/updated successfully",
                        'job_id': job_id}
            else:
                return {'status': 'failure',
                        'msg': "Error while saving Domain Objects. " + err_msg,
                        'error': result, 'job_id': job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timeout',
                    "error": response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {'status': 'failure', 'msg': "Internal Error occured",
                    "error": str(e), 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': "Internal Error occured", "error": str(e)}
    finally:
        context.end_span()


def getFailedEntityStatus(response):
    """
    :param response:
    :return: failed entities status and error message
    """
    metadata = response['result']['result']['metadata']
    failed_entity = process_result_set(metadata, "entity")
    if failed_entity and failed_entity["status"] == 'success':
        if failed_entity["data"] and len(failed_entity["data"]) > 0:
            err_msg = failed_entity["data"][0]['message']
            return False, err_msg
        else:
            return True, None
    else:
        err_msg = failed_entity['msg']
        return False, err_msg


def validate_entity_delete(solution_id, entity_name):
    all_temp_entities = get_all_used_domainmappings(solution_id)
    if entity_name in all_temp_entities.keys():
        return False
    else:
        return True


def invalid_edit_msg():
    return {"status": "failure", "msg": "Changing the domain objects used in templating is not allowed. "
                                        "Move the template to draft to perform any updates"}


def process_deletion(entity_definitions, delete_domain_object, solution_id):
    if "old_domain_name" in entity_definitions:
        delete_domain_object.append(entity_definitions["old_domain_name"])
        entity_definitions.pop("old_domain_name")

    elif "entity_removed" in entity_definitions:
        if "entity_removed" in entity_definitions.keys():
            [domain_name, entity_name] = entity_definitions["entity_removed"].split(".")
            is_entity_used = check_entity_used_elsewhere(domain_name, entity_name, solution_id)
            if not is_entity_used:
                delete_domain_object.append(entity_name)

    for entity in delete_domain_object:
        valid = validate_entity_delete(solution_id, entity)
        if not valid:
            return False, delete_domain_object

    return True, delete_domain_object


def validate_entity_updates(solution_id, entities):
    all_temp_entities = get_all_used_domainmappings(solution_id)
    for entity in entities:
        if entity["entity_name"] in all_temp_entities.keys():
            temp_attr_list = all_temp_entities[entity["entity_name"]]
            entity_attributes = format_entity_data(entity)
            for attr in temp_attr_list:
                if attr not in entity_attributes:
                    return False
    return True


def format_entity_data(entity):
    attribute_list = []
    if "attributes" in entity:
        for attribute in entity["attributes"]:
            if "key_name" in attribute:
                attribute_list.append(attribute["key_name"])
    return attribute_list


def entity_get(solution_id, config, endpoint):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    # implementing for entities only
    try:
        endpoints = ["", "domainmapping", "domainobject"]
        if endpoint in endpoints:
            query = {"solution_id": solution_id}
            projection = {"_id": 0}
            if endpoint == "domainobject":
                query["entity_type"] = {"$ne": "entity"}
                projection["entity_name"] = 1
            response = MongoDbConn.find(ENTITY_COLLECTION, query, projection=projection).sort("ts", -1)
            response = [a for a in response]
        else:
            response = get_data_from_entity(config, solution_id)

        if response is not None:
            if endpoint in endpoints:
                if endpoint == "domainobject":
                    return {"domain_object": [entity["entity_name"] for entity in response], "status": "success"}
                response_heirarchial, delete_entity_list, all_entity_list = convert_flat_to_heirarchial(response)
                if endpoint == "":
                    return {"domain_object": response_heirarchial, "entities": all_entity_list}
                else:
                    response_key_attr = process_all_domains(response_heirarchial)
                    return response_key_attr
            else:
                return response
        else:
            return []
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def get_entities(solution_id,request):
    query = {"solution_id": solution_id, "entity_type":"domain_object"}
    projection = {"_id": 0, "entity_name":1 ,"attributes":1}
    response = MongoDbConn.find(ENTITY_COLLECTION, query, projection=projection).sort("ts", -1)
    response = [a for a in response]
    resp = format_entity_details(response)
    return resp


def format_entity_details(domain_objs):
    all_entities = {}
    for domain_obj in domain_objs:
        if 'attributes' and "entity_name" in domain_obj.keys():
            key_entity_name=[]
            for attr in domain_obj["attributes"]:
                if "type" and "key_name" in attr.keys() and attr["type"] == "entity":
                    key_entity_name.append(attr["key_name"])
                if len(key_entity_name)>0:
                    all_entities[domain_obj["entity_name"]]=key_entity_name
    return all_entities


def get_data_from_entity(config, solution_id):
    result = post_job(config["GET"], {"solution_id": solution_id, "data": {"filter_obj": {}}})
    response = get_nested_value(result, config["DATA"])
    return response


def entity_delete(payload, solution_id, config, validated=False):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if not validated:
            domain_object = payload["entity_name"]
            valid = validate_entity_delete(solution_id, domain_object)
            if not valid:
                return invalid_edit_msg()
            entities_list = [domain_object]
        else:
            entities_list = payload
        for entities in entities_list:
            complete_list = deepcopy(entities_list)
            get_all_sub_entities(entities, solution_id, complete_list)
        data = {"solution_id": solution_id, "data": {"filter_obj": complete_list}}
        response = post_job(config["DELETE"], data, timeout=100)
        if 'job_id' in response:
            job_id = response['job_id']
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                for ent in complete_list:
                    query = {"entity_name": ent, "solution_id": solution_id}
                    MongoDbConn.remove(ENTITY_COLLECTION, query)
            else:
                return {'status': 'failure', 'msg': 'Failed to remove',
                        'error': result, 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timeout',
                    "error": response, 'job_id':job_id}
        return {'status': 'success', 'msg': 'Successfully removed',
                                                'job_id': job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": str(e), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def process_uploaded_entities(solution_id, entities, config):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id": solution_id, "data": entities}
        job_id = create_job(config["SAVE"], data)
        if job_id is not None:
            return {"status": "success", "msg": "job submitted successfully @" + str(job_id),
                    "data": {"job_id": job_id}}
        else:
            return {"status": "failure", "msg": "failed to create job", "data": {}}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": "Internal Error occured",
                    "error": str(e), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Internal Error occured",
                    "error": str(e)}
    finally:
        context.end_span()


def get_all_sub_entities(entity_name, solution_id, entities_list):
    projection = {"attributes": 1, "entity_name": 1}
    query = {"entity_name": entity_name, "solution_id": solution_id,
             "attributes.type": {"$in": ["entity", "domain_object"]}}
    entity_data = MongoDbConn.find_one(ENTITY_COLLECTION, query, projection=projection)
    if entity_data:
        for attribute in entity_data["attributes"]:
            key_name = attribute["key_name"]
            if attribute["type"] == "entity" and not check_entity_used_elsewhere(entity_name, key_name, solution_id):
                entities_list.append(key_name)
                get_all_sub_entities(key_name, solution_id, entities_list)
    return entities_list


def upload_owl_data(request):
    solution_id = get_solution_from_session(request)
    if request.method == 'POST' and request.FILES['file']:
        uploaded_file = request.FILES['file']
        # Saving File to media folder.
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        uploaded_file_url = str(fs.url(filename)).replace("%20", " ")
        return store_entity_definitions(str(os.getcwd()) + uploaded_file_url, solution_id)
    elif request.method == "GET":
        delete_files()
        return get_entity_definitions(solution_id)


def get_entity_definitions_from_ontology(uri_or_path):
    model = ontospy.Ontospy(uri_or_path)

    entity_defns = dict()
    for PROPERTY in model.properties:
        property_name, property_qname = PROPERTY.bestLabel(), PROPERTY.qname
        property_desc = PROPERTY.bestDescription()

        for domain in PROPERTY.domains:
            domain_name, domain_qname = domain.bestLabel(), domain.qname
            domain_desc = domain.bestDescription()

            if domain_name not in entity_defns:
                entity_defns[domain_name] = dict(entity_name=domain_name, qname=domain_qname,
                                                 desc=domain_desc, attributes=[])

            for RANGE in PROPERTY.ranges:
                range_name, range_qname = RANGE.bestLabel(), RANGE.qname
                RANGE.bestDescription()

                attribute = dict(name=property_name, qname=property_qname, desc=property_desc, type=range_name)

                entity_defns[domain_name]['attributes'].append(attribute)

    return [val for (key, val) in entity_defns.items()]


def store_entity_definitions(file_path, solution_id):
    resp = dict()
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:

        data = get_entity_definitions_from_ontology(file_path)
        for itm in data:
            itm['solution_id'] = solution_id
            if "entity_name" in itm.keys():
                MongoDbConn.update(ENTITY_DEFN_COLL,
                                   where_clause={"entity_name": itm["entity_name"], "solution_id": itm["solution_id"]},
                                   query=itm)

        resp['status'] = 'success'
        resp['msg'] = 'Entity definitions successfully updated/created'
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        resp['status'] = 'failure'
        resp['msg'] = "Failed to update Entity Definitions " + str(e)
    context.end_span()
    return resp


def get_entity_definitions(solution_id):
    result = MongoDbConn.find(ENTITY_DEFN_COLL, query={'solution_id': solution_id})
    resp = list()
    if result is not None:
        for rec in result:
            rec.pop("_id")
            resp.append(rec)
    return resp


def delete_entity_definitions(solution_id, file_path):
    resp = dict()
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = get_entity_definitions_from_ontology(str(file_path))
        for itm in data:
            query = {'solution_id': solution_id}
            if "entity_name" in itm.keys():
                query["entity_name"] = itm["entity_name"]
                MongoDbConn.remove(ENTITY_DEFN_COLL, query)
        resp['status'] = 'success'
        resp['msg'] = 'Entity definitions successfully updated/created'
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        resp['status'] = 'failure'
        resp['msg'] = "Failed to update Entity Definitions " + str(e)
    context.end_span()
    return resp


def config_from_endpoint(config, endpoint):
    if endpoint is not None and endpoint not in ["", "domainmapping", "domainobject"]:
        return config[endpoint]
    else:
        return config['default']


def entity_upload(uploaded_file, solution_id, config):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        file_data = save_to_folder(solution_id, uploaded_file, MOUNT_PATH, "domainObjects", "uploads", flag=True)
        if file_data['status'] == "success":
            payload = {"type": "xml", "file_path": file_data["data"]["file_path"], "saveType": "import"}
            return entity_save(solution_id, payload, config)
        else:
            return {"status": "failure", "msg": "Failed to upload file"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Error ' + str(e)}
    finally:
        context.end_span()


def entity_download(solution_id, file_type, config):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id": solution_id, "data": {"type": file_type}}
        response = post_job(config["GET"], data)
        if 'job_id' in response:
            job_id = response['job_id']
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                file_path = get_nested_value(response, config["DATA"])
                return {'status': 'success', 'file_path': file_path,
                        'job_id':job_id}
            else:
                return {'status': 'failure',
                        'msg': 'Failed to download domain objects',
                        'error': result, 'job_id':job_id}
        else:
            return {'status': 'failure', 'msg': 'Request timeout',
                    "error": response, 'job_id':job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": str(e), 'job_id':job_id}
        else:
            return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def find_entity_data(attribute, entity_data):
    key_name = attribute["key_name"]
    for entity in entity_data:
        if entity["entity_name"] == key_name:
            for key in attribute.keys():
                if key not in entity.keys():
                    entity[key] = attribute[key]
            entity["entity_type"] = "entity"
            return entity
    return {}


def process_all_relations(domain_object, domain_objects, used_entity_list):
    attributes = domain_object["attributes"]
    for index, attribute in enumerate(attributes):
        if "entity_relation" in attribute.keys() and "name" in attribute["entity_relation"].keys():
            entity_attr = find_entity_data(attribute, domain_objects)
            if entity_attr:
                used_entity_list.append(entity_attr["entity_name"])
                attributes[index] = entity_attr
                process_all_relations(entity_attr, domain_objects, used_entity_list)
    return domain_object


def convert_flat_to_heirarchial(domain_objects):
    used_entity_list = []
    all_entity_list = [item["entity_name"] for item in domain_objects if item["entity_type"] == "entity"]
    for domain_object in domain_objects:
        if domain_object["entity_type"] == "domain_object" and "attributes" in domain_object.keys():
            process_all_relations(domain_object, domain_objects, used_entity_list)
        else:
            if "entity_type" in domain_object.keys() and domain_object["entity_type"] not in ["domain_object",
                                                                                              "entity"]:
                domain_object["entity_type"] = "domain_object"
    final_domain_object = [domain_object for domain_object in domain_objects if
                           domain_object["entity_type"] != "entity"]
    delete_entity_list = [entity for entity in all_entity_list if entity not in used_entity_list]
    return final_domain_object, delete_entity_list, all_entity_list


def convert_heirarchial_to_flat(domain_objects):
    entity_list_dict = dict(keys=[], entities=[])
    for domain_object in domain_objects:
        if "attributes" in domain_object.keys():
            attributes = domain_object["attributes"]
        else:
            attributes = []
        attribute, entity_list_dict = process_attributes(attributes, entity_list_dict)
        if ("entity_type" in domain_object.keys() and domain_object["entity_type"] != "entity") or \
                ("entity_type" not in domain_object.keys()):
            domain_object["entity_type"] = "domain_object"
        remove_unwanted_keys(domain_object, "entity")

    domain_objects.extend(entity_list_dict["entities"])
    return domain_objects


def process_attributes(attributes, entity_list_dict):
    for attribute in attributes:
        if "type" in attribute and attribute["type"] in ["related_entity", "entity"]:
            if attribute["type"] == "related_entity" and ("is_new" not in attribute or attribute["is_new"] == False):
                attribute["type"] = "entity"
                process_related_entity(attribute)
            elif ("is_new" in attribute and attribute["is_new"] == True) or attribute["type"] == "entity":
                attribute["type"] = "entity"
                attribute.pop("is_new", None)
                entity_data = deepcopy(attribute)
                remove_unwanted_keys(attribute, "domain_object")
                remove_unwanted_keys(entity_data, "entity")
                if entity_data["entity_name"] not in entity_list_dict["keys"]:
                    entity_list_dict["entities"].append(entity_data)
                    entity_list_dict["keys"].append(entity_data["entity_name"])
                if "attributes" in entity_data.keys():
                    process_attributes(entity_data["attributes"], entity_list_dict)

        remove_none_fields(attribute)
    return attributes, entity_list_dict


def remove_unwanted_keys(attribute, type):
    domain_keys = ["key_name", "synonym", "type", "rule_id", "entity_relation", "id"]
    entity_keys = ["entity_name", "entity_synonym", "entity_type", "primary_key", "attributes", "occurrences", "id",
                   "solution_id", "rule_id", "ontology_config"]
    attribute = remove_none_fields(attribute)

    if type == "domain_object":
        del_keys = entity_keys
        if "entity_name" in attribute.keys():
            attribute["key_name"] = attribute["entity_name"]
        if "entity_relation" not in attribute.keys():
            attribute["entity_relation"] = dict(name=attribute["key_name"], cardinality="1")
        if "type" not in attribute.keys():
            attribute["type"] = attribute["entity_type"]
        if "synonym" not in attribute.keys():
            attribute["synonym"] = attribute["entity_synonym"]
    else:
        del_keys = domain_keys
        if "entity_name" not in attribute and "key_name" in attribute:
            attribute["entity_name"] = attribute["key_name"]
        if "entity_type" not in attribute and "type" in attribute:
            attribute["entity_type"] = attribute["type"]
        if "entity_synonym" not in attribute and "synonym" in attribute:
            attribute["entity_synonym"] = attribute["synonym"]
        if "attributes" not in attribute:
            attribute["attributes"] = []

    for key in del_keys:
        if key in attribute.keys():
            attribute.pop(key)
    return attribute


def remove_none_fields(data):
    none_fields = ["occurrences", "ts"]
    for field in none_fields:
        if field in data.keys() and data[field] is None:
            data.pop(field)
    return data


def process_related_entity(attribute):
    if "entity_relation" not in attribute:
        entity_relation = dict(name=attribute["key_name"], cardinality="1")
        attribute["entity_relation"] = entity_relation
    attribute.pop("rule_id", None)
    attribute.pop("is_new", None)


def process_all_domains(final_domain_object):
    domain_map_dict = dict()
    for domain in final_domain_object:
        add_key_path(domain, domain_map_dict, "")
    return domain_map_dict


def add_key_path(domain, domain_map_dict, key_name=""):
    name = ""
    if "key_name" in domain:
        name = domain["key_name"]
    elif "entity_name" in domain:
        name = domain["entity_name"]

    if key_name == "":
        key_name = name
    else:
        key_name = key_name + "." + name

    # domain_map_dict[key_name] = []
    if "attributes" in domain.keys():
        for index, attribute in enumerate(domain["attributes"]):
            if "entity_relation" in attribute.keys() and "name" in attribute["entity_relation"].keys():
                add_key_path(attribute, domain_map_dict, key_name)
            else:
                if key_name in domain_map_dict.keys():
                    domain_map_dict[key_name].append(attribute["key_name"])
                else:
                    domain_map_dict[key_name] = [attribute["key_name"]]
    return domain_map_dict


def check_entity_used_elsewhere(domain_name, entity_name, solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        query = {"attributes": {"$elemMatch": {"key_name": entity_name, "type": "entity"}},
                 "entity_name": {"$ne": domain_name}
            , "solution_id": solution_id}
        entities_count = MongoDbConn.count(ENTITY_COLLECTION, query)
        return True if entities_count > 0 else False
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return True
    finally:
        context.end_span()


def get_attributes_thresholds(request, template_id):
    '''
    :param request: get request from the ui end with solution_id
    :param template_id: template_id
    :return:list of all mapping thresholds
    '''
    solution_id = get_solution_from_session(request)
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    solution_id = get_solution_from_session(request)
    try:
        if template_id:
            query = {"solution_id": solution_id, "template_id": template_id}
            template = MongoDbConn.find_one(TEMPLATE_COLLECTION, query)
            if template["template_type"] not in UNKNOWN_TYPES:
                map_list = mapping_list_of_thresholds(query)
            elif template["template_type"] in UNKNOWN_TYPES:
                map_list = mapping_list_of_thresholds(query)
                try:
                    config = ENTITY_CONFIG["default"]
                    all_domain_mappings = entity_get(solution_id,config, "domainmapping")
                    map_list = threshold_mapping_list(all_domain_mappings, map_list)
                except Exception as e:
                    return str(e)
            return {"status": "success", "msg": "objects formed  Successfully", "data": map_list}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failed", "msg": "error in getting objects", "error": str(e)}
    finally:
        context.end_span()


def mapping_list_of_thresholds(mapping_query, map_list=[]):
    mapping = MongoDbConn.find_one(MAPPING_COLLECTION, mapping_query)
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        if mapping:
            section_data = mapping["sections"]
            for section_id, data in section_data.items():
                if "map_to" in data and not data["is_deleted"]:
                    map_list.append(data['map_to'][0]) if type(data['map_to']) == list and len(data['map_to']) == 1 \
                        else map_list.append(data['map_to'])
                if "elements" in data:
                    element_data = data["elements"]
                    for element_id, element_data in element_data.items():
                        if "map_to" in element_data and not element_data["is_deleted"]:
                            for each in element_data["map_to"]:
                                map_list.append(each['map_to'])
        return map_list
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failed", "msg": "error in getting objects", "error": str(e)}
    finally:
        context.end_span()



def threshold_mapping_list(all_domainmappings, threshold_list):
    """
    :param all_domainmapping_entites: all domain_object entites
    :param threshold_list: list of thresholeds avalible for template
    :return: list of all dominemapping entities for threshold entities
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        domain_mapping_list = []
        var = [each.split('.')[0] if "." in each else each for each in threshold_list]
        threshold_list = list(set(var))
        for threshold in threshold_list:
            if threshold in all_domainmappings.keys():
                for construct in all_domainmappings[threshold]:
                    domain_mapping_list.append(threshold+"."+construct)
        return domain_mapping_list
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return str(e)
    finally:
        context.end_span()


def get_count(request,count={}):
    """
    :param request: get request
    :param count: creating empty dictionery for returning counts
    :return: count of known and unknown format counts
    """
    solution_id = common.get_solution_from_session(request)
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        query = dict(solution_id=solution_id, is_deleted=False)
        templates = MongoDbConn.find(TEMPLATE_COLLECTION, query)
        templates = [json.loads(a["template"]) for a in templates]
        count["known_format_count"] = len([a for a in templates if a["template_type"] == "known"])
        count["unknown_format_count"] = len([a for a in templates if a["template_type"] in UNKNOWN_TYPES])
        try:
            config = config_from_endpoint(ENTITY_CONFIG, "")
            test = entity_get(solution_id, config, "")
            count["domain_objects"] = len(test["domain_object"])
            return {"status": "success", "msg": "recived count Successfully", "data": count}
        except Exception as e:
            return {"status": "failed", "msg": "error in getting domain object count", "error": str(e)}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failed", "msg": "error in getting count", "error": str(e)}
    finally:
        context.end_span()
