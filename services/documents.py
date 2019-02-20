from uuid import uuid4
from config_vars import DOCUMENTS_COLLECTION, TEMPLATE_COLLECTION, MOUNT_PATH, DOCUMENT_ENDPOINT,\
    DOC_ELEMENTS_COLLECTION, API_GATEWAY_POST_JOB_URI, MAPPING_COLLECTION, UNKNOWN_TYPES, \
    REVIEW_ENDPOINT, SERVICE_NAME, PIPELINE
from connections.mongodb import MongoDbConn
from services.service_catalog import summary_config, get_enrichments, construct_nlp
from services.document_templates import get_domain_mapping, format_enriched_data, \
    get_all_rules_processed, get_rules_info, get_coordinates_list, list_of_dict
from utilities import common
from utilities.common import construct_json, get_solution_from_session, get_pagination_details, download_file, tracer
from utilities.http import post_job, is_request_timeout, get_response, post
from services.feedback import feedback as post_feedback
import json
from collections import OrderedDict
from xpms_common import trace
from datetime import datetime
from services.dashboard import update_case_status
import traceback
from copy import deepcopy

DOCUMENT_SUMMARY_FIELDS = ["metadata.file_name", "updated_ts", "metadata.extn", "doc_id",
                           "template_name", "root_id", "child_documents", "template_id", "doc_state",
                           "confidence_score",
                           "error", "classification_score"]
DOCUMENT_DETAIL_FIELDS = ["metadata.file_name", "metadata.extn", "metadata.searchable_pdf", "doc_id", "pages",
                          "no_of_pages", "template_name", "updated_ts", "entity", "template_id", "child_documents",
                          "doc_attributes", "confidence_score", "entity_feedback", "solution_id"]
REVIEW_STATES = {"Classification Review": {"active": False, "doc_state": "classified"},
                 "Extraction Review": {"active": False, "doc_state": "extracted"},
                 "Annotation Review": {"active": False, "doc_state": "processed"}}

DOCUMENT_DOMAIN_OBJECT_ENDPOINT = "document/domainObjects"
tracer = trace.Tracer.get_instance(SERVICE_NAME)


def apply_filters(filter_obj, filter_query):
    skip_filters = ['child_documents', 'sort_by', 'order_by', 'page_no', 'no_of_recs', "doc_id", "search_string"]
    search_keys = {"metadata.file_name": "regex", "template_name": "regex", "doc_id": "equal", "root_id": "equal",
                   "mirror_id": "equal", "metadata.extn": "equal"}
    if filter_obj and 'child_documents' in filter_obj and "doc_id" in filter_obj:
        filter_query['root_id'] = filter_obj['doc_id']
        filter_query['is_root'] = False

    if "search_string" in filter_obj:
        search_list = []
        search_string = filter_obj["search_string"]
        regex_dict = {'$regex': search_string, '$options': 'i'}
        for k, v in search_keys.items():
            query_dict = {}
            if v == "regex":
                query_dict = {k: regex_dict}
            elif v == "equal":
                query_dict = {k: search_string}
            search_list.append(query_dict)
        filter_query["$or"] = search_list
    for key, value in filter_obj.items():
        if key not in skip_filters:
            filter_query[key] = value

    if "doc_state" in filter_query:
        if filter_query["doc_state"] == "processed":
            filter_query["$or"] = [{"doc_state": "processed", "entity_reviewed": True}, {"doc_state": "failed"}]
            filter_query.pop("doc_state")
        elif filter_query["doc_state"] in ["entity_linked"]:
            filter_query["doc_state"] = "processed"
            filter_query["entity_reviewed"] = {"$exists": False}


def find_documents(request, collection, query, solution_id, projection_fields=None):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        cursor = MongoDbConn.find(collection, query, projection=projection_fields)
        sort_by, order_by_asc, skip, limit = get_pagination_details(request, sort_by='updated_ts', order_by_asc=-1,
                                                                    skip=0, limit=0)
        documents_list = cursor.sort(sort_by, order_by_asc).skip(skip).limit(limit)

        documents = []
        for document in documents_list:
            document.pop("_id", None)
            document = construct_json(document, DOCUMENT_SUMMARY_FIELDS)
            doc_type = get_doc_type(document['extn'])
            if doc_type == "image":
                document["is_digital"] = False
            else:
                document["is_digital"] = True
            if "confidence_score" not in document:
                document["confidence_score"] = get_confidence_score(document, solution_id, document["is_digital"])
                document["is_failed"] = True if document["doc_state"] == "failed" else False
                document["review_text"] = get_review_text(document["doc_state"], document)
                documents.append(document)
        return documents
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def process_entity_feedback(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        request_data = json.loads(request.body.decode())
        if request_data["feedback"]:
            request_data["request_type"] = "extract_entities"
            feedback_status = post_feedback(request_data, solution_id)
            if feedback_status['status'] == 'success' and "feedback" in request.get_full_path():
                return update_queue_extracted_feedback(None, request_data["doc_id"], "processed")
            else:
                return feedback_status
        else:
            return {"status": "success", "msg": "No changes to be saved"}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Internal error occured in processing Feedback", "error": str(e)}
    finally:
        context.end_span()


def get_review_text(doc_state, document):
    review_text_map = {"processed": "START REVIEW", "classified": "CLASSIFY", "reviewed": "REVIEW"}
    if doc_state == "failed" and "error" in document and "desc" in document["error"]:
        return document["error"]["desc"]
    else:
        return review_text_map[doc_state] if doc_state in review_text_map else ""


def get_confidence_score(document, is_digital):
    if is_digital:
        return 100
    elements = document["elements"]
    score, count = get_elements_score(elements, 0, 0)
    avg_score = score/max(count, 1)
    return avg_score


def get_elements_score(elements, score, count):
    for element in elements:
        score = score + element["confidence"]
        count += 1
        if "children" in element and element["children"]:
            score, count = get_elements_score(element["children"], score, count)
    return score, count


''':param doc_id: unique identity number of document
    :param solution_id: solution_id
    :return: confidence score of document'''


def get_doc_confidence_score(document, doc_type):
    try:
        if doc_type == "image":
            return get_confidence_score(document, False)
        else:
            return 100
    except Exception as e:
        return {'error': str(e)}


def documents_data(solution_id, filter_obj=None):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        filter_query = {"solution_id": solution_id, "is_root": True,
                        "$or": [{"is_test": False}, {"is_test": {"$exists": False}}]}
        projection_fields = dict()
        for field in DOCUMENT_SUMMARY_FIELDS:
            projection_fields[field] = 1
        apply_filters(filter_obj, filter_query)
        documents = find_documents(filter_obj, DOCUMENTS_COLLECTION, filter_query, solution_id,
                                   projection_fields=projection_fields)
        documents_total_count = MongoDbConn.count(DOCUMENTS_COLLECTION, filter_query)
        resp = {'config': summary_config, 'data': documents, 'total_count': documents_total_count}
        return {"status": "success", "msg": "documents data", "data": resp}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e), "data": {}}
    finally:
        context.end_span()


def document_data(doc_id, solution_id, entity_reqd=True, rules_reqd=True):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        filter_query = {"doc_id": doc_id}
        projection = {"metadata": 1, "doc_id": 1, "confidence_score": 1, "elements": 1, "doc_state": 1, "root_id": 1,
                      "entity": 1, "_id": 0}
        document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, filter_query, projection=projection)
        doc_type = get_doc_type(document["metadata"]["properties"]['extension'])
        overall_doc_score = get_doc_confidence_score(document, doc_type)
        document['document_confidence_score'] = overall_doc_score
        template_id = document["metadata"]["template_info"]["id"]
        template_type = get_template_type(template_id, solution_id)
        document["doc_type"] = doc_type
        if doc_type == "email":
            document["attachments"] = add_email_info(document)
        # elif doc_type == "excel":
        #     for page in document["pages"]:
        #         page["doc_html"] = get_html_data(page)
        document["template_type"] = template_type
        if "metadata" in document:
            if "searchable_pdf" in document["metadata"].keys():
                document["searchable_pdf"] = document["metadata"]["searchable_pdf"]
        if "entity" in document and entity_reqd:
            entity_data_orgnl = json.loads(document["entity"])
            enrich_data = list(get_enrichments(entity_data_orgnl, "enrichments"))
            filter_query["is_deleted"] = False
            elements = get_all_elements(document["elements"], [])
            review_data = dict(attributes_extracted=0, review_required=0, confidence=0)
            review_data["entity_feedback"] = document["entity_feedback"] if "entity_feedback" in document else []
            document["entity"] = format_entity_data(document["entity"], elements,
                                                    review_data, enrich_data, rules_reqd)
            document['document_confidence_score'] = review_data["confidence"]
            document["attributes_extracted"] = review_data["attributes_extracted"]
            if rules_reqd:
                document["review_required"] = 0
            else:
                document["review_required"] = review_data["review_required"]
            document = remove_items(document, ["entity_feedback"])
            document["elements"] = elements
        else:
            document.pop("entity", None)
        review_state = get_review_state(entity_reqd, rules_reqd, doc_type, template_type)
        data = {"data": document, "volume": MOUNT_PATH, "review_state": review_state}
        return {"status": "success", "msg": "document data", "data": data}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e), "data": {}}
    finally:
        context.end_span()


def get_review_state(entity_reqd, rules_reqd, doc_type, template_type):
    review_state = deepcopy(REVIEW_STATES)
    if doc_type == "image":
        for state, value in review_state.items():
            if entity_reqd and rules_reqd:
                value["active"] = True
            elif entity_reqd:
                if state == "Extraction Review":
                    value["active"] = True
                if state == "Classification Review":
                    value["active"] = True
            else:
                if state == "Classification Review":
                    value["active"] = True
            if template_type == "known" and "Annotation Review" in review_state.keys():
                review_state["Annotation Review"]["active"] = False
    return review_state


def get_all_elements(elements, element_list=[]):
    for element in elements:
        if "children" in element and element["children"]:
            get_all_elements(element["children"], element_list)
        else:
            element_list.append(element)
    return element_list


def fetch_sections_data(request, doc_id):
    """
    :param request:
    :param doc_id: for which we need to fetch sections
    :return: Response in Json format which consists the all sections
     data for the given doc_id
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if doc_id != "":
            solution_id = common.get_solution_from_session(request)
            document_info = document_data(doc_id, solution_id, False)
            data = document_info["data"]["data"]
            review_state = document_info["data"]["review_state"]
            counts = {"extracted": 0, "reviewed": 0}
            data["elements"] = process_elements(data["elements"], counts)
            data['need_review_count'] = counts["reviewed"]
            data['attributes_extracted'] = counts["extracted"]
            return {"status": "success",
                    "data": data,
                    "volume": MOUNT_PATH,
                    "review_state": review_state,
                    "msg": "successfully returned document sections data"}
        else:
            return {"status": "failure",
                    "msg": "Failed to return document sections data"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure',
                'msg': 'Internal error while submitting section data',
                'error': str(e)}
    finally:
        context.end_span()


def process_elements(elements,counts,temp_id=None,section_ele=None):
    for element in elements:
        counts["extracted"] += 1
        if not temp_id:
            element["temp_id"] = element["id"]
        else:
            element["temp_id"] = temp_id + "_" + element["id"]
        if element["node_type"] == "section":
            if "children" in element and element["children"]:
                process_elements(element["children"],counts,element["temp_id"],element)
        elif element["node_type"] == "heading":
            if section_ele:
                section_ele["name"] = element["text"]
        elif element["node_type"] == "table":
            element["cells_reconstructed"], element['headings_reconstructed'] = \
                construct_table_data_new(element["cells"], element["headers"],element["temp_id"], counts)
        else:
            if "children" in element and element["children"]:
                process_elements(element["children"], counts, element["temp_id"], None)
        # elif element["type"] == "list":
        #     if "parameters" in element and "list_elements" in element["parameters"]:
        #         for index, ele in enumerate(element["parameters"]["list_elements"]):
        #             ele["temp_id"] = element["temp_id"] + "_" + str(index)
    return elements


def reprocess_feedback(feedbacks):
    for feedback in feedbacks:
        if "reformat" in feedback:
            if feedback["reformat"] == "table":
                table = feedback["data"]
                table["cells"], table["headers"] = reformat_columns(table["cells_reconstructed"],
                                                                          table["headings_reconstructed"],
                                                                          table["headers"])
                table["node_type"] = "table"
                remove_items(table,["cells_reconstructed","headers_reconstructed","headings_reconstructed"])
            feedback.pop("reformat")
        if "children" in feedback:
            reprocess_feedback(feedback["children"])
    return feedbacks


def reformat_columns(rows, headers,headers_old):
    cells = []
    for row in rows:
        for col_no, value in row.items():
            value["column_index"] = [value.pop("col_no")]
            value["row_index"] = [value.pop("row_no") + 1]
            if "node_type" not in value:
                value["node_type"] = "table_cell"
                if "id" in value:
                    value.pop("id")
            remove_items(value,["need_review","original_text","temp_id","coordinates_copy","col_name"])
            cells.append(value)
    for index,header in enumerate(headers):
        if index < len(headers_old):
            header_data = headers_old[index]
            header_data["text"] = " ".join(header)
            header_data["column_index"] = [index]
        else:
            header_data = dict(text=" ".join(header),column_index=[index],row_index=[0],regions=[],node_type="table_header")
            headers_old.append(header_data)
    return cells, headers_old



''':param solution_id
    :param doc_id: for which section data is required
    :param section_id: for which we need to fetch elements data
    :param need_review_count: to count all elements for which
    feedback is not present
    :param extracted_count: To get total number of elements in the document
    :return: returned a dictionary consists the elements grouped according
    to the section_id, updated need_review_count and updated extracted_count
    '''
def fetch_elements_data(solution_id, doc_id, section_id, need_review_count, extracted_count, template_data):
    query = {"doc_id": doc_id, "section_id": section_id, "solution_id": solution_id, "is_deleted": False}

    projection = {"element_id": 1, "label": 1, "name": 1, "page_no": 1, "list_elements": 1,
                  "score": 1, "section_id": 1, "solution_id": 1, "text": 1,
                  "type": 1, "label_coordinates": 1, "headings": 1, "columns": 1,
                  "value_coordinates": 1, "_id": 0, 'groups': 1, "label_coordinates_list": 1,
                  'insight_id': 1, 'slice_path': 1, 'feedback': 1, "value_coordinates_list": 1}
    section_elements = MongoDbConn.find(DOC_ELEMENTS_COLLECTION,
                                        query, projection=projection)

    elements = []
    heading = 'section'

    extraction_score = 100
    if template_data and "thresholds" in template_data:
        try:
            extraction_score = template_data['thresholds']['annotation']['entity_confidence_score']
        except Exception as e:
            extraction_score = 100

    for ele in section_elements:
        extracted_count += 1
        ele['is_corrected'] = False
        ele['is_accept'] = False
        ele['need_review'] = True
        ele['extracted_text'] = ''
        feedback_dict = dict()
        if 'score' not in ele:
            ele['score'] = 100

        if ele['score'] > extraction_score:
            ele['need_review'] = False
            ele['is_accept'] = True

        if 'text' in ele:
            ele['extracted_text'] = ele['text']
        if 'feedback' in ele and len(ele['feedback']) > 0:
            feedback_list = ele['feedback']
            latest_feedback = feedback_list[-1]
            if 'feedback_type' in latest_feedback and \
                    latest_feedback['feedback_type'] == 'delete':
                extracted_count -= 1
                continue
            ele['need_review'] = False
            if 'text' in latest_feedback or 'groups' in latest_feedback:
                if 'text' in latest_feedback:
                    latest_feedback_text = latest_feedback['text']
                    ele['text'] = latest_feedback_text
                if 'feedback_type' in latest_feedback:
                    if latest_feedback['feedback_type'] == 'edit':
                        ele['is_corrected'] = True
                    elif latest_feedback['feedback_type'] == 'accept':
                        ele['is_accept'] = True
            for feedback in feedback_list:
                if 'insight_id' in feedback:
                    if 'text' in feedback:
                        feedback_dict[feedback['insight_id']] = feedback['text']
                    else:
                        feedback_dict[feedback['insight_id']] = ''

        if ele['need_review']:
            need_review_count += 1
        ele = get_coordinates_list(ele, "value_coordinates", "value_coordinates_list")
        ele = get_coordinates_list(ele, "label_coordinates", "label_coordinates_list")
        temp_id = section_id + '_' + ele['element_id']
        ele['temp_id'] = temp_id

        if ele["type"] == "table":
            table = dict()
            if "columns" in ele:
                if "headings" not in ele:
                    ele["headings"] = None
                table["table"], table["headings"], avg_score, table["column_no_list"] = \
                    construct_table_data_new(ele["columns"], feedback_dict, temp_id)
                ele = remove_items(ele, ["headings", "columns"])
            ele["tables"] = table
            ele['score'] = avg_score

            if ele['score'] > extraction_score:
                ele['need_review'] = False
                ele['is_accept'] = True
        if ele["type"] == "list" and "list_elements" in ele:
            ele["list_elements"] = [construct_json(item, ["text", "value_coordinates_list", "label_coordinates_list"])
                                    for item in ele["list_elements"]]
        elements.append(ele)

        if ele['type'] == 'heading':
            heading = ele['text']

    return elements, need_review_count, extracted_count, heading


def get_document_details(request, doc_id, page_no):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        query = {"doc_id": doc_id, "page_no": int(page_no)}
        projection = {"solution_id": 0, "updated_ts": 0, "created_ts": 0, "_id": 0, "doc_id": 0}
        elements = MongoDbConn.find(DOC_ELEMENTS_COLLECTION, query, projection=projection)
        document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, {"doc_id": doc_id}, projection={"doc_id": 1, "entity": 1})
        processed_rules = {}
        if "entity" in document:
            processed_rules = get_all_rules_processed(document["entity"])

        mapping_data = get_doc_mapping_from_template(doc_id, solution_id)
        element_list = []
        for element in elements:
            domain_mapping = get_domain_mapping(mapping_data, element_id=element["element_id"],
                                                section_id=element["section_id"])
            if element["type"] == "table":
                table = dict()
                if "headings" and "columns" in element:
                    table["table"], table["headings"] = construct_table_data(element["headings"], element["columns"],
                                                                             domain_mapping)
                    element["tables"] = table
                    element = remove_items(element, ["headings", "columns"])
            else:
                element["domain_mapping"] = ""
                if domain_mapping and isinstance(domain_mapping, dict) and "domain_mapping" in domain_mapping:
                    element["domain_mapping"] = domain_mapping["domain_mapping"]
                    if processed_rules:
                        element["rules"] = get_rules_info(element["domain_mapping"], processed_rules, solution_id,
                                                          element["text"])
            if "score" not in element:
                element["score"] = 0
            element_list.append(element)
        data = {"elements": element_list, "entity": {}}
        return {"status": "success", "data": data}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Error occured while processing", "error": str(e)}
    finally:
        context.end_span()


def construct_table_data(headings, columns, domain_mapping):
    headings_list = []
    column_name = "column"
    for heading in headings:
        if "final_column" in heading:
            headings_list.append(heading["final_column"])
            column_name = "final_column"
        if "column" in heading:
            headings_list.append(heading["column"])
    column_list = []

    if isinstance(domain_mapping, dict) and "data" in domain_mapping:
        domain_list = domain_mapping["data"]

    line_dict = {}
    for column in columns:
        col_name = column["name"]
        if col_name == "subheaders":
            continue
        domain_mapped = ""
        context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
        context.start_span(component=__name__)
        try:
            [col_heading_idx] = [idx for idx, value in enumerate(headings) if
                                 "".join(value[column_name]) == col_name]
            if "map_to" in domain_list[col_heading_idx]:
                domain_mapped = domain_list[col_heading_idx]["map_to"]
        # TODO raise specific exception
        except Exception as e:
            context.log(message=str(e), obj={"tb": traceback.format_exc()})
        context.end_span()
        for val in column["value"]:
            line_num = val["line"]
            value = construct_json(val, ["text", "score", "value_coordinates"])
            value["domain_mapping"] = domain_mapped
            if "score" not in value:
                value["score"] = 100
            row_dict = {col_name: value}
            if line_num not in line_dict:
                line_dict[line_num] = row_dict
            else:
                line_dict[line_num].update(row_dict)

    ordered_dict = OrderedDict(sorted(line_dict.items(), key=lambda x: int(x[0])))
    for line_num, value in ordered_dict.items():
        column_list.append(value)
    return column_list, headings_list


def construct_table_data_new(cells,headings, temp_id, counts):
    headings_list = [[header["text"]] for header in headings]
    if "insight_id" in cells:
        cells.pop("insight_id", None)
    column_list = []
    col_line_list = []
    line_num_list, line_dict = get_all_line_nos(cells)
    for cell in cells:
        counts["extracted"] += 1
        for row_index, row_no in enumerate(cell["row_index"]):
            for col_index, col_no in enumerate(cell["column_index"]):
                if row_index > 0 or col_index > 0:
                    cell["text"] = ""
                cell["temp_id"] = temp_id + "_" + str(col_no) + "_" + str(row_no)
                row_dict = {col_no: cell}
                col_line_list.append(col_no)
            line_dict[row_no].update(row_dict)
    #line_dict = default_unextracted_lines(line_num_list, col_line_list, line_dict, col_no)
    ordered_dict = OrderedDict(sorted(line_dict.items(), key=lambda x: int(x[0])))
    for line_num, value in ordered_dict.items():
        column_list.append(value)
    return column_list, headings_list


def get_all_line_nos(cells):
    line_list = []
    for cell in cells:
        for index in cell["row_index"]:
            line_list.append(index)
    all_lines = list(set(line_list))
    line_dict = {}
    for line in all_lines:
        line_dict[line] = {}
    return all_lines, line_dict


def default_unextracted_lines(all_lines, col_lines, line_dict, col_no):
    for line in all_lines:
        if line not in col_lines:
            row = {col_no: {"text": "", "confidence": 0, "row_no": line, "col_no": col_no,
                            "value_coordinates_list": []}}
            line_dict[line].update(row)
    return line_dict


def get_doc_type(extn):
    mime_type = extn.lower()
    if mime_type in [".csv", ".excel-xlsx", ".excel-xls", ".xlsx", ".xls", ".excel"]:
        doc_type = "excel"
    elif mime_type == ".email":
        doc_type = "email"
    else:
        doc_type = "image"
    return doc_type


def add_email_info(data):
    attachments = []
    for doc_id in data["child_documents"]:
        filter_query = {"doc_id": doc_id}
        document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, filter_query)
        if document is not None:
            attach_data = dict()
            attach_data["doc_id"] = doc_id
            attach_data["mime_type"] = document["metadata"]["extn"]
            attach_data["file_name"] = document["metadata"]["file_name"]
            attachments.append(attach_data)
    return attachments


def process_entity_structured(raw_entity, enrich_data={}, rules_reqd=True, review_data={}):
    if isinstance(raw_entity, list):
        enriched_data = raw_entity[0]
    else:
        if "raw_entity" in raw_entity:
            enriched_data = raw_entity["raw_entity"]
        else:
            enriched_data = raw_entity
    domain_object = []
    if "data" in enriched_data and isinstance(enriched_data["data"], dict):
        parent_entity_id = enriched_data["entity_id"] if "entity_id" in enriched_data else ""
        for key, value in enriched_data["data"].items():
            if key in ["insight_id", "enrichments"]:
                continue
            if isinstance(value, dict):
                value = [value]
            for value_dict in value:
                entity_id = value_dict["entity_id"] if "entity_id" in value_dict else ""
                domain_data = populate_fields(key, "domain", key, entity_id=entity_id,
                                              parent_entity_id=parent_entity_id,
                                              cardinality="1", entity_key=key)
                domain_data["attributes"] = []
                solution_id = value_dict["solution_id"]
                if "data" in value_dict:
                    if isinstance(value_dict["data"], dict):
                        rules = value_dict["rules_apply"] if "rules_apply" in value_dict and rules_reqd else None
                        entities = get_entities(value_dict["data"], key, rules, solution_id, enrich_data, rules_reqd,
                                                entity_id=entity_id, parent=key,review_data=review_data)
                        add_entities_to_domain(entities, domain_data)
                domain_object.append(domain_data)
    return domain_object


def get_entities(entity_data, temp_id, rules, solution_id, enrich_data={},
                 rules_reqd=True, entity_id="", parent='', review_data={}):
    all_entities = []
    processed_rules = get_all_rules_processed(rules)
    domain_entity_id = entity_id
    attribute_list = []
    for key_name, val in entity_data.items():
        if key_name in ["insight_id", "enrichments"]:
            continue
        temp_entity_id = temp_id + "-" + key_name
        values = val
        entity_type = 'grouped_entity'
        cardinality = 'n'
        if isinstance(val, dict):
            values = [val]
            entity_type = 'entity'
            cardinality = '1'
        if list_of_dict(values):
            for value in values:
                rules = value["rules_apply"] if "rules_apply" in value and rules_reqd else None
                entity_key = parent + "." + key_name
                entity_id = value["entity_id"] if "entity_id" in value else ""
                entity_object = populate_fields(key_name, entity_type, temp_entity_id, parent_entity_id=domain_entity_id,
                                                cardinality=cardinality, entity_key=entity_key, rules=rules,
                                                solution_id=solution_id, enrich_data=enrich_data, entity_id=entity_id,
                                                extracted_name=key_name)
                if "data" in value and isinstance(value["data"], dict):
                    if isinstance(val, dict):
                        entity_object["attributes"] = get_entities(value["data"], temp_entity_id,
                                                                   rules, solution_id,
                                                                   enrich_data, rules_reqd=True,
                                                                   entity_id=entity_id, parent=entity_key,
                                                                   review_data=review_data)
                    else:
                        entity_object["groups"].extend(get_entities(value["data"], temp_entity_id, rules, solution_id,
                                                                    enrich_data, rules_reqd=True, entity_id=entity_id,
                                                                    parent=entity_key, review_data=review_data))
                all_entities.append(entity_object)
        else:
            attribute = populate_fields(key_name, "attribute", temp_entity_id, value=val, rules=processed_rules,
                                        solution_id=solution_id, enrich_data=enrich_data,
                                        entity_id=entity_id, entity_key=parent, extracted_name=key_name,
                                        review_data=review_data)
            attribute_list.append(attribute)
    if attribute_list:
        entity_object = dict(type="attribute", attributes=attribute_list, entity_id=entity_id)
        all_entities.append(entity_object)
    return all_entities


def populate_fields(name, type, temp_id, value="", parent_entity_id='',
                    cardinality="1", entity_key='', rules={},
                    solution_id="", enrich_data={}, entity_id="", extracted_name='',review_data={}):
    data = dict(name=name, type=type, extracted_name=extracted_name)
    if type in ["domain", "entity", "grouped_entity"]:
        data["parent_entity_id"] = parent_entity_id
        data["entity_key"] = entity_key
        data["temp_id"] = temp_id + "-" + str(entity_id)
        data["entity_id"] = entity_id
        if type == "grouped_entity":
            data["groups"] = []
        else:
            data["attributes"] = []
        data["cardinality"] = cardinality
    else:
        domain_mapped = temp_id.replace("-", ".")
        nlp_data = construct_nlp(enrich_data, domain_mapped)
        if nlp_data:
            data["nlp"] = nlp_data

        data["values"] = []
        if isinstance(value, str):
            value = [value]

        for index, val in enumerate(value):
            value_data = get_rules_info(name, rules, solution_id, val)
            temp_id = temp_id + "-" + str(entity_id) + "-" + str(index)
            value_data.update({'temp_id': temp_id})
            data["values"].append(value_data)

        review_data["attributes_extracted"] += 1
        data["justification"] = ""
        data["is_accept"] = False
        data["is_corrected"] = False
        data["need_review"] = True
        data["entity_key"] = entity_key
    return data


def add_entities_to_domain(entities, domain):
    match_found = False
    if isinstance(entities, dict):
        entities = [entities]
    for entity in entities:
        if "temp_id" not in entity:
            entity = entity["attributes"][0]
        for attribute in domain["attributes"]:
            if isinstance(attribute, list):
                attribute = attribute[0]
            if attribute["type"] == "attribute":
                attribute = attribute["attributes"][0]
            if attribute["temp_id"] == entity["temp_id"]:
                match_found = True
                if attribute["type"] == "entity" and entity["type"] == "entity":
                    for attr in entity["attributes"]:
                        add_entities_to_domain(attr, attribute)
                elif attribute["type"] == "attribute" and entity["type"] == "attribute":
                    attribute["current_value"].extend(entity["current_value"])
                    attribute["extracted_value"].extend(entity["extracted_value"])
    if not match_found:
        domain["attributes"].extend(entities)


def page_group_review(request, doc_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        if request.method == "GET":
            query = {"doc_id": doc_id}
            projection = {"doc_id": 1, "solution_id": 1, "pages": 1, "page_groups": 1, "metadata.properties": 1,
                          "_id": 0}
            document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query, projection=projection)

            if document is not None:
                document["volume"] = MOUNT_PATH
                return {"status": "success", "data": document}
            else:
                return {"status": "failure", "msg": "Failed to return document data"}
        elif request.method == "POST":
            payload = json.loads(request.body.decode())
            query = {"doc_id": doc_id, "solution_id": solution_id}
            document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query)
            doc_groups = document["page_groups"]
            feedback_list = get_groups_feedback(payload, doc_groups)
            if feedback_list:
                feedback_status = post_groups_feedback(feedback_list, doc_id, solution_id, document["root_id"])
            else:
                feedback_status = True

            if feedback_status:
                return process_complete_review(request, doc_id)
            else:
                return {'status': 'failure', 'msg': 'Error posting feedback'}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Internal error while submitting review', 'error': str(e)}
    finally:
        context.end_span()


def get_groups_feedback(payload, doc_groups):
    doc_groups = sorted(doc_groups, key=lambda k: k["start_page"])
    feedback_list = []
    feedback_keys = ["start_page", "end_page", "template_id", "template_name", "domain_mapping"]
    for idx, group in enumerate(payload["page_groups"]):
        feedback_dict = {}
        if idx < len(doc_groups):
            doc_group = doc_groups[idx]
            if not is_group_same(group, doc_group, feedback_keys):
                feedback_dict = {"insight_id": doc_group["insight_id"], "action": "upsert",
                                 "data": construct_json(group, feedback_keys)}
        else:
            feedback_dict = {"action": "upsert",
                             "data": construct_json(group, feedback_keys)}
        if feedback_dict:
            feedback_list.append(feedback_dict)
    diff_ranges = len(doc_groups) - len(payload["page_groups"])
    if diff_ranges > 0:
        for idx in range(len(payload["page_groups"]), len(doc_groups)):
            doc_group = doc_groups[idx]
            feedback_dict = {"insight_id": doc_group["insight_id"], "action": "delete"}
            feedback_list.append(feedback_dict)
    return feedback_list


def is_group_same(group, doc_group, compare_keys):
    for key in compare_keys:
        if key in group and key in doc_group:
            if group[key] != doc_group[key]:
                return False
        else:
            return False
    return True


def update_queue_status(data, state, status, update_reqd=False):
    if "life_cycle" in data and state in data["life_cycle"]:
        update_data = dict()
        data["life_cycle"][state]["status"] = status
        if status == "Closed" and state not in ["processed", "reviewed"]:
            data["life_cycle"][state]["closed_ts"] = datetime.now()
            update_data["doc_state"] = "processing"
        update_data["life_cycle"] = data["life_cycle"]
        if update_reqd:
            MongoDbConn.update(DOCUMENTS_COLLECTION, {"doc_id": data["doc_id"]}, update_data)
    return data


def post_groups_feedback(feedback, doc_id, solution_id, root_id):
    data = {"feedback": feedback, "doc_id": doc_id, "request_type": "extract_page_groups", "root_id": root_id}
    post_status = post_feedback(data, solution_id)
    if post_status["status"] == "success":
        return True
    else:
        return False


def remove_items(data, remove_list):
    for item in remove_list:
        if item in data:
            data.pop(item)
    return data


def format_entity_data(entity, elements, review_data, enrich_data, rules_reqd=True):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        entity_data_json = json.loads(entity)
        return format_enriched_data(entity_data_json, elements, review_data, enrich_data, rules_reqd)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {}
    finally:
        context.end_span()


def get_template_type(template_id, solution_id):
    if template_id and template_id != "unknown":
        template = MongoDbConn.find_one(TEMPLATE_COLLECTION,
                                        {"solution_id": solution_id, "template_id": template_id})
        if template:
            template_data = json.loads(template['template'])
            if "template_type" in template_data and template_data["template_type"] not in UNKNOWN_TYPES:
                return "known"
    return "unknown"


def get_doc_mapping_from_template(doc_id, solution_id):
    document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, {"doc_id": doc_id},
                                    projection={"template_id": 1, "solution_id": 1})
    template_id = document["template_id"] if "template_id" in document else ""
    mappings = MongoDbConn.find_one(MAPPING_COLLECTION, {"solution_id": solution_id, "template_id": template_id})
    return mappings


def download_document_json(request, doc_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        data = document_data(doc_id, solution_id)
        if data["status"] == "success":
            download_data = data["data"]["data"]
            download_data = remove_items(download_data, ["elements", "updated_ts"])
            return download_file(download_data, doc_id)
        else:
            return data
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Internal Error occurred", "Error": str(e)}
    finally:
        context.end_span()


def process_entity_linking(request, doc_id):
    solution_id = common.get_solution_from_session(request)
    return document_data(doc_id, solution_id, entity_reqd=True, rules_reqd=False)


def process_text_feedback(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        if payload["feedback"]:
            payload["feedback"] = reprocess_feedback(payload["feedback"])
            payload["request_type"] = "extract_elements"
            feedback_status = post_feedback(payload, solution_id)
            if feedback_status['status'] == "success" and "feedback" in request.get_full_path():
                return update_queue_extracted_feedback(None, payload["doc_id"], "extracted")
            else:
                return feedback_status
        else:
            return {"status": "success", "msg": "No changes to be saved"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Internal error occurred while submitting feedback"}
    finally:
        context.end_span()


def update_queue_extracted_feedback(document, doc_id, state):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if not document:
            document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, {"doc_id": doc_id})
        if "life_cycle" in document:
            curr_state = check_current_status(document, state)
            if curr_state and curr_state != "In Progress":
                update_queue_status(document, state, "In Progress", update_reqd=True)
        return {"status": "success", "msg": "Feedback submitted"}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failed", "msg": "Error updating queue status", "error": str(e)}
    finally:
        context.end_span()


def check_current_status(data, state):
    if "life_cycle" in data and state in data["life_cycle"]:
        status = data["life_cycle"][state]["status"]
    else:
        status = None
    return status


def process_complete_review(request, doc_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        path = request.get_full_path()
        if "text/" in path or "entity/" in path:
            payload = json.loads(request.body.decode())
            doc_id = payload["doc_id"]
            if payload["feedback"]:
                if "text/" in path:
                    feedback_status = process_text_feedback(request)
                else:
                    feedback_status = process_entity_feedback(request)
                if feedback_status["status"] != "success":
                    return {"status": "failure", "msg": "Failed to submit feedback"}
        query = {"doc_id": doc_id, "solution_id": solution_id}
        document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query)
        data = dict(doc_id=doc_id,pipeline_name="manual_review",root_id=document["root_id"])
        if 'completeReview/review/' in path:
            data.update({"object_type": ["document", "domain", "recommendation"],"complete_review":True})
        post_status = post(API_GATEWAY_POST_JOB_URI + PIPELINE["MANUAL_TRIGGER"],
                           {"solution_id": solution_id, "data": data})
        if post_status["status"] != "success":
            return {"status": "failure", "msg": "Error while posting review"}
        state = ""
        if "text/" in path:
            state = "extracted"
        elif "grouping/" in path:
            state = "classified"
        elif "entity/" in path:
            state = "processed"
        elif 'review/' in path:
            state = 'reviewed'
        update_queue_status(document, state, "Closed", update_reqd=True)
        # context.end_span()
        return {"status": "success", "msg": "Review completion Posted successfully"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Internal Error occured while posting review", "error": str(e)}
    finally:
        context.end_span()


""" This API is going to send the thresholds data to document services"""


def save_threshold_data(solution_id, payload):
    """
    :param solution_id:
    :param payload: request payload
    :return: response in json format
    """
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = payload['data']
        post_status = post(API_GATEWAY_POST_JOB_URI + DOCUMENT_ENDPOINT["thresholds_update"],
                           {"solution_id": solution_id, "data": data})
        if post_status['status'] == 'success':
            return {"status": "success", "msg": "Threshold data updated successfully"}
        else:
            return {"status": "failure", "msg": "Error while updating threshold data"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def change_doc_state(request):
    solution_id = get_solution_from_session(request)
    try:
        payload = json.loads(request.body.decode())
    except:
        payload = request.POST
    if payload["doc_state"] != "processed":
        doc_id = payload["doc_id"]
        query = dict(doc_id=doc_id, solution_id=solution_id)
        document = MongoDbConn.find_one(DOCUMENTS_COLLECTION, query)
        if "entity_feedback" in document and document["entity_feedback"]:
            MongoDbConn.update(DOCUMENTS_COLLECTION, query, {"entity_feedback": None})
    return post_doc_state_change(payload,solution_id, reset_cycle=True)


def post_doc_state_change(payload, solution_id, reset_cycle=False):
    data = {"data": payload, "solution_id": solution_id}
    post_result = post_job(REVIEW_ENDPOINT, data)
    if not is_request_timeout(post_result):
        status, result = get_response(post_result)
        if status:
            if reset_cycle:
                status_flag = update_case_status(payload['doc_id'], payload['doc_state'])
                if status_flag:
                    return {"status": "success", "msg": "Document rolled back to the requested state"}
                else:
                    return {"status": "success", "msg": "Document rolled back to the requested state "
                                                        "but case status is not updated."}
            else:
                return {"status": "success", "msg": "Document updated with the requested state"}
        else:
            return {"status": "failure", "msg": "Error while changing document State", "error": result}
    else:
        return {"status": "failure", "msg": "Request timed out"}