import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from config_vars import UPLOAD_COLLECTION, RULES_CONFIG, AMAZON_AWS_BUCKET, ENTITY_CONFIG, MOUNT_PATH
from services.case_queue import case_queue_services, case_assignment_service, \
    get_child_documents, get_workflow_variables, implement_workflow_case_queues, workflow_management_service, \
    fetch_case_object, fetch_case_variables, fetch_case_queue_rules, create_doc_var_json, case_management_wf_service
from services.charts import chart_data, chart_selectors
from services.custom_functions import ConsoleFaaS
from services.custom_threshold import custom_threshold, insert_threshold
from services.dashboard import generate_data, get_json_download, get_charts, get_dashboard_queues_info, \
    get_dashboard_docs, case_management_dashboard_service, fetch_agents
from services.document_templates import document_template_service, post_process_rules, templates_fields, \
    process_test_documents, get_doc_types
from services.document_templates_train import template_train_upload_post, template_train_upload_get, \
    template_train_trigger
from services.documents import documents_data, document_data, process_text_feedback, page_group_review, \
    get_document_details, download_document_json, fetch_sections_data, process_entity_linking, process_entity_feedback, \
    process_complete_review, save_threshold_data, update_queue_extracted_feedback, change_doc_state
from services.entity import upload_owl_data, config_from_endpoint, entity_save, \
    entity_get, entity_delete, entity_upload, entity_download, get_attributes_thresholds, get_count, get_entities
from services.feedback import feedback, retrain_model, review_model, update_intent_review
from services.insight import insight_request
from services.models import process_models, process_learning_datasets, get_learn_configs, \
    custom_notebook_session, get_binaries, get_previous_run_details, process_learning_binaries, \
    download_results, update_learning_binary
from services.ner_service import NERConsole
from services.nlp import process_training_set_models, post_training_set, nlpEngine_processors
from services.pipeline import update_s3_bucket, pipeline_params, email_service, pl_status, \
    ingest_file, get_pipelines
from services.queue_doc_mapper import QueueDocMapper
from services.resource import upload_training_set, invoke_files_download, save_uploaded_files, process_workflow_files, \
    process_resources, process_workflow_api_spec, get_sftp_files, process_term_data, get_sftp_user_info, \
    get_sftp_data, process_tags, process_hierarchy, generate_preassigned_s3_url, list_s3_files, delete_s3_file
from services.review import get_review_data, post_review_data, generate_review_list, get_intent
from services.rules import create_rules, get_rules, rules_execution_test, get_config
from services.rules import rules_config, process_rules, execute_rules, process_custom_rules, execute_custom_rules
from services.service_catalog import services_util, train_set_upload, create_new_service, test_job_status
from services.solutions import solution_request, get_solution_id
from services.source_services import SourcesServices
from services.tables import tables_services
from services.template import save_template_element, ingest_template, get_template, update_template, \
    delete_template_element, save_unknown_template
from services.tenants import tenants_active
from services.uam import auth_user, auth_user_info
from services.user_services import UserServices
from services.ontology import Ontology
from utilities.common import get_solution_from_session, download_file_from_efs, save_to_folder


@csrf_exempt
def auth(request):
    return JsonResponse(auth_user(request))


@csrf_exempt
def auth_info(request):
    return JsonResponse(auth_user_info(request))


@csrf_exempt
def solution_config(request, endpoint="", file_type="json"):
    solution_id = get_solution_from_session(request)
    config = config_from_endpoint(ENTITY_CONFIG, endpoint)
    if request.method == 'POST':
        if len(request.FILES) != 0:
            return JsonResponse(entity_upload(request.FILES['file'], solution_id, config))
        else:
            payload = json.loads(request.body.decode())
            return JsonResponse(entity_save(solution_id, payload, config))
    elif request.method == 'GET':
        if "download" in request.get_full_path():
            response = entity_download(solution_id, file_type, config)
            if response['status'] == "success":
                return download_file_from_efs(response["file_path"], solution_id)
            else:
                return JsonResponse(response)
        else:
            return JsonResponse(entity_get(solution_id, config, endpoint), safe=False)
    elif request.method == 'DELETE':
        payload = json.loads(request.body.decode())
        return JsonResponse(entity_delete(payload, solution_id, config))


@csrf_exempt
def get_all_entities(request):
    solution_id = get_solution_from_session(request)
    return JsonResponse(get_entities(solution_id, request), safe=False)


@csrf_exempt
def entity_defnitions(request):
    return JsonResponse(upload_owl_data(request), safe=False)


@csrf_exempt
def load_training_data(request):
    return JsonResponse(upload_training_set(request), safe=False)


def rulesConfig_operators(request):
    return rules_config()


@csrf_exempt
def solution(request, sol_info=''):
    return JsonResponse(solution_request(request, sol_info), safe=False)


@csrf_exempt
def get_solution(request):
    return JsonResponse(get_solution_id(request), safe=False)


@csrf_exempt
def get_template_counts(request):
    return JsonResponse(get_count(request), safe=False)


@csrf_exempt
def insight_service(request, type):
    return insight_request(request, type)


@csrf_exempt
def training_set_models(request, type):
    return JsonResponse(process_training_set_models(request, type), safe=False)


@csrf_exempt
def create_training_set(request):
    return JsonResponse(post_training_set(request))


def platformConfig_nlpEngine_processors(request):
    return JsonResponse(nlpEngine_processors())


@csrf_exempt
def document_templates(request, template_id=""):
    return document_template_service(request, template_id=template_id)


@csrf_exempt
def document_templates_fields(request):
    return JsonResponse(templates_fields(request), safe=False)


@csrf_exempt
def test_documents(request, doc_id):
    return JsonResponse(process_test_documents(request, doc_id), safe=False)


@csrf_exempt
def get_processed_data(request, selector, doc_type, query=""):
    if request.method == "GET":
        return generate_data(get_solution_from_session(request), selector=selector,
                             doc_type=doc_type, query_string=query)


@csrf_exempt
def get_record_data(request, selector, doc_type, file_flow_id, direction, query=""):
    if request.method == "GET":
        return generate_data(get_solution_from_session(request), file_id=file_flow_id,
                             doc_type=doc_type, direction=direction, rec_selector=selector,
                             query_string=query)


@csrf_exempt
def json_download(request, file_flow_id):
    if request.method == "GET":
        return get_json_download(file_flow_id)


@csrf_exempt
def get_review(request, status, doc_type, file_flow_id, direction, query=""):
    if request.method == "GET":
        return JsonResponse(get_review_data(get_solution_from_session(request), file_id=file_flow_id, status=status,
                                            doc_type=doc_type, direction=direction, query_string=query), safe=False)


@csrf_exempt
def intent(request, doc_id):
    if request.method == "GET" and doc_id != "" and "/intent/" in request.get_full_path():
        return get_intent(doc_id)


@csrf_exempt
def post_review(request, file_flow_id):
    if request.method == "POST":
        payload = json.loads(request.body.decode())
        return post_review_data(payload, file_flow_id)


@csrf_exempt
def review_list(request, status, doc_type, query=""):
    try:
        if request.method == "GET":
            return JsonResponse(generate_review_list(get_solution_from_session(request),
                                                     status, doc_type, query), safe=False)
    except Exception as e:
        print(str(e))
        import traceback;
        traceback.print_exc()


@csrf_exempt
def active_tenants(request):
    return tenants_active(request)


@csrf_exempt
def get_chart(request, chart_id, selector):
    if request.method == "GET":
        return JsonResponse(chart_data(chart_id, selector, get_solution_from_session(request)), safe=False)


@csrf_exempt
def get_selectors(request):
    if request.method == "GET":
        return JsonResponse(chart_selectors(), safe=False)


@csrf_exempt
def get_document_types(request):
    if request.method == "GET":
        solution_id = get_solution_from_session(request)
        return JsonResponse(get_doc_types(solution_id), safe=False)


@csrf_exempt
def grouping_review(request, doc_id):
    return JsonResponse(page_group_review(request, doc_id))


@csrf_exempt
def download_training_data(request, doc_id=""):
    solution_id = get_solution_from_session(request)
    path = request.get_full_path()
    if "download/efs/" in path:
        asset_path = path.rsplit("download/efs/", 1)[1]
        # payload = json.loads(request.body.decode())
        return download_file_from_efs(asset_path, solution_id)
    else:
        return invoke_files_download(doc_id)


@csrf_exempt
def email_details(request):
    return JsonResponse(email_service(request), safe=False)


@csrf_exempt
def pipeline_settings(request):
    if request.method == "GET":
        return JsonResponse(pipeline_params(get_solution_from_session(request)))


@csrf_exempt
def pipeline_ingest(request):
    solution_id = get_solution_from_session(request)
    return JsonResponse(ingest_file(request, UPLOAD_COLLECTION,
                                    aws_path=solution_id + "/ingest/", aws_bucket=AMAZON_AWS_BUCKET))


@csrf_exempt
def pipleline_status(request):
    if request.method == "GET":
        return JsonResponse(pl_status(get_solution_from_session(request)))


@csrf_exempt
def update_s3(request):
    return JsonResponse(update_s3_bucket(request), safe=False)


@csrf_exempt
def services(request):
    return JsonResponse(services_util(request), safe=None)


@csrf_exempt
def create_service(request):
    return JsonResponse(create_new_service(request), safe=None)


@csrf_exempt
def upload_ee(request):
    return JsonResponse(None, safe=False)


@csrf_exempt
def tables(request):
    return JsonResponse(tables_services(request), safe=False)


@csrf_exempt
def rules(request):
    solution_id = get_solution_from_session(request)
    if request.method == "POST":
        payload = json.loads(request.body.decode())
        if "test/" in request.get_full_path():
            return JsonResponse(rules_execution_test(solution_id, payload, RULES_CONFIG["TEST"]))
        else:
            return JsonResponse(create_rules(payload, solution_id, RULES_CONFIG["SAVE"]))
    elif request.method == "GET":
        return JsonResponse(get_rules(solution_id, RULES_CONFIG["GET"]))


@csrf_exempt
def get_insights(request, doc_id=""):
    solution_id = get_solution_from_session(request)
    if request.method == "GET":
        return JsonResponse(document_data(doc_id, solution_id))
    elif request.method == "POST":
        payload = json.loads(request.body.decode())
        filter_obj = payload['filter_obj'] if payload is not None and 'filter_obj' in payload else None
        return JsonResponse(documents_data(solution_id, filter_obj))


@csrf_exempt
def document_details(request, doc_id, page_no):
    return JsonResponse(get_document_details(request, doc_id, page_no), safe=False)


@csrf_exempt
def feedback_service(request):
    if request.method == "POST":
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        response = feedback(payload, solution_id)
        if response["status"] == "success":
            return JsonResponse(update_queue_extracted_feedback(None, payload["doc_id"]))
        else:
            return JsonResponse(response)


@csrf_exempt
def feedback_entity(request):
    return JsonResponse(process_entity_feedback(request))


@csrf_exempt
def intent_review(request):
    return JsonResponse(update_intent_review(request))


@csrf_exempt
def models(request):
    return JsonResponse(process_models(request), safe=False)


@csrf_exempt
def retrain(request):
    solution_id = get_solution_from_session(request)
    return JsonResponse(retrain_model(solution_id))


@csrf_exempt
def learning_datasets(request):
    return JsonResponse(process_learning_datasets(request), safe=False)


@csrf_exempt
def dataset_download(request, path):
    return process_learning_datasets(request, path)


@csrf_exempt
def get_learning_config(request):
    return JsonResponse(get_learn_configs(request))


@csrf_exempt
def notebook_session(request):
    return JsonResponse(custom_notebook_session(request), safe=False)


@csrf_exempt
def review(request):
    solution_id = get_solution_from_session(request)
    payload = json.loads(request.body.decode())
    return JsonResponse(review_model(payload, solution_id))


@csrf_exempt
def train_set(request):
    return train_set_upload(request)


@csrf_exempt
def upload_data_files(request, type=None):
    return JsonResponse(save_uploaded_files(request, type), safe=False)


@csrf_exempt
def get_all_sftp_files(request):
    return JsonResponse(get_sftp_files(request), safe=False)


@csrf_exempt
def get_sftp_info(request, solution_id):
    return JsonResponse(get_sftp_data(solution_id), safe=False)


@csrf_exempt
def get_sftp_user(request, solution_id=None):
    return JsonResponse(get_sftp_user_info(request, solution_id), safe=False)


@csrf_exempt
def resource_data(request):
    return JsonResponse(process_resources(request), safe=False)


@csrf_exempt
def process_term(request):
    return JsonResponse(process_term_data(request), safe=False)


@csrf_exempt
def jrules(request):
    return JsonResponse(process_rules(request), safe=False)


@csrf_exempt
def jrules_config(request):
    return JsonResponse(get_config(request), safe=False)


@csrf_exempt
def jrules_custom(request, type=None):
    return JsonResponse(process_custom_rules(request, type), safe=False)


@csrf_exempt
def dashboard(request):
    return JsonResponse(get_charts(request), safe=False)


@csrf_exempt
def document_post_process(request, template_id):
    return JsonResponse(post_process_rules(request, template_id), safe=False)


@csrf_exempt
def download_json(request, doc_id):
    return download_document_json(request, doc_id)


@csrf_exempt
def camunda_workflow(request):
    return JsonResponse(process_workflow_files(request), safe=False)


@csrf_exempt
def camunda_api_spec_uri(request):
    return JsonResponse(process_workflow_api_spec(request), safe=False)


@csrf_exempt
def jrules_test(request):
    return JsonResponse(execute_rules(request), safe=False)


@csrf_exempt
def jrules_custom_test(request):
    return JsonResponse(execute_custom_rules(request), safe=False)


@csrf_exempt
def templates_train(request, endpoint="", template_id=""):
    if endpoint == "upload":
        if request.method == "POST":
            return JsonResponse(template_train_upload_post(request))
        elif request.method == "GET" and template_id != "":
            return JsonResponse(template_train_upload_get(request, template_id))
    elif endpoint == "trigger":
        return JsonResponse(template_train_trigger(request))


@csrf_exempt
def job_status(request, job_id=""):
    if request.method == "GET" and job_id != "":
        return JsonResponse(test_job_status(job_id))


@csrf_exempt
def check_import_status(request, job_id=""):
    return JsonResponse(test_job_status(job_id, "entity"))


@csrf_exempt
def fetch_section_data(request, doc_id):
    """
    :param request
    :param doc_id : For which section data is required
    :return: Response in Json format
    """
    return JsonResponse(fetch_sections_data(request, doc_id))


@csrf_exempt
def process_tag(request):
    return JsonResponse(process_tags(request))


@csrf_exempt
def hierarchy_info(request):
    return JsonResponse(process_hierarchy(request))


@csrf_exempt
def process_entity_data(request, doc_id):
    return JsonResponse(process_entity_linking(request, doc_id))


@csrf_exempt
def threshold_data(request):
    """
    :param request:
    :return: response in json format
    """
    solution_id = get_solution_from_session(request)
    if request.method == "POST":
        payload = json.loads(request.body.decode())
        return JsonResponse(save_threshold_data(solution_id, payload))


@csrf_exempt
def text_feedback(request):
    return JsonResponse(process_text_feedback(request),safe=False)


@csrf_exempt
def complete_review(request,doc_id=None):
    return JsonResponse(process_complete_review(request,doc_id))


@csrf_exempt
def case_queue_management(request):
    return JsonResponse(case_queue_services(request), safe=False)


@csrf_exempt
def update_case_queue(request):
    return JsonResponse(case_queue_services(request), safe=False)


@csrf_exempt
def delete_case_queue(request, queue_id):
    return JsonResponse(case_queue_services(request, queue_id=queue_id),
                        safe=False)


@csrf_exempt
def assign_case(request):
    return JsonResponse(case_assignment_service(request), safe=False)


@csrf_exempt
def fetch_cases_count(request, sv_user):
    return JsonResponse(case_assignment_service(request, sv_user=sv_user),
                        safe=False)


@csrf_exempt
def fetch_cases(request, queue_id, status):
    return JsonResponse(case_assignment_service(request, queue_id=queue_id,
                                                status=status), safe=False)


@csrf_exempt
def case_status_update(request):
    return JsonResponse(case_assignment_service(request), safe=False)


@csrf_exempt
def dashboard_queues(request):
    return JsonResponse(get_dashboard_queues_info(request), safe=False)


@csrf_exempt
def dashboard_docs(request):
    return JsonResponse(get_dashboard_docs(request), safe=False)


@csrf_exempt
def get_mapping_entities(request, template_id="none"):
    return JsonResponse(get_attributes_thresholds(request, template_id))


@csrf_exempt
def workflow_management(request):
    return JsonResponse(workflow_management_service(request), safe=False)


@csrf_exempt
def change_state(request):
    return JsonResponse(change_doc_state(request), safe=False)


@csrf_exempt
def child_documents(request):
    return JsonResponse(get_child_documents(request), safe=False)


@csrf_exempt
def learning_binaries(request):
    return JsonResponse(get_binaries(request), safe=False)


@csrf_exempt
def learning_evaluation(request):
    return JsonResponse(process_models(request), safe=False)


@csrf_exempt
def previous_run_details(request):
    return JsonResponse(get_previous_run_details(request), safe=False)


@csrf_exempt
def learning_binary(request):
    return JsonResponse(process_learning_binaries(request), safe=False)


@csrf_exempt
def binary_download(request, path):
    return process_learning_binaries(request, path)


@csrf_exempt
def results_download(request, path):
    return download_results(request, path)


@csrf_exempt
def learning_binary_update(request):
    return update_learning_binary(request)


@csrf_exempt
def workflow_variables(request):
    return JsonResponse(get_workflow_variables(request), safe=False)


@csrf_exempt
def workflow_case_queues(request):
    return JsonResponse(implement_workflow_case_queues(request), safe=False)


@csrf_exempt
def custom_function(request, function_name=None):
    con_fass_obj = ConsoleFaaS()
    return JsonResponse(con_fass_obj.custom_functions(request,
                                                      function_name=function_name),
                        safe=False)


@csrf_exempt
def ner_service(request):
    con_ner_obj = NERConsole()
    return JsonResponse(con_ner_obj.ner_service_label(request), safe=False)


@csrf_exempt
def get_pipeline(request):
    return JsonResponse(get_pipelines(request), safe=False)


@csrf_exempt
def get_case_object(request):
    return JsonResponse(fetch_case_object(request), safe=False)


@csrf_exempt
def get_case_variables(request):
    return JsonResponse(fetch_case_variables(request), safe=False)


@csrf_exempt
def get_case_queue_rules(request, rule_id):
    return JsonResponse(fetch_case_queue_rules(request, rule_id), safe=False)


@csrf_exempt
def get_preassigned_s3_url(request):
    return JsonResponse(generate_preassigned_s3_url(request), safe=False)


@csrf_exempt
def get_files(request):
    return JsonResponse(list_s3_files(request), safe=False)


@csrf_exempt
def delete_file(request):
    return JsonResponse(delete_s3_file(request), safe=False)


@csrf_exempt
def user_groups(request, ug_id=None):
    ug_obj = UserServices()
    return JsonResponse(ug_obj.process_user_groups_request(request,
                                                           user_group_id=ug_id),
                        safe=False)


@csrf_exempt
def user_roles(request, role_id=None, user_id=None):
    ug_obj = UserServices()
    return JsonResponse(ug_obj.process_user_roles_request(request,
                                                          role_id=role_id, user_id=user_id),
                        safe=False)


@csrf_exempt
def user_roles_linkusers(request, ug_id=None, role_id=None):
    ug_obj = UserServices()
    return JsonResponse(ug_obj.process_users_linking_roles_request(request,
                                                                   ug_id=ug_id,
                                                                   role_id=role_id),
                        safe=False)


@csrf_exempt
def implement_users(request, user_id=None):
    ug_obj = UserServices()
    return JsonResponse(ug_obj.process_user_request(request,
                                                    user_id=user_id),
                        safe=False)


@csrf_exempt
def link_users(request, ug_id=None, user_id=None):
    ug_obj = UserServices()
    return JsonResponse(ug_obj.process_users_linking_request(request,
                                                             ug_id=ug_id,
                                                             user_id=user_id),
                        safe=False)


@csrf_exempt
def dashboard_queues_docs_mapping(request):
    qd_map_obj = QueueDocMapper()
    return JsonResponse(qd_map_obj.get_all_queues_info(request), safe=False)


@csrf_exempt
def handle_user_solutions(request):
    res = {"status": "success", "data": UserServices().process_user_solutions(request)}
    return JsonResponse(res, safe=False)



@csrf_exempt
def process_sources(request, solution_id=None, source_id=None):
    ss_obj = SourcesServices()
    if not solution_id:
        solution_id = get_solution_from_session(request)
    source_type = 'email'
    return JsonResponse(ss_obj.process_source_request(request, source_type,
                                                      solution_id=solution_id,
                                                      source_id=source_id),
                        safe=False)


@csrf_exempt
def process_file_sources(request, solution_id=None, source_id=None):
    ss_obj = SourcesServices()
    if not solution_id:
        solution_id = get_solution_from_session(request)
    source_type = 'manualupload'
    return JsonResponse(ss_obj.process_source_request(request, source_type,
                                                      solution_id=solution_id,
                                                      source_id=source_id),
                        safe=False)


@csrf_exempt
def doc_vars(request):
    return JsonResponse(create_doc_var_json(), safe=False)


@csrf_exempt
def ingest_template_request(request):
    if request.method == "POST":
        solution_id = get_solution_from_session(request)
        if len(request.FILES) != 0:
            payload = request.POST
            file_data = save_to_folder(solution_id, request.FILES["file"], MOUNT_PATH, "templates", "uploads",
                                       flag=True)
            file_path = file_data["data"]["relative_path"] if file_data["data"] else ""
            return JsonResponse(ingest_template(solution_id, payload, file_path=file_path))
        else:
            payload = json.loads(request.body.decode())
            return JsonResponse(ingest_template(solution_id, payload))


@csrf_exempt
def get_template_request(request, template_id=""):
    if request.method in ["GET", "POST"]:
        solution_id = get_solution_from_session(request)
        if template_id in ["known", "unknown","allpublished"]:
            payload = json.loads(request.body.decode()) if request.method == "POST" else {}
            return JsonResponse(get_template(solution_id, template_type=template_id,payload=payload))
        else:
            return JsonResponse(get_template(solution_id, template_id=template_id))


@csrf_exempt
def update_template_request(request):
    if request.method == "POST":
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        return JsonResponse(update_template(solution_id, payload))


@csrf_exempt
def save_template_element_request(request):
    if request.method == "POST":
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        return JsonResponse(save_template_element(solution_id, payload))


@csrf_exempt
def delete_template_element_request(request):
    if request.method == "POST":
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        return JsonResponse(delete_template_element(solution_id, payload))


@csrf_exempt
def threshold(request, solution_id=None, workflow_id=None,
              task_id=None):
    res = custom_threshold(request, solution_id=solution_id,
                           workflow_id=workflow_id, task_id=task_id)
    return JsonResponse(res, safe=False)


@csrf_exempt
def threshold_update(request,solution_id=None,workflow_id=None,task_id=None,threshold_id=None):
    res = insert_threshold(request,solution_id,workflow_id,task_id,threshold_id)
    return JsonResponse(res, safe=False)


@csrf_exempt
def get_s3_bucket_url(request):
    ss_obj = SourcesServices()
    return JsonResponse(ss_obj.get_s3_bucket_url(request), safe=False)


@csrf_exempt
def test_email_connection(request):
    ss_obj = SourcesServices()
    return JsonResponse(ss_obj.test_email_connection(request), safe=False)


@csrf_exempt
def save_unknown_template_request(request):
    if request.method == "POST":
        solution_id = get_solution_from_session(request)
        payload = json.loads(request.body.decode())
        return JsonResponse(save_unknown_template(solution_id, payload))


@csrf_exempt
def cm_workflow_management(request):
    return JsonResponse(case_management_wf_service(request), safe=False)


@csrf_exempt
def ontology_service(request, solution_id=None, id=None):
    ontology_obj = Ontology()
    return JsonResponse(ontology_obj.ontology_service(request, solution_id, id), safe=False)


@csrf_exempt
def cm_dashboard_management(request):
    return JsonResponse(case_management_dashboard_service(request), safe=False)


@csrf_exempt
def get_agents_list(request):
    return JsonResponse(fetch_agents(request), safe=False)

