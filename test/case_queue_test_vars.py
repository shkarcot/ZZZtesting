from connections.mongodb import MongoDbConn
from config_vars import CASE_QUEUE_COLLECTION, DOCUMENTS_COLLECTION
from datetime import datetime

display_to_d_state = {'Needs Classification': 'classified',
                      'Post Processing': 'post_processed',
                      'Processing': 'processing',
                      'Reviewed': 'reviewed',
                      'Extraction': 'extracted',
                      'Annotation & Entity Linking': 'processed',
                      'Error': 'failed'}

case_queue_var = {
    "document_type": ["d9c2a9dd-2a7f-45a2-a650-ef5dcc204dba",
                      "df71fbb0-1cb7-4320-b457-5eef26ad5574"],
    "created_ts": "2018-06-29T10:22:28.005+0000",
    "processing_state": ["post_processed"],
    "queue_name": "Test",
    "modified_ts": datetime.now(),
    "is_deleted": True,
    "solution": ["test"],
    "queue_id": 000000,
    "agents": ["test_bu"],
    "solution_id": "test_f03b027a-0f5c-49dc-923e-9093412dd75c",
    "supervisor":["test_sv"]

}
doc_var = {
    "doc_id": "test_123",
    "solution_id": "test_f03b027a-0f5c-49dc-923e-9093412dd75c",
    "doc_processing_state": "ingest",
    "child_documents": [],
    "updated_ts": "2018-04-19T13:11:02.351060",
    "doc_state": "processing",
    "doc_attributes": None,
    "root_id": "test_3ea39ad5-eb26-4788-86cc-fbe1b2caa8b9",
    "file_path": "sample_a0b69e64-748f-4e11-953e-169a4da7ab2f/documents/3ea39ad5-eb26-4788-"
                 "86cc-fbe1b2caa8b9/b6540773-26a6-4dc3-868a-0e3af92ec8e8.pdf",
    "is_root": True,
    "metadata": {
        "file_name": "CSF_4",
        "extn": "pdf"
    },
    "created_ts": "2018-04-19T13:11:02.351073",
    "template_id": "test_123"
}

queue_id = 000000
solution_id = "test_f03b027a-0f5c-49dc-923e-9093412dd75c"
template_id = "test_123"


def post_case_queue_var(data=case_queue_var):
    MongoDbConn.insert(CASE_QUEUE_COLLECTION, data)
    return "done"


def del_case_queue(var=solution_id):
    MongoDbConn.remove(CASE_QUEUE_COLLECTION, {"solution_id": var})
    return True


def del_false_case_queue(var):
    MongoDbConn.remove(CASE_QUEUE_COLLECTION, var)
    return True


def update_case_queue(var):
    MongoDbConn.update(CASE_QUEUE_COLLECTION, var,{"is_deleted":True})
    return True

def post_document_var(data=doc_var):
    MongoDbConn.insert(DOCUMENTS_COLLECTION, data)
    return "done"


def del_document_var(var=solution_id):
    MongoDbConn.remove(DOCUMENTS_COLLECTION, {"solution_id": var})
    return True


def del_test_entity(solution_id=None):
    query = {"solution_id": solution_id}
    data = MongoDbConn.remove(CASE_QUEUE_COLLECTION, query)
    return data


temp_list = ["unknown"]
soln_list = ['unstructred_4a77aee2-9c3c-4fcb-84b3-97641ab90903']
queue_list = ["processing"]
