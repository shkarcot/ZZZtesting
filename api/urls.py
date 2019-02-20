from django.conf.urls import url
from api import views
from scripts.seed_data import seed_data
from config_vars import DASHBOARD_CONFIG

urlpatterns = [
    # Case Queue Management APIs
    url(r'^createqueue/$', views.case_queue_management, name="Queue Management"),
    url(r'^getqueues/$', views.case_queue_management, name="Queue Management"),
    url(r'^updatequeue/$', views.update_case_queue, name="Queue Management"),
    url(r'^deletequeue/(?P<queue_id>[\w\-]+)/$',
        views.delete_case_queue, name="Queue Management"),
    url(r'^assigncase/$', views.assign_case, name="Queue Management"),
    url(r'^fetchcasescount/(?P<sv_user>[\w\-]+)/$', views.fetch_cases_count,
        name="Queue Management"),
    url(r'^fetchqueuecases/(?P<queue_id>[\w\-]+)/(?P<status>[\w\-]+)/$',
        views.fetch_cases, name="Queue Management"),
    # url(r'^casestatusupdate/$', views.case_status_update, name="Queue Management"),
    url(r'^dashboard/cases/$', views.dashboard_queues, name="Queue Management"),
    url(r'^dashboard/docs/$', views.dashboard_docs, name="Queue Management"),

    # AUTHORIZATION APIs
    url(r'^auth/', views.auth, name="Authorization"),
    url(r'^auth/info', views.auth_info, name="Get Logged-in User Info"),

    # PLATFORM APIs
    # 1. Solution Api
    url(r'^soln/$', views.solution),
    url(r'^soln/(?P<sol_info>\w+)/$', views.solution),
    url(r'^activeTenant/', views.active_tenants),
    url(r'^get/solnid/', views.get_solution),
    url(r'^get/templatecount/', views.get_template_counts),

    # 2. Entities Api
    url(r'^solnConfig/definitions/', views.entity_defnitions),
    url(r'^solnConfig/$', views.solution_config),
    url(r'^solnConfig/(?P<endpoint>\w+)/(?P<file_type>\w+)/$', views.solution_config),
    url(r'^solnConfig/(?P<endpoint>\w+)/$', views.solution_config),
    url(r'^solnConfig/status/(?P<job_id>[\w\-]+)/$', views.check_import_status),
    url(r'^entitylist/$', views.get_all_entities),

    # 3. Resource library Api
    url(r'^load_training/data/', views.load_training_data),
    url(r'^download/efs/', views.download_training_data),
    url(r'^download/(?P<doc_id>[\w\-]+)/$', views.download_training_data),
    url(r'^data/upload/$', views.upload_data_files),
    url(r'^data/upload/(?P<type>[\w\-]+)/$', views.upload_data_files),
    url(r'^data/resource/get/$', views.resource_data),
    url(r'^terms/$', views.process_term),
    url(r'^get/hierarchy/$', views.hierarchy_info),
    url(r'^tags/$', views.process_tag),
    url(r'^data/resource/$', views.resource_data),
    url(r'^camunda/workflow/$', views.camunda_workflow),
    url(r'^spec/$', views.camunda_api_spec_uri),
    url(r'^sftp/files/$', views.get_all_sftp_files),
    url(r'^get/sftpinfo/(?P<solution_id>[\w\-]+)/$', views.get_sftp_info),
    url(r'^get/sftpuser/$', views.get_sftp_user),
    url(r'^get/sftpuser/(?P<solution_id>[\w\-]+)/$', views.get_sftp_user),
    url(r'^presignedurl/$', views.get_preassigned_s3_url),
    url(r'^getfiles/$', views.get_files),
    url(r'^deletefile/$', views.delete_file),


    # 4. Document template Api
    url(r'^documentTemplates/list/$', views.document_templates, name="Document Templates List"),
    url(r'^documentTemplates/(?P<template_id>[\w\-]+)/$', views.document_templates, name="Document Template"),
    url(r'^documentTemplates/unknown/$', views.document_templates, name="Held Document Templates"),
    url(r'^documentTemplates/$', views.document_templates, name="Held Document Templates"),
    url(r'^documentTemplates/postprocess/(?P<template_id>[\w\-]+)/$', views.document_post_process,
        name="Post processing rules"),
    url(r'^documentTemplates/test/$', views.document_templates, name="Test Templates"),
    url(r'^documentTemplates/test/(?P<template_id>[\w\-]+)/$', views.document_templates, name="Test Templates"),
    url(r'^testdocuments/(?P<doc_id>[\w\-]+)/$', views.test_documents, name="Test Templates"),
    url(r'^templateElements/(?P<template_id>[\w\-]+)/(?P<page_no>[\w\-]+)/$', views.document_templates_fields,
        name="Document Template"),
    url(r'^templateElements/$', views.document_templates_fields,
        name="Document Template"),
    url(r'^documentTemplates/train/(?P<endpoint>[\w\-]+)/$', views.templates_train,
        name="template upload samples and trigger training"),
    url(r'^documentTemplates/train/(?P<endpoint>[\w\-]+)/(?P<template_id>[\w\-]+)/$', views.templates_train,
        name="get template samples"),

    # 5. Services API
    url(r'^services/ingest/$', views.services),
    url(r'^services/test/$', views.services),
    url(r'^services/$', views.services),
    url(r'^services/trainupload/$', views.train_set),
    url(r'^services/create/$', views.create_service),

    url(r'^platformConfig/nlpEngine/processors/', views.platformConfig_nlpEngine_processors),

    # 6. Rules API
    url(r'^rules', views.rules),
    url(r'^rules/test/$', views.rules),
    url(r'^rulesConfig/operators/', views.rulesConfig_operators),
    url(r'^insight/(?P<type>[\w\-]+)', views.insight_service),
    url(r'^createTrainingSet/', views.create_training_set),
    url(r'^trainingSetModels/(?P<type>[\w\-]+)/', views.training_set_models),
    url(r'^jrules/$', views.jrules),
    url(r'^jrules/test/$', views.jrules_test),
    url(r'^jrules/customtest/$', views.jrules_custom_test),
    url(r'^jrules/config/$', views.jrules_config),
    url(r'^jrules/custom/$', views.jrules_custom),
    url(r'^jrules/custom/(?P<type>[\w\-]+)/$', views.jrules_custom),

    # 7. Learning models API
    url(r'^models/$', views.models),
    url(r'^models/ensembles/$', views.models),
    url(r'^models/details/$', views.models),
    url(r'^models/components/$', views.models),
    url(r'^models/test/$', views.models),
    url(r'^models/train/$', views.models),
    url(r'^models/retrain/$', views.models),
    url(r'^models/evaluate/$', views.models),
    url(r'^models/config/$', views.models),
    url(r'^models/flowupdate/$', views.models),
    url(r'^models/save/$', views.models),
    url(r'^models/dataset/upload/$', views.learning_datasets),
    url(r'^models/dataset/list/$', views.learning_datasets),
    url(r'^models/dataset/archive/$', views.learning_datasets),
    url(r'^models/type/$', views.get_learning_config),
    url(r'^models/dataset/type/$', views.get_learning_config),
    url(r'^models/dataset/download/(?P<path>.*)$', views.dataset_download),
    url(r'^models/session/get/$', views.notebook_session),
    url(r'^models/binaries/list/$', views.learning_binaries),
    url(r'^models/evaluationdetails/$', views.learning_evaluation),
    url(r'^models/previousrundetails/$', views.previous_run_details),
    url(r'^models/binary/upload/$', views.learning_binary),
    url(r'^models/binary/download/(?P<path>.*)$', views.binary_download),
    url(r'^models/version/download/(?P<path>.*)$', views.results_download),
    url(r'^models/previousrun/download/(?P<path>.*)$', views.results_download),
    url(r'^models/binary/archive/$', views.learning_binary_update),

    # REFERENCE APP APIs
    url(r'^getInsights/(?P<doc_id>[\w\-]+)/$', views.get_insights),
    url(r'^dashboard/$', views.dashboard),
    url(r'^getInsights/$', views.get_insights),
    url(r'^documents/(?P<doc_id>[\w\-]+)/(?P<page_no>[\w\-]+)/$', views.document_details),
    url(r'^feedback/$', views.feedback_service),
    url(r'^feedback/entity/$', views.feedback_entity),
    url(r'^retrain/$', views.retrain),
    url(r'^review/$', views.review),
    url(r'^download/json/(?P<doc_id>[\w\-]+)/$', views.download_json),
    url(r'^intentreview/$', views.intent_review),
    url(r'^documentTypes/', views.get_document_types),
    url(r'^grouping/review/(?P<doc_id>[\w\-]+)/$', views.grouping_review),
    url(r'^feedback/text/$', views.text_feedback),
    url(r'^completeReview/text/$', views.complete_review),
    url(r'^completeReview/entity/$', views.complete_review),
    url(r'^completeReview/review/(?P<doc_id>[\w\-]+)/$', views.complete_review),
    url(r'^change/state/$', views.change_state),
    url(r'^childdocs/$', views.child_documents),

    url(r'^getData/(?P<selector>[\w\-]+)/(?P<doc_type>[\w\-]+)/$', views.get_processed_data),
    url(r'^getData/(?P<selector>[\w\-]+)/(?P<doc_type>[\w\-]+)/(?P<query>[\w\-]+)/$', views.get_processed_data),
    url(r'^getRecord/(?P<selector>[\w\-]+)/(?P<doc_type>[\w\-]+)/(?P<file_flow_id>[\w\-]+)/(?P<direction>[\w\-]+)/$',
        views.get_record_data),
    url(r'^getRecord/(?P<selector>[\w\-]+)/(?P<doc_type>[\w\-]+)/(?P<file_flow_id>[\w\-]+)/(?P<direction>[\w\-]+)/'
        r'(?P<query>[\w\-]+)/$', views.get_record_data),
    url(r'^getJson/(?P<file_flow_id>[\w\-]+)', views.json_download),
    url(r'^getReviewList/(?P<status>[\w\-]+)/(?P<doc_type>[\w\-]+)/$', views.review_list),
    url(r'^getReviewList/(?P<status>[\w\-]+)/(?P<doc_type>[\w\-]+)/(?P<query>[\w\-]+)/$', views.review_list),
    url(r'^getReview/(?P<status>[\w\-]+)/(?P<doc_type>[\w\-]+)/(?P<file_flow_id>[\w\-]+)/(?P<direction>[\w\-]+)/$',
        views.get_review),
    url(r'^getReview/(?P<status>[\w\-]+)/(?P<doc_type>[\w\-]+)/(?P<file_flow_id>[\w\-]+)/(?P<direction>[\w\-]+)/'
        r'(?P<query>[\w\-]+)/$', views.get_review),
    url(r'^intent/(?P<doc_id>[\w\-]+)/', views.intent),
    url(r'^postReview/(?P<file_flow_id>[\w\-]+)/', views.post_review),
    url(r'^chart/(?P<chart_id>[\w\-]+)/(?P<selector>[\w\-]+)/', views.get_chart),
    url(r'^selectors/', views.get_selectors),
    url(r'^extractiondata/(?P<doc_id>[\w\-]+)/$', views.fetch_section_data),
    url(r'^entitylink/(?P<doc_id>[\w\-]+)/$', views.process_entity_data),
    url(r'^thresholds/', views.threshold_data),
    url(r'^mapping_entities/(?P<template_id>[\w\-]+)/$', views.get_mapping_entities),

    # pipeline Api's
    url(r'^pipeline/settings/', views.pipeline_settings),
    url(r'^pipeline/email/', views.email_details),
    url(r'^pipeline/upload/', views.pipeline_ingest),
    url(r'^pipeline/status/', views.pipleline_status),
    url(r'^pipeline/', views.update_s3),
    url(r'^getpipeline/', views.get_pipeline),

    # OTHERS
    url(r'^jobStatus/(?P<job_id>[\w\-]+)/$', views.job_status),

    # Workflow APIs
    url(r'^workflows/$', views.workflow_management, name="Workflow Management"),
    url(r'^wfvariables/$', views.workflow_variables),
    url(r'^workflowcasequeues/$', views.workflow_case_queues),
    url(r'^caseobject/$', views.get_case_object),
    url(r'^casevariables/$', views.get_case_variables),
    url(r'^casequeuerules/(?P<rule_id>[\w\-]+)/$', views.get_case_queue_rules),

    # Custom Functions
    url(r'^customfunctions/(?P<function_name>[\w\-]+)/$', views.custom_function,
        name='FAAS'),
    url(r'^customfunctions/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/enable/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/open/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/create/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/save/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/publish/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/test/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/logs/$', views.custom_function, name='FAAS'),
    url(r'^customfunction/enable_version/$', views.custom_function, name='FAAS'),

    # User Groups APIs
    url(r'^usergroups/$', views.user_groups),
    url(r'^usergroups/(?P<ug_id>[\w\-]+)/$', views.user_groups),
    url(r'^nestedusergroups/(?P<ug_id>[\w\-]+)/$', views.user_groups),
    url(r'^userroles/$', views.user_roles),
    url(r'^userroles/(?P<role_id>[\w\-]+)/$', views.user_roles),
    url(r'^userroles/(?P<role_id>[\w\-]+)/users/(?P<user_id>[\w\-]+)/$', views.user_roles),
    url(r'^linkuserstorole/$', views.user_roles_linkusers),
    url(r'^users/$', views.implement_users),
    url(r'^users/(?P<user_id>[\w\-]+)/$', views.implement_users),
    url(r'^solutions/$', views.handle_user_solutions),
    url(r'^linkusers/$', views.link_users), 
    url(r'^linkusers/(?P<ug_id>[\w\-]+)/(?P<user_id>[\w\-]+)/$',
        views.link_users),

    # Dashboard case management
    url(r'^dashboard/getqueues/$', views.dashboard_queues_docs_mapping, name="Queue Management"),
    url(r'^dashboard/getdocs/$', views.dashboard_queues_docs_mapping, name="Queue Management"),

    # Sources APIs
    url(r'^solutions/(?P<solution_id>[\w\-]+)/sources/$',
        views.process_sources, name="Source Management"),
    url(r'^solutions/(?P<solution_id>[\w\-]+)/sources/(?P<source_id>[\w\-]+)/$',
        views.process_sources, name="Source Management"),
    url(r'^solutions/(?P<solution_id>[\w\-]+)/filesources/$',
        views.process_file_sources, name="Source Management"),
    url(r'^solutions/(?P<solution_id>[\w\-]+)/filesources/(?P<source_id>[\w\-]+)/$',
        views.process_file_sources, name="Source Management"),
    url(r'^s3bucketurl/$', views.get_s3_bucket_url, name="Source Management"),
    url(r'^testemailconnection/$', views.test_email_connection, name="Source Management"),

    url(r'^docvars/$', views.doc_vars, name="Queue Management"),

    # NER service labels
    url(r'^nerservice/$', views.ner_service, name="NER Label"),

    # New Template URLS
    url(r'^ingest/template/$', views.ingest_template_request, name="Ingest Template"),
    url(r'^get/template/$', views.get_template_request, name="Get Template"),
    url(r'^get/template/(?P<template_id>[\w\-]+)/$', views.get_template_request, name="Get Template with id"),
    url(r'^publish/template/$', views.update_template_request, name="Publish Template"),
    url(r'^delete/template/$', views.update_template_request, name="Delete Template"),
    url(r'^save/template/elements/$', views.save_template_element_request, name="Save Template Elements"),
    url(r'^delete/template/elements/$', views.delete_template_element_request, name="Delete Template Elements"),
    url(r'^save/template/unknown/$', views.save_unknown_template_request, name="Update Unknown Template"),

    # GET, POST, PUT methods of all thresholds
    url(r'^solution/(?P<solution_id>[\w\-]+)/workflow/(?P<workflow_id>[\w\-]+)/task/(?P<task_id>[\w\-]+)/threshold/$',
        views.threshold, name="update threshold values"),
    url(r'^solution/(?P<solution_id>[\w\-]+)/workflow/(?P<workflow_id>[\w\-]+)/task/(?P<task_id>[\w\-]+)/'
        r'threshold/(?P<threshold_id>[\w\-]+)/$',
        views.threshold_update, name="insert threshold values to existing Data"),

    url(r'^queue/agents', views.get_agents_list, name="Queue Management"),
    url(r'^workflow/*', views.cm_workflow_management, name="Workflow Management"),
    url(r'^queue/*', views.cm_workflow_management, name="Workflow Management"),
    url(r'^case/*', views.cm_dashboard_management, name="Workflow Management"),

    # Ontologies
    url(r'^solution/(?P<solution_id>[\w\-]+)/ontologies/$', views.ontology_service, name="ontologies"),
    url(r'^solution/(?P<solution_id>[\w\-]+)/ontologies/(?P<id>[\w\-]+)/$', views.ontology_service, name="ontologies"),
    url(r'^solution/(?P<solution_id>[\w\-]+)/ontologies/(?P<id>[\w\-]+)/enable/$', views.ontology_service, name="ontologies"),

]

seed_data("dashboard_config.json", DASHBOARD_CONFIG)
