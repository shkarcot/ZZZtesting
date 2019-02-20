import json, os
import traceback
from django.core.files.storage import FileSystemStorage
from datetime import datetime
from bson import ObjectId
from xpms_common import trace
from xpms_common.storage_handler import StorageHandler
from services.entity import store_entity_definitions, delete_entity_definitions
from utilities import common
from utilities.common import get_solution_from_session, delete_files, get_file_contents, save_to_folder
from utilities.http import post_s3, post_to_ms, s3_delete, download_file,get, get_nested_value
from connections.mongodb import MongoDbConn
from config_vars import ROOT, TRAINING_SET_COLLECTION, TRAINING_SET_SERVICES_COLLECTION, \
    AMAZON_AWS_BUCKET, AMAZON_AWS_KEY_PATH, MOUNT_PATH, RESOURCES_COLLECTION, RULES_ENDPOINT, \
    API_GATEWAY_POST_JOB_URI, PLATFORM_SERVICE_SPECS, SERVICE_NAME, UPLOADED_FILE_COLLECTION, STATUS_CODES
from uuid import uuid4
from copy import deepcopy
from jrules_lib.rule_manager import RuleManager
#from xpms_common.sftp_handler import SFTPManager

rm_rules = RuleManager()


tracer = trace.Tracer.get_instance(SERVICE_NAME)


def process_tags(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        result = dict(status="failure")
        if request.method == "GET":
            data = dict(solution_id=solution_id)
            response = rm_rules.process(RULES_ENDPOINT["get_tags"],data)
            if response["status"]["success"]:
                tags_list = response["metadata"]["tags"]
                result.update({"status":"success","msg":"Tags retrieved successfully","data":tags_list})
            else:
                result["msg"] = response["status"]["msg"]
        if request.method == "DELETE":
            payload = json.loads(request.body.decode())
            data = payload
            data["solution_id"] = solution_id
            response = rm_rules.process(RULES_ENDPOINT["del_tag"], data)
            if response["status"]["success"]:
                result.update({"status": "success", "msg": "Tags deleted successfully"})
            else:
                result["msg"] = response["status"]["msg"]
        return result
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":"Internal Error occured","error":str(e)}
    finally:
        context.end_span()


def process_term_data(request):
    result = dict(status="failure")
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    solution_id = common.get_solution_from_session(request)
    try:
        if request.method == "POST":
            payload = json.loads(request.body.decode())
            payload.update({"solution_id":solution_id})
            response = rm_rules.process(RULES_ENDPOINT["search"],payload)
            if response["status"]["success"]:
                result["status"] = "success"
                result["data"] = get_nested_value(response,"metadata.result.terms")
            else:
                result["msg"] = response["status"]["msg"]
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        result.update({"msg":"Internal Error occured","error":str(e)})
    context.end_span()
    return result


def upload_training_set(request):
    if request.method == 'POST' and request.FILES is not None and len(request.FILES)>0:
        files = request.FILES
        uploaded_file = files['file']
        unique_folder = "/media/" + str(uuid4())
        # Saving File to media folder.
        fs = FileSystemStorage(location=ROOT + unique_folder)
        filename = fs.save(uploaded_file.name, uploaded_file)
        uploaded_file_url = str(unique_folder + "/" + filename).replace("%20", " ")
        extn = str(str(filename).rsplit(".", 1)[1])

        if extn == 'owl' or extn == "rdf":
            store_entity_definitions(str(os.getcwd()) + uploaded_file_url, get_solution_from_session(request))

        # Adding file to bucket
        resp = post_s3(str(filename), ROOT + uploaded_file_url, AMAZON_AWS_BUCKET, AMAZON_AWS_KEY_PATH)

        # Sending file info to platform
        resp_api = post_to_ms(str(filename), resp['url'], extn, get_solution_from_session(request))

        # Formatting data for insert
        data = create_data(dict(request.POST), filename, resp['url'], resp['key'], extn, get_solution_from_session(request))
        data['created_ts'] = datetime.now()

        data['is_published'] = False
        if resp_api['status'] == 'success' and resp_api['status_code'] == 200:
            data['is_published'] = True
        services = get_file_contents('platform_services.json')
        if services is not None:
            platform_services = dict()
            for key in services.keys():
                platform_services[key] = {'enabled': False}
            data['services'] = platform_services
        MongoDbConn.insert(TRAINING_SET_COLLECTION, data)
        # create_training_data_services(data)

        return {'status': 'success', 'msg': 'Resource uploaded to library'}
    elif request.method == 'POST':
        payload = json.loads(request.body.decode())
        data = payload['data']
        status = False
        if '_id' in data.keys():
            status = update_training_data(data)
        if status:
            return {'status': 'success', 'status_code': 200, 'msg': 'Updated training set'}
        else:
            return {'status': 'failure', 'status_code': 500, 'msg': 'Failed in updated training set'}
    elif request.method == 'GET':
        delete_files()
        return training_set_get(TRAINING_SET_COLLECTION, dict(), get_solution_from_session(request))

    elif request.method == 'DELETE':
        payload = json.loads(request.body.decode())
        return training_set_delete(get_solution_from_session(request), payload)


def create_data(post_dict, filename, path, s3_key, extn, solution_id):
    data = dict()
    for key in post_dict.keys():
        data[str(key)] = str(post_dict[key][0])
    data['file_name'] = filename
    data['solution_id'] = solution_id
    data['extn'] = extn
    data['s3_url'] = path
    data['s3_key'] = s3_key
    # get platform services list
    services = get_file_contents("platform_services.json")
    service_with_status = {}
    for service in services:
        service_with_status[service] = False
    data['services'] = service_with_status
    return data


def process_hierarchy(request):
    '''
    :param request:wsgi request
    :return:class hierarchy details
    '''
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = get_solution_from_session(request)
        result = dict(status="failure")
        if request.method == "POST":
            payload = json.loads(request.body.decode())
            data = {"solution_id": solution_id, "tag": payload['tag']}
            response = rm_rules.process(RULES_ENDPOINT["get_hierarchy"], data)
            if response["status"]["success"]:
                tag_info = response["metadata"]
                formatted_data = rule_info(tag_info)
                result.update({"status": "success", "msg": "data formatted successfully", "data": formatted_data})
            else:
                result["msg"] = response["status"]["msg"]
        return result
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "Internal Error occurred", "error": str(e)}
    finally:
        context.end_span()


def rule_info(tag_info):
    '''
    :param tag_info: hierarchy of rule engine data
    :return: formatted hierarchy
    '''
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        list_formatted_data = {}
        for content in tag_info.keys():
            get_formatted_hierarchy(tag_info, content, list_formatted_data)
        return list_formatted_data
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return str(e)
    finally:
        context.end_span()


def get_formatted_hierarchy(hierarchy_info, var, res, var_p="default"):
    '''
    :param hierarchy_info: hierarchy of rule engine data
    :param var: key of hierarchy
    :param res: formatted dict
    :param var_p: name of the key
    :return:
    '''
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if type(hierarchy_info[var]) == dict:
            allist = []
            for obj in hierarchy_info[var].keys():
                name=naming(var_p,var)
                get_formatted_hierarchy(hierarchy_info[var], obj, res, name)
                if type(hierarchy_info[var][obj]) == dict:
                    allist.append(obj)
            if len(allist) > 0:
                name = naming(var_p, var)
                res[name] = allist
                return res
        else:
            pass
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return str(e)
    finally:
        context.end_span()


def naming(var_p, var):
    if var_p == "default":
        name = var
    else:
        name = var_p + "." + var
    return name


def update_training_data(data):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        training_set = MongoDbConn.find_one(TRAINING_SET_COLLECTION,
                                            {'_id': ObjectId(data['_id'])})

        if training_set is not None:
            MongoDbConn.update(TRAINING_SET_COLLECTION,
                               {'_id': ObjectId(data['_id'])}, {'description': data['description'],
                                                                'updated_ts': datetime.now()})
        return True
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return False
    finally:
        context.end_span()


def training_set_get(collection, query, solution_id, flag=False):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        query['solution_id'] = solution_id
        response = MongoDbConn.find(collection, query).sort("_id", -1)

        final_data = dict()
        resp = list()
        for rec in response:
            rec['_id'] = str(rec['_id'])
            resp.append(rec)
        final_data['data'] = resp
        if not flag:
            final_data['resource_types'] = get_file_contents("upload_resource_types.json")
        return final_data
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {'status': 'failure', 'msg': 'Error in get resource library', 'errorMsg': str(e)}
    finally:
        context.end_span()


def training_set_delete(solution_id, payload):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        result = MongoDbConn.find_one(TRAINING_SET_COLLECTION,
                                          {"_id": ObjectId(payload['_id'])})
        if result is not None and "s3_key" in result.keys():
            key = result['s3_key']
            if result["extn"] in ["owl", "rdf"]:
                delete_entity_definitions(solution_id, result["s3_url"])
            resp = s3_delete(AMAZON_AWS_BUCKET, str(key))
            if resp['status'] == 'success':
                MongoDbConn.remove(TRAINING_SET_COLLECTION, {"_id": ObjectId(payload['_id'])})
                delete_training_set_services(payload['_id'])
            return resp
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": "failed to delete resource"}
    finally:
        context.end_span()


def delete_training_set_services(rec_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        MongoDbConn.remove(TRAINING_SET_SERVICES_COLLECTION, {"trset_id": rec_id})
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def invoke_files_download(doc_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        result = MongoDbConn.find_one(TRAINING_SET_COLLECTION, {"_id": ObjectId(doc_id)})
        if result is not None:
            path = result['s3_key']
            return download_file(AMAZON_AWS_BUCKET, path)
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
    finally:
        context.end_span()


def save_uploaded_files(request,type):
    response = dict(status="failure")
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        solution_id = common.get_solution_from_session(request)
        if request.method == 'POST':
            if request.FILES is not None and len(request.FILES) > 0:
                return create_new_resource(request,solution_id)
            else:
                response["msg"] = "No files attached to the request"
        elif request.method == "GET":
            return get_all_resources(type,solution_id)
        else:
            response["msg"] = "Invalid request"
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        response["msg"] = str(e)
    context.end_span()
    return response


def create_new_resource(request,solution_id):
    response = dict(status="failure")
    payload = dict(request.POST)
    payload_dict = dict()
    for key in payload.keys():
        payload_dict[str(key)] = str(payload[key][0])
    uploaded_file = request.FILES['file']
    result = save_to_folder(solution_id, uploaded_file, MOUNT_PATH, "resources", "uploads", flag=True)
    data = result["data"]
    data.update(payload_dict)
    result = save_resource_file(data, solution_id)
    if result["status"] == "success":
        response["status"] = "success"
        response["msg"] = "Files uploaded successfully"
    else:
        response["msg"] = result["msg"]
    return response


def save_resource_file(payload,solution_id):
    result = dict(status="failure")
    payload["solution_id"] = solution_id
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        data = deepcopy(payload)
        if "description" in data.keys():
            data["desc"] = data.pop("description")
        else:
            data["desc"] = ""
            payload["description"] = ""
        rules = RuleManager()
        response = rules.process(RULES_ENDPOINT["SAVE"],data)
        if response["status"]["success"]:
            result["status"] = "success"
            result["msg"] = "File uploaded successfully"
        else:
            result["msg"] = response["status"]["msg"]
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        result["msg"] = str(e)
    context.end_span()
    return result


def get_all_resources(type,solution_id):
    response = dict(status="failure")
    if type is not None:
        query = dict(type=type, solution_id=solution_id)
    else:
        query = dict(solution_id=solution_id)
    data = MongoDbConn.find(RESOURCES_COLLECTION, query).sort("_id", -1)
    resources = []
    for resource in data:
        resource.pop("_id")
        resources.append(resource)
    response["status"] = "success"
    response["data"] = resources
    return response


def process_resources(request):
    payload = json.loads(request.body.decode())
    solution_id = common.get_solution_from_session(request)
    if request.method in ["POST","DELETE"]:
        payload["solution_id"] = solution_id
        if request.method == "POST":
            type = "ADD"
        else:
            type = "DELETE"
        return save_data_changes(payload,type)


def save_data_changes(payload,type):
    result = dict(status="failure")
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        rules = RuleManager()
        response = rules.process(RULES_ENDPOINT[type],payload)
        if response["status"]["success"]:
            result["status"] = "success"
            result["msg"] = "Data added successfully" if type == "ADD" else "Data deleted successfully"
        else:
            result["msg"] = response["status"]["msg"]
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        result["msg"] = str(e)
    context.end_span()
    return result


def process_workflow_files(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "GET":
            result = MongoDbConn.find(RESOURCES_COLLECTION,dict(type="camunda_workflow"))
            workflow_files = list()
            for file in result:
                 file.pop("_id")
                 workflow_files.append(file)
            return {"data":workflow_files,"status":"success"}
        elif request.method == "POST":
            payload = json.loads(request.body.decode())
            if "file_path" in payload:
                with open(payload["file_path"]) as fp:
                    xml_string = fp.read()
                return {"status": "success","xml_string" : xml_string}
            if "resource_id" in payload:
                file = MongoDbConn.find_one(RESOURCES_COLLECTION,dict(type="camunda_workflow",resource_id=payload["resource_id"]))
                if file is not None:
                    with open(file["file_path"], 'r+') as f:
                        f.read()
                        f.seek(0)
                        f.write(payload["xml_string"])
                        f.truncate()
                    return {"status":"success","msg":"Workflow updated successfully"}
            return {"status":"failure","msg":"Workflow update failed"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def process_workflow_api_spec(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "GET":
            print(API_GATEWAY_POST_JOB_URI+PLATFORM_SERVICE_SPECS)
            result = get(API_GATEWAY_POST_JOB_URI+PLATFORM_SERVICE_SPECS)
            return {"data":result,"status":"success"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "msg": str(e)}
    finally:
        context.end_span()


def get_sftp_files(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        # solution_id = get_solution_from_session(request)
        # sftpm = SFTPManager(solution_id)
        # file_list = sftpm.listdir(path="/{0}".format(solution_id))
        return {"status":"success","files":[]}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"success","files":[],"msg":"SFTP is not yet enabled for the solution"}
    finally:
        context.end_span()


def get_sftp_user_info(request,solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if not solution_id:
            solution_id = get_solution_from_session(request)
        # sftpm = SFTPManager(solution_id)
        # username = sftpm._get_username(solution_id)
        return {"status":"success","solution_id":solution_id,"username": ""}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status":"failure","msg":"SFTP is not yet enabled for the solution","solution_id":solution_id}
    finally:
        context.end_span()

def get_sftp_data(solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        # sftpm = SFTPManager(solution_id)
        # sftphost = sftpm.hostname
        # sftpuser = sftpm._get_username(solution_id)
        # sftppass = sftpm._get_password(solution_id)
        sftpworkingdir = "incoming_files"
        sftppath = ("{0}/".format(solution_id))
        return {"status": "success", "solution_id": solution_id, "sftphost": '', "sftpuser": '',
                "sftppass": '', "sftppath": sftppath, "sftpworkingdir": sftpworkingdir}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        return {"status": "failure", "error": e}
    finally:
        context.end_span()


def generate_preassigned_s3_url(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "POST":
            payload = json.loads(request.body.decode())
            method = payload["method"] if 'method' in payload else 'GET'
            content_type = payload["content_type"] if 'content_type' in payload else 'application/json'
            file_metadata = payload['file_metadata'] if 'file_metadata' in payload else None
            solution_id = payload['solution_id'] if 'solution_id' in payload else get_solution_from_session(request)
            if method == 'GET':
                key = payload["file_path"]
                url = StorageHandler.presigned_get_url(AMAZON_AWS_BUCKET, key)
                return {"status": "success", "solution_id": solution_id,
                        "aws_url": url, "status_code": STATUS_CODES["OK"]}
            upload_type = payload["upload_type"]
            file_name = payload["file_name"]
            file_name = "".join(file_name.split())
            file_id = str(uuid4())
            key = os.path.join(solution_id, "console", upload_type, file_id, file_name)
            if method == 'POST':
                url = StorageHandler.presigned_post_url(AMAZON_AWS_BUCKET, key)
                MongoDbConn.insert(UPLOADED_FILE_COLLECTION, {"solution_id": solution_id,
                                                              "key": key, "upload_type": upload_type,
                                                              "file_name": file_name,
                                                              "update_ts": datetime.utcnow().isoformat()})
                return {"status": "success", "solution_id": solution_id,
                        "aws_url": url, "status_code": STATUS_CODES["OK"]}
            elif method == 'PUT':
                url = StorageHandler.generate_presigned_url_to_upload(AMAZON_AWS_BUCKET, key,
                                                                      content_type=content_type,
                                                                      file_metadata=file_metadata)
                MongoDbConn.insert(UPLOADED_FILE_COLLECTION, {"solution_id": solution_id,
                                                              "key": key, "upload_type": upload_type,
                                                              "file_name": file_name,
                                                              "update_ts": datetime.utcnow().isoformat()})
                return {"status": "success", "solution_id": solution_id,
                        "aws_url": url, "status_code": STATUS_CODES["OK"]}
        else:
            return {"status": "failure", "error": "Request type not supported",
                    "status_code":STATUS_CODES['METHOD_NOT_ALLOWED']}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"status": "failure", "error": e,
                "status_code":STATUS_CODES["INTERNAL_SERVER_ERROR"]}
    finally:
        context.end_span()

def list_s3_files(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "POST":
            payload = json.loads(request.body.decode())
            upload_type = payload["upload_type"]
            solution_id = get_solution_from_session(request)
            key = os.path.join(solution_id, "console", upload_type)
            files = StorageHandler.get_directory_tree(AMAZON_AWS_BUCKET, key)
            files_dict = {}
            files_dict = {os.path.basename(file):file for file in files}
            return {"status": "success", "solution_id": solution_id,
                "files": files_dict, "status_code": STATUS_CODES["OK"]}
        else:
            return {"status": "failure", "error": "Request type not supported",
                "status_code": STATUS_CODES['METHOD_NOT_ALLOWED']}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        return {"status": "failure", "error": e,
                "status_code": STATUS_CODES["INTERNAL_SERVER_ERROR"]}
    finally:
        context.end_span()

def delete_s3_file(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        if request.method == "POST":
            solution_id = get_solution_from_session(request)
            payload = json.loads(request.body.decode())
            file_path = payload["file_path"]
            files = StorageHandler.delete(AMAZON_AWS_BUCKET, file_path)
            return {"status": "success", "solution_id": solution_id,
                    "status_code": STATUS_CODES["OK"]}
        else:
            return {"status": "failure", "error": "Request type not supported",
                    "status_code": STATUS_CODES['METHOD_NOT_ALLOWED']}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        tb = traceback.format_exc()
        return {"status": "failure", "error": e,
                "status_code": STATUS_CODES["INTERNAL_SERVER_ERROR"]}
    finally:
        context.end_span()



# if __name__ == '__main__':
#    solution_id = "qafix_f04b26a1-241b-4aad-a91d-0be28375df73"
#    SFTPManager.init_solution(solution_id)
#    sftpm = SFTPManager(solution_id)
#    username = sftpm._get_username(solution_id)
#    print(username)
#    file_list = sftpm.upload_file(upload_file_path="/home/thiru/Downloads/cms_csf.pdf",server_file_path="/{0}/cms_csf.pdf".format(solution_id))