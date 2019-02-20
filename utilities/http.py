import requests, json, uuid, traceback, os, mimetypes, time
from datetime import datetime
from django.http import StreamingHttpResponse
from wsgiref.util import FileWrapper
from config_vars import API_GATEWAY_POST_JOB_URI, API_GATEWAY_JOB_STATUS_URI, TRAINING_SET_URL, TRAINING_SET_POST, \
    MEDIA_ROOT, INSIGHT_CONFIG, JOB_COLLECTION
from connections.mongodb import MongoDbConn
from connections.s3conn import S3
from utilities.common import get_amazon_url
import math

headers = {'Content-Type': 'application/json'}
create_rule_endpoint = ""


def get(url, headers1=headers):
    resp = dict()
    resp['status'] = 'failure'
    try:
        r = requests.get(url, headers=headers1)
        if r.status_code == 200:
            try:
                response_json = json.loads(r.text)
            except:
                response_json = ""
            resp['status'] = 'success'
            resp['result'] = response_json
        else:
            resp['msg'] = r.text
        resp['status_code'] = r.status_code
    except Exception as e:
        print(str(e))
        print('Failed in processing GET API (' + url + ')')
    return resp


def post(url, payload, headers1=headers):
    resp = dict()
    resp['status'] = 'failure'
    try:
        r = requests.post(url, data=json.dumps(payload), headers=headers1)
        response_json = json.loads(r.text)
        if int(r.status_code) == 200:
            resp['status'] = 'success'
            resp['result'] = response_json
        else:
            resp['msg'] = r.text
        resp['status_code'] = r.status_code
    except:
        print('Failed in processing POST API (' + url + ')')
    return resp


def put(url, payload, headers1=headers):
    resp = dict()
    resp['status'] = 'failure'
    try:
        r = requests.put(url, data=json.dumps(payload), headers=headers1)
        response_json = json.loads(r.text)
        if int(r.status_code) == 200:
            resp['status'] = 'success'
            resp['result'] = response_json
        else:
            resp['msg'] = r.text
        resp['status_code'] = r.status_code
    except:
        print('Failed in processing POST API (' + url + ')')
    return resp


def delete(url, headers1=headers):
    resp = dict()
    resp['status'] = 'failure'
    try:
        r = requests.delete(url, headers=headers1)
        response_json = json.loads(r.text)
        if int(r.status_code) == 200:
            resp['status'] = 'success'
            resp['result'] = response_json
        else:
            resp['msg'] = r.text
        resp['status_code'] = r.status_code
    except:
        print('Failed in processing DELETE API (' + url + ')')
    return resp


def get_success_response(msg):
    resp = dict()
    resp['status'] = 'success'
    if msg is None:
        msg = 'Success'
    resp['msg'] = msg


def get_failure_response(msg):
    resp = dict()
    resp['status'] = 'failure'
    if msg is None:
        msg = 'Failed'
    resp['msg'] = msg
    return resp


def post_job(endpoint, data, timeout=300):
    dt = datetime.now()
    job_res = post(API_GATEWAY_POST_JOB_URI + endpoint, data)
    if is_exists(job_res, 'result') and is_exists(job_res['result'], 'job_id'):
        job_id = job_res['result']['job_id']
        i = 1
        while True:
            time.sleep(math.pow(1.5, i))
            curr_date = datetime.now()
            if (curr_date - dt).total_seconds() > timeout:
                return {'success': False, 'msg': 'Timeout', "job_id":job_id}
            resp = get(API_GATEWAY_JOB_STATUS_URI + job_id)
            if is_exists(resp, 'result') and is_exists(resp['result'], 'process_status'):
                if (resp['result'])['process_status'] == 'processed':
                    resp["job_id"] = job_id
                    return resp
            if i > 6:
                i = 1
            else:
                i += 1
    return job_res


def is_exists(data, key):
    try:
        if "." in key:
            keys = key.split(".")
        else:
            keys = [key]

        for itm in keys:
            if isinstance(data, list):
                if data != [] and itm in data[0].keys() and data[0][itm] is not None:
                    return True
            else:
                if data is not None and itm in data.keys() and data[itm] is not None:
                    return True
            return False
    except:
        return False


def get_nested_value(document, field):
    try:
        if "." in str(field):
            keys = str(field).split(".", 1)
        else:
            keys = [field]
        itm = keys[0].strip()
        if isinstance(document, dict) and itm in document.keys():
            if len(keys) == 1:
                return document[itm]
            else:
                return get_nested_value(document[itm], str(keys[1]))
        elif isinstance(document, list) and is_int(itm):
            if len(keys) == 1 and len(document) > 0:
                return document[int(itm)]
            else:
                return get_nested_value(document[int(itm)], str(keys[1]))
        else:
            return None
    except:
        return None


def is_int(s):
    try:
        int(s)
        return True
    except ValueError:
        return False


def is_message_published(response):
    result = response['result'] if response is not None and 'result' in response.keys() else None
    if result is not None and 'status' in result.keys() and result['status']['success']:
        return True
    return False


def get_response(response):
    result = response['result'] if response is not None and 'result' in response.keys() else None
    if result is None or 'status' not in result.keys():
        return False, {'success': False, 'msg': 'Not a valid response', 'error': result}
    if result['status']['success']:
        return True, None
    return False, result['status']


def post_s3(file_name, file_path, aws_bucket, aws_path):
    resp = dict()
    try:
        data = open(file_path, 'rb')
        uid = str(uuid.uuid4())
        path = aws_path + uid + '/' + file_name
        bucket = S3.Bucket(aws_bucket)
        bucket.put_object(Key=path, Body=data)
        data.close()
        resp['status'] = 'success'
        resp['msg'] = 'File uploaded'
        resp['url'] = get_amazon_url(aws_bucket) + path
        resp['key'] = path
    except:
        traceback.print_exc()
        resp['status'] = 'failure'
        resp['msg'] = "Error in File Upload"
    return resp


def post_to_ms(file_name, path, extn, solution_id):
    data = dict()
    data['solution_id'] = solution_id
    data['training_set_name'] = file_name
    data['training_set_url'] = path
    data['training_set_type'] = extn
    resp = post(TRAINING_SET_URL + TRAINING_SET_POST, payload=data)
    return resp


def s3_delete(aws_bucket, key):
    resp = dict()
    try:
        bucket = S3.Bucket(aws_bucket)
        bucket.delete_objects(Delete={'Objects': [{'Key': key}]})
        resp['status'] = 'success'
        resp['msg'] = 'File deleted'
    except:
        traceback.print_exc()
        resp['status'] = 'failure'
        resp['msg'] = "Error in File delete"
    return resp


def download_file(bucket_name, asset_path):
    file = (S3.Object(bucket_name, asset_path))
    data = file.get()['Body'].read()
    idx = asset_path.rindex("/")
    directory = asset_path[0:idx] if (idx > -1) else ''
    file_name = asset_path[idx + 1:len(asset_path)] if (idx > -1) else asset_path
    file_path = MEDIA_ROOT + str(directory)
    if not os.path.exists(file_path):
        os.makedirs(file_path)
    with open(file_path + '/' + file_name, 'wb+') as outfile:
        outfile.write(data)

    # Streaming data to download
    chunk_size = 8192
    file_path = file_path + '/' + file_name
    response = StreamingHttpResponse(FileWrapper(open(file_path, 'rb'), chunk_size),
                                     content_type=mimetypes.guess_type(file_path)[0])
    response['Content-Length'] = os.path.getsize(file_path)
    response['Content-Disposition'] = "attachment; filename=%s" % file_name
    os.remove(file_path)
    return response


def send_get_insight_job(req_data):
    response = post_job(INSIGHT_CONFIG['get_insight'], req_data, timeout=45)
    if not is_request_timeout(response):
        status, result = get_response(response)
        if status:
            req_data['data'] = {'insight_id': get_nested_value(response, "result.result.metadata.insight_id"),
                                'request_type': 'default'}

            response = post_job(INSIGHT_CONFIG['get_insight'], req_data, timeout=420)
            if not is_request_timeout(response):
                status, result = get_response(response)
                if status:
                    data = get_nested_value(response, "result.result.metadata")
                    if 'insights' in data.keys() and len(data['insights']) > 0:
                        return {'status': 'success', 'msg': 'Get insight response', 'data': data}
                else:
                    return result
            else:
                return {'status': 'failure', 'msg': 'Request timed out'}
        else:
            return result

    return {'status': 'failure', 'msg': 'Request timed out'}


def is_request_timeout(response):
    return True if response is not None and 'msg' in response.keys() and 'Timeout' == response['msg'] else False


def process_jobs():
    try:
        job = MongoDbConn.find_one(JOB_COLLECTION, {"is_complete": False})
        print("Running " + job["name"] + " job.")
        response = post_job(job["endpoint"], job["data"])
        result = get_nested_value(response, job["key"])
        if result and len(result) > 0:
            for entity in result:
                query = {"solution_id": job["solution_id"]}
                query.update({a: entity[a] for a in job["unique_keys"]})
                MongoDbConn.update(job['collection'], query, entity)
        MongoDbConn.update(JOB_COLLECTION, {"_id": job["_id"]}, {"is_complete": True})
    except Exception as e:
        print(str(e))


def create_job(endpoint, data):
    job_res = post(API_GATEWAY_POST_JOB_URI + endpoint, data)
    try:
        return dict(job_res['result'])['job_id']
    except:
        pass
    return None


def check_job(job_id):
    resp = get(API_GATEWAY_JOB_STATUS_URI + job_id)
    try:
        if dict(resp['result'])['process_status'] == 'processed':
            return resp
    except:
        pass
    return None
