import mimetypes, requests
import os, json, shutil
import traceback
from wsgiref.util import FileWrapper
from django.http import StreamingHttpResponse, JsonResponse, HttpResponse
from config_vars import MEDIA_ROOT, ROOT, DEFAULT_JSON_FOLDER, SOLN, API_GATEWAY_POST_JOB_URI, MOUNT_PATH, SFTP_HOME, \
    SERVICE_NAME
from uuid import uuid4
from django.core.files.storage import FileSystemStorage
from connections.mongodb import MongoDbConn
from jsonschema import Draft3Validator
from nifi_automation_script import trigger_on_services_change
from django.http import QueryDict
from xpms_common import trace

entity_schema = {}
tracer = trace.Tracer.get_instance(SERVICE_NAME)


def is_request_timeout(response):
    return True if response is not None and 'msg' in response.keys() and 'Timeout' == response['msg'] else False


def get_solution_from_session(request):
    if "solution_id" in request.session:
        return request.session['solution_id']
    else:
        # Testing for 504 error
        return request.META.get('HTTP_SID')


def get_user_id_from_session(request):
    if 'user_id' in request.session:
        return request.session['user_id']
    else:
        return None


def delete_files(folder=MEDIA_ROOT):
    try:
        for the_file in os.listdir(folder):
            file_path = os.path.join(folder, the_file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(e)
                print('failed to delete files')
    except:
        print("failed to delete files from media")


def get_file_contents(filename):
    src_file_name = get_application_path() + "/" + DEFAULT_JSON_FOLDER + "/" + filename
    with open(src_file_name, encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
        return data


def get_application_path():
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    idx = dname.rfind('/')
    return str(dname[0:idx])


def get_solutions():
    resp = MongoDbConn.find(SOLN['collection'], {'is_active': True})
    solutions_list = []
    if resp is not None:
        for sol in resp:
            sol['_id'] = str(sol['_id'])
            solutions_list.append(sol)
    return solutions_list


def save_to_folder(solution_id, uploaded_file, folder_path, doc_type, source_type, flag=False):
    resp = {"status": "success", "msg": "Uploaded Document template"}
    try:
        unique_folder = os.path.join(folder_path, solution_id, doc_type, str(uuid4()),source_type)
        if flag:
            fs = FileSystemStorage(location=unique_folder)
        else:
            fs = FileSystemStorage(location=ROOT + unique_folder)
        filename = fs.save(uploaded_file.name, uploaded_file)
        uploaded_file_url = str(unique_folder + "/" + filename).replace("%20", " ")
        if doc_type == 'binaries':
            extn_li = str(filename).rsplit(".", 1)
            if len(extn_li) > 1:
                extn = str(extn_li[1])
            else:
                extn = ''
        else:
            extn = str(str(filename).rsplit(".", 1)[1])
        relative_path = uploaded_file_url.split(folder_path)[1]
        resp["data"] = {"filename": filename, "extn": extn, "file_path": uploaded_file_url,"relative_path" : relative_path}
    except Exception as e:
        resp.update({"status": "failure", "msg": str(e), "data": None})
    return resp


def create_data(payload_data, file_data=None):
    data = dict()
    if payload_data is not None:
        post_dict = json.loads(json.dumps(payload_data))
        if "data" in post_dict.keys():
            field_data = json.loads(post_dict["data"])
        else:
            field_data = payload_data
        data.update({str(key): field_data[key] for key in field_data.keys()})
    if file_data is not None:
        data.update({str(key): file_data[key] for key in file_data.keys()})
    return data


def construct_dictionary(field, options):
    return {val: field[val] for val in options if val in field.keys()}


def get_amazon_url(bucket):
    return "https://" + bucket + ".s3.amazonaws.com/"


def is_draft_valid(schema, payload):
    try:
        return Draft3Validator(schema).is_valid(payload)
    except:
        return False


def download_file_from_efs(asset_path, solution_id):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        req_data = {"solution_id": solution_id, "file_path": asset_path}
        gateway_download_url = os.path.join(API_GATEWAY_POST_JOB_URI, "download/")
        data = requests.post(gateway_download_url, stream=True, data=json.dumps(req_data))
        idx = asset_path.rindex("/")
        directory = asset_path[0:idx] if (idx > -1) else ''
        file_name = asset_path[idx + 1:len(asset_path)] if (idx > -1) else asset_path
        file_path = MEDIA_ROOT + str(directory)
        if not os.path.exists(file_path):
            os.makedirs(file_path)
        with open(file_path + '/' + file_name, 'wb+') as outfile:
            data.raw.decode_content = True
            shutil.copyfileobj(data.raw, outfile)
            outfile.close()

        # Streaming data to download
        chunk_size = 8192
        file_path = file_path + '/' + file_name
        response = StreamingHttpResponse(FileWrapper(open(file_path, 'rb'), chunk_size),
                                         content_type=mimetypes.guess_type(file_path)[0])
        response['Content-Length'] = os.path.getsize(file_path)
        response['Content-Disposition'] = "attachment; filename=%s" % file_name
        delete_files()
        return response
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return JsonResponse({"status": "failure", "msg": "failed to download file " + str(e), "file_path": asset_path})
    finally:
        context.end_span()


"""
This function will fetch the file from efs
and save it to the system and return the absolute file_path
"""
def save_file_fetched_from_efs(asset_path, solution_id, context):
    """
    :param asset_path: relative file from entity service
    :param solution_id: session solution_id
    :return: absolute file path
    """
    try:
        req_data = {"solution_id": solution_id, "file_path": asset_path}
        gateway_download_url = os.path.join(API_GATEWAY_POST_JOB_URI, "download/")
        data = requests.post(gateway_download_url, stream=True, data=json.dumps(req_data))
        idx = asset_path.rindex("/")
        directory = asset_path[0:idx] if (idx > -1) else ''
        file_name = asset_path[idx + 1:len(asset_path)] if (idx > -1) else asset_path
        file_path = MEDIA_ROOT + str(directory)
        if not os.path.exists(file_path):
            os.makedirs(file_path)
        abs_file_path = file_path + '/' + file_name
        with open(abs_file_path, 'wb+') as outfile:
            data.raw.decode_content = True
            shutil.copyfileobj(data.raw, outfile)
            outfile.close()
        return abs_file_path
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return None


def check_service_version(service_details):
    # check file exists in efs
    try:
        file_sys = os.environ['SHARED_VOLUME']
        if os.path.exists(file_sys):
            if not file_sys.endswith("/"):
                file_sys += "/"

        file_sys += 'service_version.json'
        is_update_version = False
        is_first_run = False # skip trigger pipeline on first run
        if os.path.exists(file_sys):
            with open(file_sys, encoding='utf-8') as data_file:
                data = json.loads(data_file.read())
            data_file.close()
            if data['version'] != service_details['version']:
                print(data['version'])
                print(service_details['version'])
                print('services version has changed')
                is_update_version = True
        else:
            is_update_version = True
            is_first_run = True

        if is_update_version:
            service_version = {"version": service_details['version']}
            with open(file_sys, 'w', encoding='utf-8') as f:
                json.dump(service_version, f, ensure_ascii=False)
            f.close()
            if not is_first_run:
                trigger_on_services_change()

    except Exception as e:
        print(e)


def get_file_from_efs(solution_id, asset_path):
    try:
        req_data = {"solution_id": solution_id, "file_path": asset_path}
        gateway_download_url = os.path.join(API_GATEWAY_POST_JOB_URI, "download/")
        data = requests.post(gateway_download_url, stream=True, data=json.dumps(req_data))
        idx = asset_path.rindex("/")
        directory = asset_path[0:idx] if (idx > -1) else ''
        file_name = asset_path[idx + 1:len(asset_path)] if (idx > -1) else asset_path
        file_path = MEDIA_ROOT + str(directory)
        if not os.path.exists(file_path):
            os.makedirs(file_path)
        with open(file_path + '/' + file_name, 'wb+') as outfile:
            data.raw.decode_content = True
            shutil.copyfileobj(data.raw, outfile)
            outfile.close()

        return file_path + '/' + file_name
    except:
        return asset_path


def construct_table(element):
    resp = dict()
    try:
        essential_fields = ["table_name", "type", "field_type"]
        resp.update({key: element[key] for key in essential_fields if key in element})
        headers = list()
        row_list = []
        col_list = element['columns']
        for col in col_list:
            if col["name"] not in ["subheaders"]:
                headers.append([col["name"]])
            i = 0
            for val in col['value']:
                if len(row_list) == i:
                    row_list.append(dict())
                row_data = row_list[i]
                row_data[col['name']] = val
                i += 1
        resp["table"] = row_list
        resp["headings"] = headers
    except Exception as e:
        resp.update({"error": str(e), "table": []})
    return resp


def construct_json(document, fields):
    resp = dict()
    for field in fields:
        key, value = get_value(document, field)
        if key is not None:
            resp[key] = value
    return resp


def get_pagination_details(filter_obj, sort_by, order_by_asc, skip, limit):
    # TODO to remove the below sort by condition once UI is fixed
    if 'sort_by' in filter_obj and filter_obj["sort_by"] != "ts":
        sort_by = filter_obj['sort_by']
    if 'order_by' in filter_obj and isinstance(filter_obj['order_by'], bool) and filter_obj['order_by']:
        order_by_asc = 1
    if 'page_no' in filter_obj and filter_obj['page_no'] > 0 and filter_obj['no_of_recs'] > 0:
        skip = (filter_obj['page_no'] - 1) * filter_obj['no_of_recs']
    if 'no_of_recs' in filter_obj:
        limit = filter_obj['no_of_recs']
    return sort_by, order_by_asc, skip, limit


def get_value(document, field, processed_key=None):
    try:
        if "." in str(field):
            keys = str(field).split(".", 1)
        else:
            keys = [field]
        itm = keys[0].strip()
        if isinstance(document, dict) and itm in document.keys():
            if len(keys) == 1:
                return itm, document[itm]
            else:
                return get_value(document[itm], str(keys[1]), processed_key=itm)
        elif isinstance(document, list) and is_int(itm):
            if len(keys) == 1 and len(document) > 0:
                return processed_key, document[int(itm)]
            else:
                return get_value(document[int(itm)], str(keys[1]), processed_key=processed_key)
        else:
            return None, None
    except:
        return None, None


def read_multiple_files(request):
    files_query_dict = QueryDict('', mutable=True)
    files_query_dict.update(request.FILES)
    files_list = dict(files_query_dict)
    return files_list


def is_int(s):
    try:
        int(s)
        return True
    except ValueError:
        return False


def download_file(data, doc_id):
    try:
        file_path = MEDIA_ROOT + str(doc_id + ".json")
        with open(file_path, 'w') as outfile:
            json.dump(data, outfile)
            outfile.close()
        # Streaming data to download
        chunk_size = 8192
        response = StreamingHttpResponse(FileWrapper(open(file_path, 'rb'), chunk_size),
                                         content_type=mimetypes.guess_type(file_path)[0])
        response['Content-Length'] = os.path.getsize(file_path)
        response['Content-Disposition'] = "attachment; filename=%s" % str(doc_id + ".json")
        return response
    except Exception as e:
        print(str(e))


def download_nonjson_files(file_path):
    try:
        file_name = os.path.basename(file_path)
        # Streaming data to download
        chunk_size = 8192
        response = HttpResponse(FileWrapper(open(file_path, 'rb'), chunk_size),
                                         content_type=mimetypes.guess_type(file_path)[0])
        response['Content-Length'] = os.path.getsize(file_path)
        response['Content-Disposition'] = "attachment; filename=%s" % file_name
        delete_files()
        return response
    except Exception as e:
        return JsonResponse({"status": "failure", "msg": "failed to download file " + str(e),
                             "file_path": file_path})


def get_mountpath_fromsftp(solution_id,sftp_path):
    relative_path = SFTP_HOME + solution_id +"/" + sftp_path
    file_path = MOUNT_PATH + relative_path
    file_name = os.path.basename(file_path)
    return {"file_path" : file_path,"relative_path" : relative_path,"file_name" : file_name}