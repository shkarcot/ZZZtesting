import json
import traceback
from uuid import uuid4

from config_vars import API_GATEWAY_POST_JOB_URI, PIPELINE, TEMPLATE_COLLECTION, DEFAULT_SECTION
from connections.mongodb import MongoDbConn
from utilities.http import post
from xpms_objects.models.elements import *
from copy import deepcopy

TEMPLATE_SCHEMA = {
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "template_name": {"type": "string"},
        "solution_id": {"type": "string"},
        "doc_id": {"type": "string"},
        "elements": {"type": "array"},
        "template_type": {"type": "string"},
        "document_variables": {"type": "object"},
        "domain_object_mapping": {"type": "object"}
    },
    "required": [
        "template_name",
        "solution_id",
        "doc_id",
        "elements",
        "template_type",
        "document_variables",
        "domain_object_mapping"
    ]
}
TEMPLATE_SAVE_URL = "template/save"
TEMPLATE_PUBLISH_URL = "template/publish"
TEMPLATE_INGEST_URL = "insight/getInsight"


def ingest_template(solution_id, payload, file_path=None):
    try:
        data = dict(template_name=payload["template_name"], pipeline_name="ingest_template")
        if file_path is not None:
            data["file_path"] = file_path
        return post_save_template(solution_id, data, endpoint=PIPELINE["TRIGGER_PIPELINE"])
    except Exception:
        return dict(success=False, error=traceback.format_exc(), msg="failed to ingest template", status="success")


def get_template(solution_id, template_type="", template_id="", payload={}):
    try:
        unknown_types = ["unknown_known", "unknown_unknown"]
        query = dict(solution_id=solution_id, is_deleted=False)

        if template_id != "":
            query["template_id"] = template_id
            t = MongoDbConn.find_one(TEMPLATE_COLLECTION, query, {"_id": 0})

            # Constructing Response
            templates = json.loads(t["template"]) if t else {}
            templates["template_id"] = templates["doc_id"]
            templates["no_of_pages"] = len(templates["pages"].keys())
            templates["elements"] = convert_elements_old(templates["elements"])
            count = 1
        else:
            t = MongoDbConn.find(TEMPLATE_COLLECTION, query, {"_id": 0})
            templates = list()
            for a in t:
                a = json.loads(a["template"])
                a["template_id"] = a["doc_id"]
                templates.append(a)

            if template_type != "":
                if template_type == "allpublished":
                    templates = [a for a in templates if not a["is_draft"] or a["template_type"] in unknown_types]
                else:
                    template_type = unknown_types if template_type == "unknown" else [template_type]
                    templates = [a for a in templates if a["template_type"] in template_type]

            count = len(templates)
            page_no = payload["page_no"] if "page_no" in payload else None
            limit = payload["no_of_recs"] if "no_of_recs" in payload else None
            if page_no and count > limit:
                skip = (int(page_no) - 1) * limit
                templates = templates[skip:skip + limit]

        return dict(success=True, msg="Template data", data=templates, total_count=count, status="success")
    except Exception:
        return dict(success=False, error=traceback.format_exc(), msg="Failed to get template", status="failure")


def update_template(solution_id, payload):
    try:
        # Finding template
        filter_query = dict(solution_id=solution_id, template_id=payload.pop("template_id"), is_deleted=False)
        template_data = MongoDbConn.find_one(TEMPLATE_COLLECTION, filter_query)
        template = json.loads(template_data["template"]) if template_data else {}

        # Updating template
        endpoint = TEMPLATE_PUBLISH_URL if "is_draft" in payload else TEMPLATE_SAVE_URL
        template.update(payload)
        return post_save_template(solution_id, dict(document=template), endpoint=endpoint)
    except Exception:
        return dict(success=False, msg="Failed to publish template", error=traceback.format_exc(), status="failure")


def save_template_element(solution_id, data):
    try:
        query = dict(solution_id=solution_id, template_id=data.pop("template_id"), is_deleted=False)
        template = MongoDbConn.find_one(TEMPLATE_COLLECTION, query)
        template = json.loads(template["template"]) if template else {}

        # new element object
        new = data
        new["id"], is_update = (str(uuid4()), False) if "id" not in new else (new["id"], True)
        new["section_id"] = new["id"] if "section_id" not in new else new["section_id"]
        new["is_deleted"] = False

        if new["type"] == "table":
            template["domain_object_mapping"] = update_table_mapping(new, template["domain_object_mapping"])
        else:
            if "domain_mapping" in new and new["domain_mapping"] != "":
                template["domain_object_mapping"] = update_template_domain_mapping(new["domain_mapping"],
                                                                                   new["id"],
                                                                                   template["domain_object_mapping"])
                template["document_variables"].pop(new["id"], None)

            if "doc_var" in new and new["doc_var"] != {}:
                template["document_variables"] = update_template_document_variables(new["doc_var"],
                                                                                    new["id"],
                                                                                    template["document_variables"])
                template["domain_object_mapping"].pop(new["id"], None)

        elements_reformatted = update_template_elements(new, _obj=template["elements"], is_update=is_update)
        template["elements"] = [elements_reformatted]

        resp = post_save_template(solution_id, dict(document=template))
        resp.update(dict(section_id=new['section_id'], id=new['id']))
        return resp
    except Exception:
        return dict(success=False, msg="Failed to save element", error=traceback.format_exc(), status="failure")


def update_template_elements(ele, _obj, is_update=False):
    """
    Used to update old to new elements format.
    As json transformations required at child level as root as json does not handle these.
    :param ele:
    :param _obj:
    :param is_update:
    :return:
    """
    ele_old = deepcopy(ele)
    _obj = remove_element(_obj, ele["id"]) if is_update else _obj

    ele_tree = ElementTree(json_obj=_obj[0])
    root = ele_tree.find_one(lambda x: x.id == ele["section_id"]) if ele["section_id"] not in ["default"] else ele_tree

    cords = [dict(x1=a["x1"], x2=a["x2"], y1=a["y1"], y2=a["y2"], page_num=a["page_number"])
             for a in ele["coordinates"]] if "coordinates" in ele else []
    el = None

    if ele["type"] == "section":
        el = SectionElement(parent=root, id=ele["id"], node_type="section", parent_id=ele["section_id"])

    elif ele["type"] == "omr":
        el = OmrFieldElement(parent=root, id=ele["id"], name=ele["name"], regions=cords, node_type="omr",
                             key=FieldKeyElement(), value=FieldValueElement(id=str(uuid4()), regions=cords))
        if "has_label" in ele["parameters"]:
            el.has_label = ele["parameters"]["has_label"]
            el.key.regions = [dict(x1=a["x1"], x2=a["x2"], y1=a["y1"], y2=a["y2"], page_num=a["page_number"])
                              for a in ele["parameters"]["label_coordinates"]] if el.has_label else []
        el.fields = list()
        group = ele["groups"][0] if "groups" in ele and len(ele["groups"]) > 0 else {}
        el.is_multiselect = group["is_multiOption"]
        for o in group["options"]:
            o_el = FieldElement(id=str(uuid4()), node_type="omr_field")
            o_el.key.text = o["label"]
            o_el.key.regions = [dict(x1=a["x1"], x2=a["x2"], y1=a["y1"], y2=a["y2"], page_num=a["page_number"])
                                for a in o["coordinates"]]
            el.fields.append(o_el)

    elif ele["type"] == "field":
        el = FieldElement(parent=root, id=ele["id"], name=ele["name"], regions=cords, node_type="field")
        el.value.regions = cords
        el.is_variable_field = ele["is_variable_field"] if "is_variable_field" in ele else False
        if "has_label" in ele["parameters"]:
            el.has_label = ele["parameters"]["has_label"]
            el.key.regions = [dict(x1=a["x1"], x2=a["x2"], y1=a["y1"], y2=a["y2"], page_num=a["page_number"])
                              for a in ele["parameters"]["label_coordinates"]] if el.has_label else []

    elif ele['type'] == 'paragraph':
        el.is_variable_field = ele["is_variable_field"] if "is_variable_field" in ele else False
        el = ParagraphElement(parent=root, id=ele["id"], name=ele["name"], region=cords, node_type="paragraph",
                              top_keys=ele["top_keys"] if "top_keys" in ele else [],
                              bottom_keys=ele["bottom_keys"] if "bottom_keys" in ele else [])

    elif ele['type'] == 'table':
        el = TableElement(parent=root, id=ele["id"], name=ele["name"], node_type="table",
                          top_keys=ele["top_keys"] if "top_keys" in ele else [],
                          bottom_keys=ele["bottom_keys"] if "bottom_keys" in ele else [],
                          is_transpose=ele["is_transpose"] if "is_transpose" in ele else False)
        headings = ele["headings"] if "headings" in ele else []
        el.headers = [TableHeaderElement(column_index=[h["column_no"]], row_index=[0], text=h["column"])
                      for h in headings]
    if el:
        el.old_element = ele_old

    return json.loads(ele_tree.as_json(True))


def update_template_domain_mapping(new_map, element_id, domain_mapping):
    new_map_obj = dict(domain_object=new_map.rsplit(".", 1)[0], attribute=new_map.rsplit(".", 1)[1])
    domain_mapping[element_id] = [new_map_obj]
    return domain_mapping


def update_template_document_variables(new_var, element_id, document_variable):
    new_var_obj = dict(name=new_var["name"], data_type=new_var["type"], enable_rules=False, rules=new_var["rule_id"])
    document_variable[element_id] = [new_var_obj]
    return document_variable


def update_table_mapping(ele, temp_mapping):
    table_id = ele["id"]
    if "parameters" in ele and "headings" in ele["parameters"]:
        domain_mapping = []
        for heading in ele["parameters"]["headings"]:
            if "domain_mapping" in heading:
                map_data = heading["domain_mapping"]
                new_map_obj = dict(domain_object=map_data.rsplit(".", 1)[0],
                                   attribute=map_data.rsplit(".", 1)[1],
                                   column_no=[heading["column_no"]])
                domain_mapping.append(new_map_obj)
        temp_mapping[table_id] = domain_mapping
    return temp_mapping


def post_save_template(solution_id, data, endpoint=TEMPLATE_SAVE_URL):
    request = dict(data=data, solution_id=solution_id)
    response = post(API_GATEWAY_POST_JOB_URI + endpoint, request)
    if response["status"] == "success":
        return dict(success=True, msg="Template Updated", status="success")
    else:
        return dict(success=False, msg=response["msg"], status="failure")


def delete_template_element(solution_id, data):
    try:
        query = dict(solution_id=solution_id, template_id=data.pop("template_id"), is_deleted=False)
        template = MongoDbConn.find_one(TEMPLATE_COLLECTION, query)
        template = json.loads(template["template"]) if template else {}

        id = data["id"]
        template["elements"] = remove_element(template["elements"], id)
        template["domain_object_mapping"].pop(id, None)
        template["document_variables"].pop(id, None)

        return post_save_template(solution_id, dict(document=template))
    except Exception:
        return dict(success=False, msg="failed to delete template", error=traceback.format_exc(), status="failure")


def remove_element(elements, id):
    for e in elements:
        if e["id"] == id:
            elements.remove(e)
            break
        elif "children" in e:
            remove_element(e["children"], id)
        else:
            continue
    return elements


def save_unknown_template(solution_id, payload):
    if "template_id" in payload:
        query = dict(solution_id=solution_id, template_id=payload["template_id"], is_deleted=False)
        template = MongoDbConn.find_one(TEMPLATE_COLLECTION, query)
        template = json.loads(template["template"]) if template else {}
        template["elements"] = payload["elements"]
        return post_save_template(solution_id, dict(document=template))
    else:
        payload["request_type"] = "ingest_template"
        return post_save_template(solution_id, data=payload, endpoint=TEMPLATE_INGEST_URL)


def add_temp_id(elements, temp_id=None):
    for e in elements:
        e["temp_id"] = str(temp_id) + str(e["id"]) if temp_id else str(e["id"])
        if "elements" in e:
            add_temp_id(e["elements"], e["temp_id"])
        else:
            continue
    return elements


def convert_elements_old(elements, temp_id=None):
    for element in elements:
        element["type"] = element.pop("node_type")
        del_keys = [key for key in element.keys() if key not in ["old_element", "elements", "id", "children"]]

        if element["type"] == "default_section":
            assert pop_keys(element, del_keys)
            element.update(DEFAULT_SECTION)
            element["temp_id"] = element["id"]
        else:
            assert pop_keys(element, del_keys)
            element.update(element["old_element"])
            element["temp_id"] = temp_id + "_" + element["id"]
            element.pop("old_element")

        if "children" in element:
            element["elements"] = element.pop("children")
            convert_elements_old(element["elements"], element["temp_id"])
    return elements


def pop_keys(d: dict, k: list):
    for i in k:
        d.pop(i, None)
    return True
