import os

ROOT = os.path.dirname(os.path.abspath(__file__))
MEDIA_ROOT = os.path.join(ROOT, 'media/')
SCRIPTS_ROOT = os.path.join(ROOT, "scripts/")

if not os.path.exists(MEDIA_ROOT):
    os.makedirs(MEDIA_ROOT)

ENTITY_DEFN_COLL = 'entity_definitions'

ENTITY_COLLECTION = "console_entities"
TEMPLATE_COLLECTION = "console_document_templates_new"
UPLOADED_FILE_COLLECTION = "uploaded_files"
# Amazon S3 folders
AMAZON_AWS_KEY_PATH = 'CogIntake/'
AMAZON_AWS_IMAGE_PATH = 'CogImage/'
AMAZON_AWS_CMS1500_PATH = "CogCMS1500/"
AMAZON_AWS_DIG_PATH = "CogDigital/"
AMAZON_AWS_TEMPLATE_PATH = "CogTemplate/"

# Collections
DIGITAL_DOCUMENT_COLLECTION = "digital_documents"
IMAGE_COLLECTION = "image_config"
CLAIMS_FIELD_SELECTORS = "claims_field_selectors"
CLAIMS_METADATA_COLLECTION = "claims_metadata"

CLAIMS_FIELDS_COLLECTION = "form_field"
CLAIMS_COLLECTION = 'form'
FEEDBACK_COLLECTION = 'feedback'

# Temp Upload Collection
UPLOAD_COLLECTION = 'uploads'
SOURCE_COLLECTION = "console_sources"
# Config Collections
CONFIG_COLLECTION = "config_params"
DASHBOARD_CONFIG = 'dashboard_config'
FORMS_COLLECTION = "forms_config"

TEST_UPLOAD_PATH = "CogTest/"

# Training Set API
TRAINING_SET_URL = 'http://devems.apps.xpms.io/'
TRAINING_SET_POST = 'saveTrainingSet'
TRAINING_SET_COLLECTION = 'training_set'
TRAINING_SET_SERVICES_COLLECTION = 'training_set_services'
TRAINING_SET_MODELS_COLLECTION = 'training_set_models'
TRAINING_SET_TRAIN_MODEL_URI = 'nlp/train/intent'
TRAINING_SET_TRAIN_MODEL_STATUS_URI = 'nlp/update/intent'
TRAINING_SET_TRAIN_MODEL_TEST_URI = 'nlp/test/intent'
TRAINING_SET_TRAIN_MODEL_TEST_ACTION_URI = 'nlp/test/action'
TRAINING_SET_GET_WORD_DISAMBIGUATION_URI = 'nlp/get/word/disambiguation'
TRAINING_SET_ACTION_CLASSIFIER_URI = 'nlp/train/action/classifier'
TRAINING_SET_GET_LEARNING_MODEL_VERSIONS_URI = 'learning/model/versions'

ENTITY_CONFIG = {
    "default": {
        "SAVE": "entity/config/save",
        "GET": "entity/config/get",
        "DELETE": "entity/config/delete",
        "DATA": "result.result.metadata.entity_cfg"
    },
    "action": {
        "SAVE": "entity/action/config/save",
        "GET": "entity/action/config/get",
        "DELETE": "entity/action/config/delete",
        "DATA": "result.result.metadata.action_cfg"
    },
    "relationship": {
        "SAVE": "entity/concept/save",
        "GET": "entity/concept/get",
        "DELETE": "entity/concept/delete",
        "DATA": "result.result.metadata.concept"
    },
    "enrichments": {
        "SAVE": "entity/config/save",
        "GET": "entity/enrich/get",
        "DATA": "result.result.metadata.enrichments"
    },
    "download": {
        "GET": "entity/export",
        "DATA": "result.result.metadata.file_path"
    },
    "feedback": {
        "SAVE": "entity/feedback/save"}
}

# Template config API settings
TEMPLATE_CONFIG = {
    "SAVE": "template/save",
    "GET": "template/get",
    "DELETE": "template/delete",
    "DE_SKEW": "imageProcessing/deskew",
    "PDF_TO_PNG": "imageProcessEngine/convertPdfToPng",
    "PUBLISH": "document/template/publish"
}

NLP_CONFIG = {"EXTRACT_INTENT": "nlp/extract/intent",
              "CREATE_INTENT": "nlp/create/intent",
              "INIT_DEFAULTS": "nlp/configure"}

# Mount path ops
MOUNT_PATH = os.environ["SHARED_VOLUME"]
MOUNT_PATH = MOUNT_PATH if MOUNT_PATH.endswith("/") else MOUNT_PATH + "/"

# API gateway
HTTP_PROTO = 'http://'
API_GATEWAY_POST_JOB_URI = HTTP_PROTO + os.environ["API_GATEWAY_URL"]
API_GATEWAY_POST_JOB_URI = API_GATEWAY_POST_JOB_URI if API_GATEWAY_POST_JOB_URI.endswith("/") \
    else API_GATEWAY_POST_JOB_URI + "/"
API_GATEWAY_JOB_STATUS_URI = API_GATEWAY_POST_JOB_URI + "job/"

# ELK url
ELK_HOST = os.environ["LOGSTASH_HOST"] if "LOGSTASH_HOST" in os.environ else "devintkelk.apps.xpms.io"
ELK_PORT = os.environ["KIBANA_PORT"] if "KIBANA_PORT" in os.environ else 5601

SOLUTION_ID = "test"

PERMISSIBLE_EXTENSIONS = [".png", ".jpeg", ".jpg"]
STEPS = {"d": 1, "w": 7, "m": 30, "y": 365}

DEFAULT_JSON_FOLDER = 'defaults'

RULE_SERVICE_URI = 'http://devrems.apps.xpms.io/'
LIST_OPERATORS_SERVICE_METHOD = 'listOperators'

DEFAULT_SOLN_NAME = 'default'

# Solution Settings
SOLN = {"collection": "tenant"}

INSIGHT_CONFIG = {
    "collection": "insight_config",
    "configure_template_api": "insight/template/configure",
    "initialize_defaults_api": "insight/configure",
    "get_insight": "insight/getInsight",
    "service_keys": "insight/get/serviceKeys",
    "create_service": "insight/create/service"
}

LEARNING_CONFIG = {
    "initialize_defaults_api": "learning/configure",
    "get": "learning/model/get",
    "components": "learning/model/components",
    "score": "learning/model/score",
    "train": "learning/model/train",
    "retrain": "learning/model/train",
    "run": "learning/model/run",
    "configure": "learning/model/configure",
    "save_flow": "learning/model/flowupdate",
    "upload": "learning/dataset/upload",
    "datasets": "learning/dataset/details",
    "dataset_types": "learning/dataset/format",
    "model_types": "learning/model/types",
    "get_session": "learning/session/get",
    "save_model": "learning/model/save",
    "update_dataset": "learning/dataset/update",
    "update_binary": 'learning/binaries/update',
    'get_binaries': 'learning/binaries/get',
    'get_evaluation': 'learning/model/evaluation_results',
    'get_prev_run': 'learning/model/run_results',
    'upload_binary': 'learning/binaries/upload'
}

DEFAULT_ENTITY_ID = '66db655d-c6fa-4d97-b1dd-c3f75e4eb54f'

# NLP Training Set API
NLP_CREATE_INTENT_API = "nlp/create/intent"

# Catalog service API
GET_CATALOG_SERVICE = "services"
POST_CATALOG_SERVICE = "service/config"

# New Solution trigger
NEW_SOLN_TRIGGER = 'solution/new'

# SQL Params
# MYSQL_HOSTNAME = os.environ["MYSQL_HOSTNAME"]
# MYSQL_PORT = os.environ["MYSQL_PORT"]
# MYSQL_USERNAME = os.environ["MYSQL_USERNAME"]
# MYSQL_PASSWORD = os.environ["MYSQL_PASSWORD"]
# MYSQL_DATABASE = os.environ["MYSQL_DATABASE"]

# MongoDb params
DB_HOST_MONGO = os.environ["DB_HOST_MONGO"]
DB_PORT_MONGO = os.environ["DB_PORT_MONGO"]
DB_USERID_MONGO = os.environ["DB_USERID_MONGO"]
DB_PASSWORD_MONGO = os.environ["DB_PASSWORD_MONGO"]
DB_AUTH_NM_MONGO = os.environ["DB_AUTH_NM_MONGO"]

# Amazon AWS details
AMAZON_AWS_KEY = os.environ["AMAZON_AWS_KEY"]
AMAZON_AWS_SECRET_KEY = os.environ["AMAZON_AWS_SECRET_KEY"]
AMAZON_AWS_REGION = os.environ["AMAZON_AWS_REGION"]
AMAZON_AWS_BUCKET = os.environ["AMAZON_AWS_BUCKET"]

TABLES_CONFIG = {"SAVE": "service/config",
                 "GET": "service/config/get",
                 }

RULES_CONFIG = {
    "SAVE": {"EP": "entity/rules/save", 'DATA': "result.result.metadata.rule_id"},
    "GET": {"EP": "entity/rules/get", 'DATA': "result.result.metadata.rules"},
    "TEST": {"EP": "entity/rules/test", 'DATA': "result.result.metadata.docs"}
}

# Adding New collection in MongoDB for Queues Management
CASE_QUEUE_COLLECTION = "case_queue"
# Ends Here

# Adding Leaning Model collections
MODEL_GROUPS_COLLECTION = 'model_groups'
# Ends Here

FEEDBACK_ENDPOINT = "feedback/save"
RETRAIN_ENDPOINT = 'retrain'
DOCUMENTS_COLLECTION = "console_documents"
DOC_ELEMENTS_COLLECTION = "console_doc_elements"
DOC_MAPPING_COLLECTION = "console_doc_mapping"
DOC_SECTIONS_COLLECTION = "console_doc_sections"
TEMPLATE_TEST_COLLECTION = "template_test"
RESOURCES_COLLECTION = "resources"
WORKFLOW_COLLECTION = "workflows"
# RULES_URL = HTTP_PROTO + os.environ["RULES_URL"]
# RULES_URL = RULES_URL if RULES_URL.endswith("/") \
#     else RULES_URL + "/"

RULES_ENDPOINT = {
    "SAVE": "saveResource",
    "GET": "getResource",
    "ADD": "saveResource",
    "DELETE": "deleteResourceElement",
    "search": "search",
    "get_rule": "getRule",
    "get_tags": "getResources",
    "get_hierarchy": "hierarchy",
    "del_tag": "deleteResource"
}

DOCUMENT_ENDPOINT = {
    "group_save": "document/classification/review/flow",
    "ingest_flow": "document/ingest/flow",
    "text_review": "document/init/review/text/flow",
    "entities": "document/domainObjects",
    "thresholds_update": "document/template/threshold"
}

PLATFORM_SERVICE_SPECS = "api/spec"
REVIEW_ENDPOINT = 'document/state/set'
POSTRULES_COLLECTION = "post_process_rules"
RULES_COLLECTION = "console_rules"
JOB_COLLECTION = "console_jobs"
SECTIONS_COLLECTION = "console_sections"
ELEMENTS_COLLECTION = "console_elements"
MAPPING_COLLECTION = "console_mapping"

CONFIGURE = "service/config"

CONFIGURE_EMAIL = "configure/email"

JRULES_CONFIG = {
    "URL": "http://172.20.5.179:38057/",
    "SAVE_EP": "rule/save",
    "GET_EP": "rules"
}

DEFAULT_SECTION = {
    "name": "section",
    "section_id": "default",
    "type": "section",
    "is_deleted": False,
    "pages": {
        "start": 1,
        "end": 1
    },
    "start_identifier": {
        "text_marker": {
            "keywords": [

            ],
            "is_header": False,
            "headings": [

            ]
        },
        "visual_marker": [

        ]
    },
    "end_identifier": {
        "text_marker": {
            "keywords": [

            ],
            "headings": [

            ]
        },
        "visual_marker": [

        ]
    }
}
UNKNOWN_TYPES = ["unknown_known", "unknown_unknown"]
SFTP_HOME = 'sftp_home/'
TEMPLATE_TRAIN_SAMPLES_COLLECTION = "console_templates_samples_data"
TEMPLATE_TRAIN_UPLOAD_ENDPOINT = "template/train/sample/upload"
TEMPLATE_TRAIN_TRIGGER_ENDPOINT = "template/train/trigger"

HTTP_PROTOC = 'http://'
CASE_MANAGEMENT_ENDPOINT = {"status_update": "case-management/rest/servicecalls/saveAttachCaseStatus",
                            "doc_state": "case-management/rest/metricservices/getStateData/",
                            "camunda_rest_services_url": "case-management/rest/servicecalls"
                            }

CASE_MANAGEMENT_STATES = {"classified": "classify",
                          "extracted_metadata": "classify",
                          "processed": "post_processing",
                          "class_reviewed": "processing",
                          "processed_classify": "processing",
                          "reviewed": "review"}

SERVICE_NAME = "console-api"

STATUS_CODES = {
    'OK': 200,
    'CREATED': 201,
    'DELETED': 202,
    'NON_AUTHORATIVE': 203,
    'NO_CONTENT': 204,
    'FOUND': 302,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'METHOD_NOT_ALLOWED': 405,
    'NOT_ACCEPTABLE': 406,
    'PROXY_AUTH_REQUIRED': 407,
    'REQUEST_TIMEOUT': 408,
    'CONFLICT': 409,
    'PRECONDITION_FAILED': 412,
    'PAYLOAD_TOO_LARGE': 413,
    'URI_TOO_LONG': 414,
    'UNSUPPORTED_MEDIA': 415,
    'MISDIRECTED_REQUEST': 421,
    'UNPROCESSABLE_ENTITY': 422,
    'LOCKED': 423,
    'PRECONDITION_REQUIRED': 428,
    'TOO_MANY_REQUESTS': 429,
    'UNAVAILABLE_FOR_LEGEL_REASON': 451,
    'INTERNAL_SERVER_ERROR': 500,
    'NOT_IMPLEMENTED': 501,
    'BAD_GATEWAY': 502,
    'SERVICE_UNAVAILABLE': 503,
    'GATEWAY_TIMEOUT': 504,
    'INSUFFICIENT_STORAGE': 507,
    'NETWORK_AUTHENTICATION_REQUIRED': 511
}

WORKFLOW_QUEUE_COLLECTION = 'workflow_queue'

CUSTOM_FUNCTIONS_ENDPOINT = {
    'GET': 'faas/xpms_function/get',
    'DETAILS': 'faas/xpms_function/details',
    'ENABLE': 'faas/xpms_function/enable',
    'DELETE': 'faas/xpms_function/delete',
    'OPEN': 'faas/xpms_function/open',
    'CREATE': 'faas/xpms_function/create',
    'PUBLISH': 'faas/xpms_function/publish',
    'TEST': 'faas/xpms_function/test',
    'LOGS': 'faas/xpms_function/logs',
    'SAVE': 'faas/xpms_function/save',
    "ENABLE_VERSION": "faas/xpms_function/enable_version"
}

NER_LABEL_ENDPOINT = {'GET': 'ner/labels/get',
                      'CREATE': 'ner/labels/create'}

ONTOLOGY_ENDPOINT = {
    'GET': 'ontology/service/get',
    'SAVE': 'ontology/service/save',
    'GET_DETAILS': 'ontology/service/details',
    'ENABLE': "ontology/service/enable"}

PIPELINE = {
    'MANUAL_TRIGGER': 'manual/review/job/complete',
    'GET_PIPELINE': 'pipeline/get/',
    'TRIGGER_PIPELINE': 'pipeline/trigger'
}

# constants for default pipeline groups
PIPELINE_VARIABLES = {
    'INGEST_DOCUMENT': 'ingest_document',
    'FILE_SOURCE': 'file_source',
    'GROUPS': 'extract_text',
    'EXTRACTION': 'extract_domain_objects',
}

# constants for insight service request type
SERVICE_REQUEST_TYPES = {
    'INGEST_DOCUMENT': 'ingest_document'
}

# Key_Cloak service integration points
KEY_CLOAK_API_URI = HTTP_PROTO + os.environ['ADMIN_API_URL']
KEY_CLOAK_API_URI += ':' + os.environ['ADMIN_API_PORT']
KEY_CLOAK_API_URI = KEY_CLOAK_API_URI if KEY_CLOAK_API_URI.endswith("/") \
    else KEY_CLOAK_API_URI + "/"
KEY_CLOAK_USER_GROUPS_ENDPOINT = 'groups'
KEY_CLOAK_USER_ROLES_ENDPOINT = 'roles'
KEY_CLOAK_USERS_ENDPOINT = 'users'

# Solution Collection
SOLUTION_COLLECTION = 'solutions'

DOC_COUNT = 1000

# Sources Collection
SOURCES_COLLECTION = 'sources'

THRESHOLD_COLLECTION = 'thresholds'

CONSOLE_API_URL = os.environ['KEYCLOAK_APP_REDIRECT_URL']
CONSOLE_API_URL = CONSOLE_API_URL if CONSOLE_API_URL.endswith("/") \
    else CONSOLE_API_URL + "/"

HTTP_PROTOC = 'http://'
CASE_MANAGEMENT_SERVICE_URL = HTTP_PROTOC + os.getenv("CASE_MANAGEMENT_SERVICE_URL")
CASE_MANAGEMENT_SERVICE_URL = CASE_MANAGEMENT_SERVICE_URL if CASE_MANAGEMENT_SERVICE_URL.endswith("/") \
    else CASE_MANAGEMENT_SERVICE_URL + "/"
