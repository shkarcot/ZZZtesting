import os
import json
import requests

headers = {
    'Accept': 'application/vnd.go.cd.v5+json',
    'Content-Type': 'application/json'
}

patch_headers = {
    'Accept': 'application/vnd.go.cd.v2+json',
    'Content-Type': 'application/json'
}

SWARM_MANAGER_IP = os.environ['SWARM_MANAGE_IP'] if 'SWARM_MANAGE_IP' in os.environ else ''
SHARED_VOL = os.environ['SHARED_VOLUME'] if 'SHARED_VOLUME' in os.environ else ''
GOCD_ENVIRONMENT_NAME = 'platform-env-vars'
PIPELINE_GROUP = 'platform-xpms'
AUTH = None
GOCD_USER_NAME = os.environ['GOCD_USER_NAME'] if 'GOCD_USER_NAME' in os.environ else None
GOCD_PASSWORD = os.environ['GOCD_PASSWORD'] if 'GOCD_PASSWORD' in os.environ else None
if GOCD_USER_NAME is not None and GOCD_PASSWORD is not None:
    AUTH = (GOCD_USER_NAME, GOCD_PASSWORD)
REF_PIPELINE = 'nifi-server'
CLEAN_CONTAINER_PIPELINE = 'cleanup-solution-nifi-containers'
DEF_URL = 'localhost'
GOCD_PORT = ':8153'
GOCD_PROTO = 'http://'

GOCD_URL = GOCD_PROTO + os.environ['GOCD_DNS'] if 'GOCD_DNS' in os.environ else (GOCD_PROTO + DEF_URL)
GOCD_URL = GOCD_URL + GOCD_PORT + '/go/api/'
ADMIN_PIPELINES_URI = 'admin/pipelines'
CREATE_NIFI_PIPELINE_API = GOCD_URL + ADMIN_PIPELINES_URI
UNPAUSE_NIFI_PIPELINE_API = GOCD_URL + 'pipelines/'
DELETE_NIFI_PIPELINE_API = GOCD_URL + ADMIN_PIPELINES_URI
UPDATE_ENVIRONMENT_API = GOCD_URL + 'admin/environments/' + GOCD_ENVIRONMENT_NAME

NIFI_SERVICE_PROCESSORS_PIPELINE = 'service-nifi-processors'
API_PROXY_PIPELINE = 'api-mq-gateway'
ARTIFACTORY_URL = 'https://xpmsai.jfrog.io/xpmsai/xpms-platform-nifi-release/'
SHARED_VOLUME = os.environ['SHARED_VOLUME']
NIFI_FOLDER_PREFIX = ''
SHARED_VOLUME = SHARED_VOLUME if SHARED_VOLUME.endswith("/") else SHARED_VOLUME + '/'
SHARED_VOLUME += NIFI_FOLDER_PREFIX
NIFI_BRANCH = os.environ['NIFI_BRANCH'] if 'NIFI_BRANCH' in os.environ else 'develop'
NIFI_VERSION = '-' + os.environ['NIFI_VERSION'] if 'NIFI_VERSION' in os.environ else ''


def get_request(uri, request_headers):
    if AUTH is not None:
        return requests.get(uri, headers=request_headers, auth=AUTH)
    else:
        return requests.get(uri, headers=request_headers)


def delete_request(uri, request_headers):
    if AUTH is not None:
        return requests.delete(uri, headers=request_headers, auth=AUTH)
    else:
        return requests.delete(uri, headers=request_headers)


def post_request(uri, request_headers, data):
    if AUTH is not None:
        return requests.post(uri, headers=request_headers, auth=AUTH, data=data)
    else:
        return requests.post(uri, headers=request_headers, data=data)


def patch_request(uri, request_headers, data):
    if AUTH is not None:
        return requests.patch(uri, headers=request_headers, auth=AUTH, data=data)
    else:
        return requests.patch(uri, headers=request_headers, data=data)


def get_default_nifi_pipeline_config():
    with open('default_nifi_pipeline_config.json', encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
        return data


def get_default_nifi_pipeline_config_from_api(pipeline_name):
    print(pipeline_name)
    print(AUTH)
    resp = get_request(GOCD_URL + ADMIN_PIPELINES_URI + '/' + pipeline_name, request_headers=headers)
    status_code = resp.status_code
    if status_code == 200:
        response_json = json.loads(resp.text)
        return status_code, response_json
    else:
        print(status_code)
        print('Error Response from get default nifi pipeline config : '+resp.text)
        return status_code, None


def set_pipeline_env_vars(def_nifi_pipeline, solution_id):
    env_vars = def_nifi_pipeline['environment_variables']
    for val in env_vars:
        if val['name'] == 'DOCKER_IMAGE_NAME':
            val['value'] = val['value']
        elif val['name'] == 'PROJECT_NAME':
            val['value'] = def_nifi_pipeline['name']
    env_vars.append({'name': 'SOLUTION_ID', 'value': solution_id, 'secure': False})


def get_deployment_mode():
    return os.environ['DEPLOY_MODE'] if 'DEPLOY_MODE' in os.environ else ""


def launch_nifi_docker(solution_id, project_name):
    try:
        cmd = 'sh ' + os.getcwd() +"/nifi_docker_launch.sh " + SWARM_MANAGER_IP + ' ' + solution_id + ' ' + project_name + ' ' + SHARED_VOL
        print(cmd)
        os.system(cmd)
    except Exception as e:
        print(e)


def launch_nifi_rancher(solution_id, solution_name):
    variables_list = ["STACK_NAME","DOMAIN_NAME","SOLUTION_ID","DB_AUTH_NM_MONGO","DB_HOST_MONGO","DB_PORT_MONGO",
                      "DB_USERID_MONGO","DB_PASSWORD_MONGO","EX_HOST_QUEUE","EX_PORT_QUEUE","EX_USERID_QUEUE",
                      "EX_PASSWORD_QUEUE","MESSAGE_EXCHANGE", "REDIS_HOST", "REDIS_NOAUTH_PORT"]
    rancher_cmd = "/src/rancher-v0.6.11/rancher"
    nifi_catalog_id = os.environ['NIFI_CATALOG_ID'] if 'NIFI_CATALOG_ID' in os.environ else "xpms:nifi:0"

    # creating answers file with solution_id
    environment_string = ""
    for variable in variables_list:
        if environment_string != "":
            environment_string += "\n"
        if variable == "SOLUTION_ID":
            environment_string += "SOLUTION_ID={0}".format(solution_id)
        else:
            environment_string += str(variable + "=" + os.getenv(variable,""))
    answers_filename = "/solutions/{0}/answers.txt".format(solution_name)

    os.makedirs(os.path.dirname(answers_filename), exist_ok=True)

    if 'STACK_NAME' in os.environ:
        solution_name = os.environ['STACK_NAME'] + '-' + solution_name

    with open(answers_filename, 'a') as f:
        f.write(environment_string)

    # command to install nifi on Rancher
    try:
        cmd = "{0} catalog install --name {1} --answers {2} {3}".format(rancher_cmd, solution_name, answers_filename, nifi_catalog_id)
        os.system(cmd)
    except Exception as e:
        print(e)

    # cleanup answers_file
    # os.remove(answers_filename)


def create_nifi_pipeline_config(solution_id, solution_name):
    try:
        deploy_mode = get_deployment_mode()
        if deploy_mode == 'RANCHER':
            return launch_nifi_rancher(solution_id, solution_name)

        if deploy_mode == 'DOCKER':
            return launch_nifi_docker(solution_id, solution_name)

        download_flow_config_from_artifactory(solution_id)
        def_nifi_pipeline = get_default_nifi_pipeline_config()
        if def_nifi_pipeline is not None:
            data = dict()
            def_nifi_pipeline['materials'][0]['branch'] = NIFI_BRANCH
            def_nifi_pipeline['name'] = solution_name + '-' + def_nifi_pipeline['name']
            data['group'] = PIPELINE_GROUP
            set_pipeline_env_vars(def_nifi_pipeline, solution_id)
            data['pipeline'] = def_nifi_pipeline
            resp = post_request(CREATE_NIFI_PIPELINE_API, request_headers=headers, data=json.dumps(data))
            if resp.status_code == 200:
                print('Create new pipeline for '+solution_name)
                add_pipeline_to_environment(def_nifi_pipeline['name'])
                unpause_pipeline(def_nifi_pipeline['name'])
                schedule_pipeline(def_nifi_pipeline['name'])
            else:
                print(resp.status_code)
                print('Error Response from create new nifi pipeline config : ' + resp.text)
    except Exception as e:
        print(str(e))


def add_pipeline_to_environment(pipeline_name):
    data = dict()
    data['pipelines'] = {"add": [pipeline_name]}
    resp = patch_request(UPDATE_ENVIRONMENT_API, request_headers=patch_headers, data=json.dumps(data))
    if resp.status_code == 200:
        print('Updated Environment with pipeline name '+pipeline_name)
    else:
        print(resp.status_code)
        print('Error Response from update environment nifi pipeline config : ' + resp.text)


def unpause_pipeline(pipeline_name):
    unpause_headers = {
        'Confirm': 'true',
    }
    resp = post_request(UNPAUSE_NIFI_PIPELINE_API + pipeline_name + '/unpause',
                        request_headers=unpause_headers, data={})
    if resp.status_code == 200:
        print('unpaused pipeline '+pipeline_name)
    else:
        print(resp.status_code)
        print('Error Response from unpause pipeline config : ' + resp.text)


def remove_nifi_stack(solution_name):
    rancher_cmd = "/src/rancher-v0.6.11/rancher"
    try:
        if 'STACK_NAME' in os.environ:
            solution_name = os.environ['STACK_NAME'] + '-' + solution_name

        cmd = "{0} rm --type stack {1}".format(rancher_cmd, solution_name)
        os.system(cmd)
        return True
    except Exception as e:
        print(e)
    return False


def remove_nifi_pipeline_config(pipeline_name):
    try:
        deploy_mode = get_deployment_mode()
        if deploy_mode == 'RANCHER':
            return remove_nifi_stack(pipeline_name)

        pipeline_name = pipeline_name + '-' + REF_PIPELINE
        remove_pipeline_from_environment(pipeline_name)
        print(GOCD_URL + ADMIN_PIPELINES_URI +'/'+ pipeline_name)
        resp = delete_request(GOCD_URL + ADMIN_PIPELINES_URI +'/'+pipeline_name, request_headers=headers)
        if resp.status_code == 200:
            print('Removed pipeline from the configuration '+pipeline_name)
        else:
            print(resp.status_code)
            print('Error response from remove pipeline ' + resp.text)
    except Exception as e:
        print(str(e))


def remove_pipeline_from_environment(pipeline_name):
    data = dict()
    data['pipelines'] = {"remove": [pipeline_name]}
    resp = patch_request(UPDATE_ENVIRONMENT_API, request_headers=patch_headers, data=json.dumps(data))
    if resp.status_code == 200:
        print('Removed pipeline from the environment '+pipeline_name)
        schedule_remove_nifi_from_cluster(pipeline_name)
        return True
    else:
        print(resp.status_code)
        print('Error Response from delete pipeline from environment ' + resp.text)
        return False


def schedule_pipeline(pipeline_name, data=None):
    schedule_headers = {
        'Confirm': 'true',
    }
    resp = post_request(UNPAUSE_NIFI_PIPELINE_API + pipeline_name + '/schedule',
                        request_headers=schedule_headers,
                        data=data)
    if resp.status_code == 202:
        print('scheduled pipeline ' + pipeline_name)
    else:
        print(resp.status_code)
        print('Error Response from schedule pipeline config : ' + resp.text)


def schedule_remove_nifi_from_cluster(solution_id):
    def_pipeline_config = get_default_nifi_pipeline_config()
    if def_pipeline_config is not None:
        env_vars = def_pipeline_config['environment_variables']
        ref_name = solution_id
        for val in env_vars:
            if val['name'] == 'DOCKER_IMAGE_NAME':
                schedule_pipeline(CLEAN_CONTAINER_PIPELINE,
                                  'variables[DOCKER_IMAGE_NAME]='+val['value']+'/'+ref_name)
                break


def trigger_on_services_change():
    schedule_pipeline(API_PROXY_PIPELINE)
    schedule_pipeline(NIFI_SERVICE_PROCESSORS_PIPELINE)


def download_flow_config_from_artifactory(solution_id):
    # version = os.environ['release_version']
    flow_file_name = 'flow'+ NIFI_VERSION
    response = requests.get(ARTIFACTORY_URL + '/'+flow_file_name+'.xml.gz', auth=(os.environ['JFROG_USERNAME'],
                                                                                os.environ['JFROG_PASSWORD']))
    flow_config = response.content
    if not os.path.exists(SHARED_VOLUME + solution_id):
        os.mkdir(SHARED_VOLUME + solution_id)
    with open(SHARED_VOLUME + solution_id + '/flow.xml.gz', 'wb') as flow_file:
        flow_file.write(flow_config)

#print(get_default_nifi_pipeline_config_from_api(CLEAN_CONTAINER_PIPELINE))
#remove_nifi_pipeline_config('solution')
#create_nifi_pipeline_config('test_3bd8a330-dd80-4d53-a596-3b3083222fe0', 'test')
#schedule_pipeline(CLEAN_CONTAINER_PIPELINE)
#schedule_remove_nifi_from_cluster('pra_test')
#schedule_pipeline('default-nifi-server')
#download_flow_config_from_artifactory('sample_nifi_123')
