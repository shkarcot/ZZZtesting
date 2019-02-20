import traceback
from uuid import uuid4
from xpms_common import trace
from config_vars import CLAIMS_COLLECTION, CLAIMS_FIELDS_COLLECTION, DASHBOARD_CONFIG, FEEDBACK_COLLECTION, \
    FORMS_COLLECTION, SOLUTION_ID, NLP_CONFIG, SERVICE_NAME
from connections.mongodb import MongoDbConn
from services.dashboard import get_value, data_response, get_score, conv_timestamp, get_flow_id
from utilities import common
from bson import ObjectId
from ast import literal_eval
from copy import deepcopy
from random import randint
from utilities import http


tracer = trace.Tracer.get_instance(SERVICE_NAME)

def get_coordinates(field, cord_dict):
    if field in cord_dict.keys():
        return cord_dict[field]["coordinates"]


def get_review_data(solution_id, file_id, status, doc_type, direction, query_string):
    query = get_flow_id(file_id=file_id, status=status, doc_type=doc_type, direction=direction,
                        query_string=query_string)
    # query = {"flow_file_id": file_id}
    rows = MongoDbConn.find_one(DASHBOARD_CONFIG, query={"table": "DocumentReviewDetails"})
    record = dict()
    record.update(query)
    del query["disable_prev"]
    del query["disable_next"]
    query["solution_id"] = solution_id
    atts = list()
    for field in rows['config']:
        if field['level'] == 0:
            record = add_url_recid(field, query, record)
        else:
            if atts == list():
                atts = set_attributes(field, query)
            else:
                atts = update_attributes(atts, set_attributes(field, query))
        if field['key'] == "Document Confidence" and record[field['key']] is not None:
            record[field['key']] = str(round(get_score(field, record[field['key']]), 2)) + "%"
        if field['key'] == "Processed" and record[field['key']] is not None:
            record[field['key']] = str(conv_timestamp(record[field['key']]))
    record['attributes'] = add_intent(add_nlp_flag_to_atts(atts, query), query)
    return record


def add_url_recid(field, query, record):
    result = MongoDbConn.find_one(field['collection'], query)
    if result is not None:
        if field['type'] == "string":
            record[field['key']] = str(get_value(field['value'], result))
        elif field['type'] == "url":
            record[field['key']] = str(get_value(field['value'], result))

    return record


def set_attributes(field, query):
    result = MongoDbConn.find(field['collection'], query)
    recs = list()
    for rec in result:
        temp = dict()
        temp[field['key']] = get_review_value(field, rec, query)
        recs.append(temp)
    return recs


def update_attributes(attributes, updates):
    if len(updates) == len(attributes):
        ret_list = list()
        for i, k in zip(attributes, updates):
            i.update(k)
            ret_list.append(i)
        return ret_list
    else:
        return attributes


def post_review_data(payload, flow_file_id):
    resp = dict()
    resp['status'] = "failure"
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        # Inserting payload in feedback
        for record in payload:
            if "rec_id" in record.keys():
                MongoDbConn.update(CLAIMS_COLLECTION, where_clause={"_id": ObjectId(str(record['rec_id']))},
                                   query={"status": "reviewed"})
            if "is_update" in record.keys() or "is_accept" in record.keys():
                if record['is_update'] or record['is_accept']:
                    record_id = record['id']
                    record.pop("id")
                    MongoDbConn.update(CLAIMS_FIELDS_COLLECTION, where_clause={"_id": ObjectId(record_id)},
                                       query={"reviewed": record})
                    if record['is_update']:
                        record['flow_file_id'] = flow_file_id
                        record['is_processed'] = False
                        record_ins = deepcopy(record)
                        [record_ins.pop(key) for key in ["is_update", "is_accept", "is_nlp_enabled"]]
                        MongoDbConn.update(FEEDBACK_COLLECTION, where_clause={"_id": ObjectId(record_id)},
                                           query=record_ins)
                        if "is_nlp_enabled" in record.keys() and record["is_nlp_enabled"]:
                            data = {"solution_id": SOLUTION_ID, "data": {"text": record["value"]}}
                            result = http.post_job(NLP_CONFIG['EXTRACT_INTENT'], data)
                            if 'job_id' in result:
                                resp['status'] = result["job_id"]
                            if result is not None:
                                result_data = http.get_nested_value(result, "result.result.metadata")
                                MongoDbConn.update(CLAIMS_FIELDS_COLLECTION, {"_id": ObjectId(record_id)},
                                                   {"intent": result_data})

        resp['status'] = "success"
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        resp['status'] = "failure"
    context.end_span()
    return resp


def get_review_value(field, rec, query):
    if "review_value" in field.keys() and get_value(field['review_value'], rec) is not None:
        if field['type'] == 'bool':
            return literal_eval(get_value(field['review_value'], rec))
        else:
            return get_value(field['review_value'], rec)
    elif field['type'] == 'string':
        return get_value(field['value'], rec)
    elif field['type'] == 'bool':
        return field['value']
    elif field['type'] == "list" and "list_collection" in field.keys():
        coord_list = MongoDbConn.find_one(field['list_collection'], query)[field['key']]
        return get_coordinates(rec[field['value']], coord_list)


def generate_review_list(solution_id, status, doc_type, query_string=""):
    query = {"table": "DocumentReviewList"}
    if status == 'processed':
        data = {"$or": [{"status": {"$regex": 'processed', '$options': 'i'}}], "doc_type": {"$ne": "Email"}}
    else:
        data = {"$or": [{"status": {"$regex": 'processed', '$options': 'i'}}, {"status": 'reviewed'}], "doc_type": {"$ne": "Email"}}
    if doc_type != "all":
        data["doc_type"] = doc_type
    if query_string != "":
        data["file_name"] = {"$regex": query_string, '$options': 'i'}
    data["solution_id"] = solution_id
    return data_response(query, data)


def add_nlp_flag_to_atts(atts, query):
    record = MongoDbConn.find_one(CLAIMS_COLLECTION, query)
    if record is not None and "doc_type" in record.keys():
        form_type = record["doc_type"]
    else:
        form_type = None

    result = MongoDbConn.find_one(FORMS_COLLECTION, {"form_type": form_type})
    if form_type is not None and result is not None and "configuration" in result.keys():
        config = result["configuration"]
        for itm in atts:
            itm["is_nlp_enabled"] = False
            for key in config.keys():
                upd_key = " ".join([i.strip() for i in str(key).split("_") if i != "_"]).strip().title()
                if "key" in itm.keys() and itm["key"] == upd_key:
                    if "is_extract_intent" in config[key].keys() and config[key]["is_extract_intent"]:
                        itm["is_nlp_enabled"] = True

    return atts


def add_intent(atts, query):
    records = MongoDbConn.find(CLAIMS_FIELDS_COLLECTION, query)
    if records is not None:
        for rec in records:
            upd_key = " ".join([i.strip() for i in str(rec["name"]).split("_") if i != "_"]).strip().title()
            for att in atts:
                if "key" in att.keys() and att["key"] == upd_key and "intent" in rec.keys():
                    att["intent"] = intent_json(rec["intent"])
    return atts


def intent_json(data):
    resp = {"status": "success"}
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = data["result"]
        atts = list()
        added = list()
        for i in data["actions"]:
            if "entities" in i.keys() and isinstance(i["entities"], list):
                for j in i["entities"]:
                    if j["entity_key"] not in added:
                        atts.append({"entity_key": j["entity_key"],
                                     "platform_action": underscore_ops(i["platform_action"]),
                                     "action_confidence": i["action_confidence"], 'entity_values': return_entity_values(j)})
                        added.append(j["entity_key"])

                    else:
                        for k in atts:
                            if k["entity_key"] == j["entity_key"] and "entity_values" in k.keys():
                                k["entity_values"] = k["entity_values"] + return_entity_values(j)
        entities = list()
        for a in data["action_summary"]:
            a["action_confidence"] = randint(50, 99)
            a["platform_action"] = underscore_ops(a["platform_action"])
            a["attributes"] = [b for b in atts if str(b['entity_key']).split(".", 1)[0] == a["entity_key"]]
            entities.append(a)
        resp.update({"msg": "Intent Data", "data": entities})
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        resp.update({"status": "failure", "msg": str(e), "data": data})
    context.end_span()
    return resp


def return_entity_values(j):
    if "qualifier" in j.keys() and isinstance(j["qualifier"], dict):
        qualifier = list(j["qualifier"].keys())[0]
        return [{"entity_value": j["entity_value"], "qualifier": qualifier}]
    else:
        return [{"entity_value": j["entity_value"]}]


def underscore_ops(text):
    return str(text).split("_", 1)[0]


def get_intent(doc_id):
    result = MongoDbConn.find_one(CLAIMS_FIELDS_COLLECTION, {"_id": ObjectId(doc_id)})
    if result is not None and "intent" in result.keys():
        return intent_json(result["intent"])
