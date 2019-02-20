from config_vars import TABLES_CONFIG
from utilities.common import get_solution_from_session, is_request_timeout
from utilities.http import post_job, is_message_published,get_nested_value
import json


def tables_services(request):
    solution_id = get_solution_from_session(request)
    if request.method == "POST":
        payload = json.loads(request.body.decode())
        return tables_save(TABLES_CONFIG, payload, solution_id)
    elif request.method == "GET":
        return tables_get(TABLES_CONFIG, solution_id)


def tables_save(config, data, solution_id):
    response = post_job(config['SAVE'], {"solution_id": solution_id, "data": data})
    if not is_request_timeout(response):
        if is_message_published(response):
            return {'status': 'success', 'msg': 'Tables config saved'}
        else:
            return {'status': 'failure', 'msg': 'Failed to save config'}
    else:
        return {'status': 'failure', 'msg': 'Request timeout'}


def tables_get(config, solution_id):
    data = {"service_name": "document-microservice", "configuration_field": "table_config"}
    result = post_job(config["GET"], {"solution_id": solution_id, "data": data})
    response = get_nested_value(result, "result.result.metadata.configuration.table_config")
    if response is not None:
        return {'status': 'success', "data": response}
    else:
        return {"status": "failure", "data": []}