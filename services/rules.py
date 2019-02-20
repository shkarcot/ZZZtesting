import traceback
from uuid import uuid4
from django.http.response import JsonResponse
from xpms_common import trace
from utilities import common
from utilities.http import post, post_job, is_request_timeout, get_response, get_nested_value
from config_vars import RULE_SERVICE_URI, LIST_OPERATORS_SERVICE_METHOD, RULES_ENDPOINT, RULES_COLLECTION, SERVICE_NAME
from jsonschema import Draft3Validator
import json
from jrules_lib.rule_manager import RuleManager
from connections.mongodb import MongoDbConn

tracer = trace.Tracer.get_instance(SERVICE_NAME)


def rules_config():
    data = dict()
    data["solution_id"] = 'R1'
    data["request_id"] = "1234"
    resp = post(RULE_SERVICE_URI + LIST_OPERATORS_SERVICE_METHOD, data)
    return JsonResponse(resp)


rules_schema = {
    "$schema": "http://json-schema.org/schema#",
    "type": "object",
    "properties": {
        "rule": {
            "type": "object"
        },
        "rule_type": {
            "type": "string"
        },
        "rule_name": {
            "type": "string"
        }
    },
    "required": ["rule", "rule_type", "rule_name"]
}


def create_rules(payload, solution_id, config):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if is_rule_valid(payload):
            data = {"solution_id": solution_id, "data": payload}
            response = post_job(config['EP'], data)
            if 'job_id' in response:
                job_id = response["job_id"]
            if not is_request_timeout(response):
                status, result = get_response(response)
                if status:
                    rule_id = get_nested_value(response, config["DATA"])
                    return {"status": "success", "data": str(rule_id),
                            "msg": "Successfully created rule.",
                            'job_id':job_id}
                else:
                    return result
            else:
                return {"status": "failure", "msg": "Request timed out.",
                        'job_id':job_id}
        else:
            return {"status": "failure", "msg": "Invalid rule format.",
                    'job_id': job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "msg": str(e), "data": "",
                    'job_id':job_id}
        else:
            return {"status": "failure", "msg": str(e), "data": ""}
    finally:
        context.end_span()


def get_rules(solution_id, config):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id": solution_id, "data": {"filter_obj": {}}}
        response = post_job(config["EP"], data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                resp = get_nested_value(response, config["DATA"])
                return {"status": "success", "data": resp,
                        "msg": "Successfully retrieved rules", 'job_id':job_id}
            else:
                return result
        else:
            return {"status": "failure", "msg": "request timed out",
                    'job_id': job_id}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        if job_id:
            return {"status": "failure", "data": [], "msg": str(e),
                    'job_id': job_id}
        else:
            return {"status": "failure", "data": [], "msg": str(e)}
    finally:
        context.end_span()


def rules_execution_test(solution_id, payload, config):
    job_id = None
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id": solution_id, "data": payload}
        response = post_job(config["EP"], data)
        if 'job_id' in response:
            job_id = response["job_id"]
        if not is_request_timeout(response):
            status, result = get_response(response)
            if status:
                resp = get_nested_value(response, config["DATA"])
                return {"status": "success", "data": resp,
                        "msg": "test successful", 'job_id':job_id}
            else:
                return result
        else:
            return {"status": "failure", "msg": "Request timed out",
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

def is_rule_valid(rule):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        return Draft3Validator(rules_schema).is_valid(rule)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return False
    finally:
        context.end_span()


def process_rules(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        if request.method == "GET":
            return get_rule(solution_id)
        elif request.method == "POST":
            data = json.loads(request.body.decode())
            if "rule_id" in data:
                msg = "Rule Updated Successfully"
            else:
                msg = "Rule Added Successfully"
            response = update_rule(solution_id,data)
            if response["status"] == "success":
                return {"status": "success", "msg":msg, "rule_id" : response["rule_id"]}
            else:
                return response
        elif request.method == "DELETE":
            data = json.loads(request.body.decode())
            response = delete_rule(solution_id,data["rule_id"])
            if response["status"] == "success":
                return {"status": "success", "msg":"Rule Deleted Successfully"}
            else:
                return response
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def get_rule(solution_id,rule_id=None):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        rules = RuleManager()
        if rule_id:
            payload = dict(solution_id=solution_id,rule_id=rule_id)
            result = rules.process("getRule", payload)
            key = "rule"
        else:
            payload = dict()
            error = 'Invalid response'
            payload["solution_id"] = solution_id
            result = rules.process("getRules", payload)
            key = "rules"
        if 'status' in result:
            if 'code' in result['status']:
                if result['status']['code'] == 200:
                    if 'metadata' in result and key in result['metadata']:
                        rules = result['metadata'][key]
                        if isinstance(rules,list) and len(rules) > 0:
                            for r in rules:
                                r.pop('_id', False)
                        if isinstance(rules, dict):
                            rules.pop('_id', False)
                        error = None
                else:
                    error = result['msg']

        res = {"status": "success", "data": rules}
        if error is not None:
            res['error'] = error

        return res
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status" : "failure", "msg" : str(e)}
    finally:
        context.end_span()


def update_rule(solution_id,rule):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        rules = RuleManager()
        rule["solution_id"] = solution_id
        result = rules.process("saveRule",rule)
        status = result["status"]
        if status["success"]:
            rule_id = get_nested_value(result,"metadata.rule_id")
            where_clause = dict(solution_id=solution_id, rule_id=rule_id)
            MongoDbConn.update(RULES_COLLECTION,where_clause,rule)
            response = {"status":"success","rule_id":rule_id}
        else:
            response = {"status":"failure","msg":status["msg"]}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        response = {"status": "failure","msg":str(e)}
    context.end_span()
    return response


def delete_rule(solution_id,rule_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        payload = dict(solution_id=solution_id,rule_id=rule_id)
        rules = RuleManager()
        result = rules.process("deleteRule",payload)
        if result["status"]["success"] is True:
            MongoDbConn.remove(RULES_COLLECTION,dict(solution_id=solution_id,rule_id=rule_id))
            response = {"status":"success"}
        else:
            response = {"status":"failure","msg":result["status"]["msg"]}
        return response
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":str(e)}
    finally:
        context.end_span()


def get_config(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        rules = RuleManager()
        result = rules.process("getOperators",solution_id)
        if result and result["status"]["success"]:
            config = result["metadata"]["data"]
            return {"status":"success","config":config}
        else:
            return {"status": "success","msg":"error while retrieving config from rules"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":str(e)}
    finally:
        context.end_span()


def get_rule_info(solution_id,rule_id):
    rule = RuleManager()
    payload = dict(solution_id=solution_id, rule_id=rule_id)
    rule_info = rule.process(RULES_ENDPOINT["get_rule"], payload)
    return rule_info


def execute_rules(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        rules = RuleManager()
        data = json.loads(request.body.decode())
        data["solution_id"] = common.get_solution_from_session(request)
        rule = data["rule"]
        transform_rule = False
        if "rule_type" in rule.keys() and rule["rule_type"] == "T":
            transform_rule = True
            document_variables = [k for k in data["source"].keys()]
            data["source"].update(format_source_data(rule["rule"]))
        else:
            data["source"] = data["source"]["source"]
        result = rules.process("execute",data)
        if result["status"]["success"]:
            exec_result = result["metadata"]["result"]["facts"]
            if transform_rule:
                final_result = []
                formatted_result = reformat_attribute_dict(exec_result["result"],"",[])
                for item in formatted_result:
                    if list(item.keys())[0] not in document_variables:
                        final_result.append(item)
                exec_result["result"] = final_result
            if "src" in exec_result.keys():
                exec_result.pop("src")
            return {"status":"success","result":exec_result}
        else:
            return {"status":"failure","msg":result["status"]["msg"]}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def execute_custom_rules(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "POST":
            payload = json.loads(request.body.decode())
            payload["solution_id"] = common.get_solution_from_session(request)
            rules = RuleManager()
            exec_result = rules.process("executeCustomCode",payload)
            if exec_result["status"]["success"]:
                output = exec_result["metadata"]["result"]
                return {"status":"success","result":output}
            else:
                return {"status": "failure","msg":exec_result["msg"]}
    # TODO raise specific exception
    except Exception as e:
        return {"status":"failure","error":str(e),"msg":"Internal Error occurred"}
    finally:
        context.end_span()


def format_source_data(rule):
    source_dict = {}
    for action in rule['actions']:
        assign_variables = action["attr"]["rval"]
        if action["op"] == "split":
            for attribute in assign_variables.values():
                attribute_dict = format_hierarchy_rules(attribute)
                source_dict = add_attribute_dict(attribute_dict, source_dict)
        else:
            source_dict.update(format_hierarchy_rules(assign_variables))
    return source_dict


def format_hierarchy_rules(attr):
    attribute_list = attr.split('.')
    attribute_dict = {}
    first_rec = True
    for rec in reversed(attribute_list):
        if first_rec:
            attribute_dict[rec] = ""
            first_rec = False
        else:
            attribute_dict = {}
            attribute_dict[rec] = previous_dict
        previous_dict = attribute_dict
    return attribute_dict


def add_attribute_dict(attribute,source):
    attribute_key = next(iter(attribute))
    source_key = [key for key in source.keys()]
    if attribute_key in source_key:
        add_attribute_dict(attribute[attribute_key],source[attribute_key])
    else:
        source[attribute_key] = attribute[attribute_key]
    return source

def reformat_attribute_dict(data, attribute="", attribute_list=[]):

    if isinstance(data, dict):
        for k in data:
            reformat_attribute_dict(data[k], attribute + '.' + k if attribute else k, attribute_list)
    else:
        attribute_list.append({attribute:data})

    return attribute_list



def process_custom_rules(request,type):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        if request.method == "GET":
            return(get_custom_rules(solution_id,type))
        elif request.method == "POST":
            data = json.loads(request.body.decode())
            response = update_custom_rule(solution_id,data)
            if response["status"] == "success":
                return {"status": "success", "msg":"Custom rule added Successfully"}
            else:
                return response
        elif request.method == "DELETE":
            data = json.loads(request.body.decode())
            response = delete_custom_rule(solution_id, data)
            if response["status"] == "success":
                return {"status": "success", "msg":"Custom rule deleted Successfully"}
            else:
                return response

    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def update_custom_rule(solution_id,data):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        rules = RuleManager()
        data["solution_id"] = solution_id
        result = rules.process("saveCustomRule",data)
        status = result["status"]
        if status["success"]:
            response = {"status":"success"}
        else:
            response = {"status":"failure","msg":status["msg"]}
    # TODO raise specific exception
    except Exception as e:
        response = {"status": "failure","msg":str(e)}
    context.end_span()
    return response


def get_custom_rules(solution_id,type):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = {"solution_id" : solution_id,"type":type}
        rules = RuleManager()
        result = rules.process("getCustomRules",data)
        if result and result["status"]["success"]:
            rules = result["metadata"]["rules"]
            return {"status":"success","custom_rules":rules}
        else:
            return {"status": "success","msg":"error while retrieving custom rules"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":str(e)}
    finally:
        context.end_span()


def delete_custom_rule(solution_id,data):
    try:
        data["solution_id"] = solution_id
        rules = RuleManager()
        result = rules.process("deleteCustomRules",data)
        status = result["status"]
        if status["success"]:
            response = {"status":"success"}
        else:
            response = {"status":"failure","msg":status["msg"]}
    except Exception as e:
        response = {"status": "failure","msg":str(e)}
    return response