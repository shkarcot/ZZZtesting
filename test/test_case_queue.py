import os
import pytest
import django
from config_vars import SERVICE_NAME
from uuid import uuid4
from xpms_common import trace

os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()
from services.case_queue import process_case_assignment_task, validate_case_assignment_payload, \
    fetch_temp_soln_id_from_case_queue, get_document_record, update_doc_life_cycle, fetch_agent_list, \
    validate_payload, update_cases_counters, request_data_validation, update_data_dict, \
    insert_queue, update_queue, prepare_returning_data_json, delete_queue, fetch_all_queues_cases_data,\
    process_db_data, update_count, get_queue_details, get_default_doc_lifecycle_data, perform_queue_deletion
from test.case_queue_test_vars import post_case_queue_var, queue_id, del_case_queue, post_document_var, \
    del_document_var, case_queue_var, solution_id, template_id, queue_list, doc_var, \
    del_false_case_queue,update_case_queue

tracer = trace.Tracer.get_instance(SERVICE_NAME)
context = tracer.get_context(request_id=str(uuid4()), log_level="ERROR")
context.start_span(component=__name__)


post_case_queue_var()
post_case_queue_var({"queue_id": 000000})
post_document_var()
payload_msg = {"file_name": "Resume", "doc_id": "684a62d9-5723-4b31-a27b-7e4e42ab9688",
                                      "assignee": "default_bu",
                                      "status": "New",
                                      "queue_id": 000000,
                                      "doc_state": "classified"}
a_test_1 = {}
a_test_2 = {"file_name": "Resume"}
a_test_3 = {"file_name": "Resume", "doc_state": "classified"}
a_test_4 = {"file_name": "Resume", "doc_state": "classified", "doc_id": "7e4e42ab9688"}
a_test_5 = {"file_name": "Resume", "doc_state": "classified", "doc_id": "7e4e42ab9688", "assignee": "default_bu"}
a_test_6 = {"file_name": "Resume", "doc_state": "classified", "doc_id": "7e4e42ab9688", "assignee": "default_bu",
            "status": "New"}
a_test_7 = {"file_name": "Resume", "doc_state": "classified", "doc_id": "7e4e42ab9688","queue_id":000000}
b_test = {"status": "test", "doc_state": "test", "queue_id": 000000, "case_id": "test"}
b_test_1 = {}
b_test_2 = {"status": "test"}
b_test_3 = {"status": "test", "doc_state": "test"}
b_test_4 = {"status": "test", "doc_state": "test", "queue_id": 000000}
ele = {'assignee': None, 'assigned_ts': None, 'status': 'New', 'queue_name': 'processing', 'closed_ts': None,
       'is_assigned': False, 'queue_id': 000000}
queue_dict = {'processing': {}}
q_name = 'processing'
false_queue_id = 000000


@pytest.mark.parametrize("test_msg, expected",
                         [
                             (payload_msg, (None, True)),
                             (a_test_1, ({'status': 'failure', 'msg': 'filename is not provided.'}, False)),
                             (a_test_2, ({'status': 'failure', 'msg': 'document state is not provided.'}, False)),
                             (a_test_3, ({'status': 'failure', 'msg': 'Case Id is not provided.'}, False)),
                             (a_test_4, ({'status': 'failure', 'msg': 'Please provide either queue_id or assignee name.'}, False)),
                             (a_test_5, ({'status': 'failure', 'msg': 'Document status is not provided.'},
                                         False)),
                             (a_test_6, (None, True)),
                             (a_test_7, ({'status': 'failure', 'msg': 'Document status is not provided.'},
                                         False))
                         ])
def test_validate_case_assignment_payload(test_msg, expected):
    response = validate_case_assignment_payload(test_msg)
    assert response == expected


def test_fetch_temp_soln_id_from_case_queue():
    response = fetch_temp_soln_id_from_case_queue(context, None, false_queue_id)
    assert response == ([], [], [])


def test_get_document_record():
    response = get_document_record("error_doc", context)
    assert response is None


def test_fetch_agent_list():
    res = fetch_agent_list(false_queue_id, context)
    assert res == []
    res = fetch_agent_list(queue_id, context)
    assert res is not None


@pytest.mark.parametrize("test_msg, expected",
                         [
                            (b_test, True),
                            (b_test_1, False),
                            (b_test_2, False),
                            (b_test_3, False),
                            (b_test_4, False)])
def test_validate_payload(test_msg, expected):
    response = validate_payload(test_msg)
    assert response == expected


def test_update_doc_life_cycle():
    response = update_doc_life_cycle(case_queue_var, queue_id, None, "default_bu", "New", "classified")
    assert type(response) == dict


def test_fetch_all_queues_cases_data():
    response = fetch_all_queues_cases_data("user_sv", context)
    assert type(response) == dict


def test_get_queue_details():
    response = get_queue_details("post_processed", context, template_id, solution_id)
    assert response == (None, None)


def test_get_default_doc_lifecycle_data():
    response = get_default_doc_lifecycle_data("post_processed", context, template_id, solution_id)
    assert type(response) == dict
    assert "is_assigned" and 'assignee' and 'assigned_ts' and 'closed_ts' and 'status' in response.keys()


def test_process_db_data():
    res = process_db_data(doc_var, queue_list, context)
    assert type(res) == dict
    assert "status" and "msg" and "data" in res.keys()


def test_update_cases_counters():
    res = update_cases_counters(queue_dict, q_name, ele, 0, 0, 0, 0)
    assert res == ({'processing': {'unassigned_case_count': 1, 'queue_id': 000000}}, 1, 0, 0, 0)


def test_update_count():
    res = update_count(q_name, queue_dict, "test")
    assert res == {'processing': {'queue_id': 000000, 'test': 1, 'unassigned_case_count': 1}}
    res = update_count(q_name, queue_dict, "processing")
    assert res == {'processing': {'processing': 1, 'queue_id': 000000, 'test': 1, 'unassigned_case_count': 1}}


def test_request_data_validation():
    res = request_data_validation(000000)
    assert res == False


@pytest.mark.parametrize("test_msg, expected",
                         [
                            ({"solution": [], "solution_id": [], "agents": [], "processing_state": []},
                             {"solution": [], "solution_id": [], "agents": [], "processing_state": []}),
                             ({"solution": "test,var", "solution_id": [], "agents": [], "processing_state": []},
                              {"solution": "test,var", "solution_id": [], "agents": [], "processing_state": []}),
                             ({"solution": [], "agents": "var,test", "processing_state": []},
                              {"solution": [], "agents": ["var", "test"], "processing_state": []}),
                             ({"solution": [], "processing_state": "var,test", "agents": []},
                              {"solution": [], "processing_state": ["var", "test"], "agents": []})
                         ])
def test_update_data_dict(test_msg, expected):
    response = update_data_dict(test_msg)
    assert response == expected


def test_insert_queue():
    response = insert_queue({}, q_name, context)
    assert response == {"status": "success", "msg": "Queue processing created Successfully."}


def test_update_queue():
    response = update_queue({}, q_name, queue_id, context)
    assert response == {"status": "success", "msg": "Queue processing updated Successfully."}


def test_prepare_returning_data_json():
    res = prepare_returning_data_json([], "test_data", "test_list", "test", "test")
    assert type(res) == dict


def test_delete_queue():
    response = delete_queue(context, "")
    assert response == {'status': 'failure', 'msg': 'Failed to remove queue.'}
    response = delete_queue(context, 0)
    assert response == {'status': 'success', 'msg': 'Queue has been removed successfully.'}


def test_perform_queue_deletion():
    response = perform_queue_deletion("test_f_1234_id", context)
    assert response == {'status': 'failure', 'msg': 'Failed to remove queue.'}


def test_process_case_assignment_task():
    res = process_case_assignment_task(case_queue_var, solution_id, context)
    assert res == {'status': 'failure', 'msg': 'filename is not provided.'}


del_case_queue()
del_false_case_queue({"queue_id": 000000})
update_case_queue({"queue_id": 0})


@pytest.mark.run(order=1000)
def del_doc():
    return del_document_var()


del_doc()
