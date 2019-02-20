from unittest.mock import MagicMock
import os
import django
from test.vars_test import page_db, page, insert_db, json1, temp, insert_map, insert_temp, map_data, columns
from utilities.common import is_request_timeout
import pytest
from requests import request
import json
from utilities import common
from django.test import RequestFactory
from config_vars import DOC_ELEMENTS_COLLECTION, DOCUMENTS_COLLECTION, MAPPING_COLLECTION, TEMPLATE_COLLECTION
from services.documents import get_review_text
from services.documents import get_document_details, documents_data, download_document_json, \
    page_group_review, process_text_feedback, process_complete_review,update_queue_status, \
    check_current_status, remove_items, update_queue_extracted_feedback, \
    get_confidence_score, get_review_state, get_doc_type, construct_table_data_new, get_groups_feedback, is_group_same,\
    get_score, get_all_elements, populate_fields, document_data, get_template_type, save_threshold_data, process_elements
from connections.mongodb import MongoDbConn
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()

page_db(page)
insert_db(json1)
insert_map(map_data)
insert_temp(temp)
test_msg_1 = {'request': request,
              'doc_id': 'afe2d978a-0f6a-4844-b872-812222764908', 'page_no': 1}


@pytest.mark.parametrize("test_var1,test_var2, expected",
                         [
                             ("failed", {"error": {"desc": "failed_test"}}, "failed_test"),
                             ("failed", {"error": {"failed_test"}}, ""),
                             ("failed", {"status": "failed"}, ""),
                             ("classified", {"status": True}, "CLASSIFY")
                         ])
def test_get_review_text(test_var1, test_var2, expected):
    response = get_review_text(test_var1, test_var2)
    assert response == expected


def test_get_document_details(monkeypatch):
    request_factory = RequestFactory()
    request = request_factory.get('/api/documents/afe2d978a-0f6a-4844-b872-812222764908/1/')
    data = json1
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=data['solution_id']))
    response = get_document_details(request, data['doc_id'], data['page_no'])
    assert "status" in response.keys()
    response = get_document_details(request, doc_id='false case', page_no=1)
    assert response['status'] == 'failure'


def test_get_groups_feedback():
    doc_group = [{"score": 0.9231292545574594, "end_page": 1, "start_page": 1, "template_score": 0,
                  "insight_id": "3a9b0026-962d-410d-accd-24c50165e257", "template_name": "unknown",
                  "template_id": "unknown"}, {"score": 0.9231292545574594, "end_page": 2, "start_page": 2,
                                              "template_score": 0, "insight_id": "4a9b0026-962d-410d-accd-24c50165e257",
                                              "template_name": "unknown", "template_id": "unknown"}]
    payload = {"page_groups": [{"score": 0.9231292545574594, "end_page": 2, "start_page": 1, "template_score": 0,
                                "insight_id": "3a9b0026-962d-410d-accd-24c50165e257", "template_name": "unknown",
                                "template_id": "unknown"}]}

    expected_response = [{'data': {'template_name': 'unknown', 'start_page': 1, 'end_page': 2,
                                   'template_id': 'unknown'}, 'insight_id': '3a9b0026-962d-410d-accd-24c50165e257',
                          'action': 'upsert'}, {'insight_id': '4a9b0026-962d-410d-accd-24c50165e257',
                                                'action': 'delete'}]
    response = get_groups_feedback(payload, doc_group)
    assert response == expected_response


def test_is_group_same():
    a = {"key1":"value1","key2":"value2"}
    b = {"key1":"value1","key2":"value3"}
    keys = ["key1","key2"]
    response = is_group_same(a,b,keys)
    assert response == False

    b = {"key1":"value1","key2":"value2"}
    response = is_group_same(a,b,keys)
    assert response == True

    a = {"key1":"value1","key2":"value2","key3":"value3"}
    keys.append("key3")
    response = is_group_same(a,b,keys)
    assert response == False


def test_get_score():
    ele = {"score":80,"confidence":90}
    response = get_score(ele)
    assert response == 80

    ele.pop("score")
    response = get_score(ele)
    assert response == 90

    ele = {}
    response = get_score(ele)
    assert response == 0


def test_get_all_elements():
    elements = [{"type":"section","children":[{"type":"field","parameters":{}},{"type":"field","parameters":{}}]}]
    expected_response = [{"type":"field","parameters":{}},{"type":"field","parameters":{}}]
    response = get_all_elements(elements,[])
    assert response == expected_response


def test_populate_fields():
    response = populate_fields("test_entity","grouped_entity",parent_entity_id="id1",
                    extracted_name="",temp_id="id2",entity_id="id3")
    assert response["temp_id"] == "id2-id3"


def test_process_elements():
    elements = [{"type":"section","id":"id1", "elements":
        [{"id":"id2","type":"heading","parameters":{"text":"name_test"}}]}]
    counts = {"extracted": 0, "reviewed": 0}
    expected_elements = [{"type":"section","id":"id1","name":"name_test","temp_id":"id1","elements":
        [{"id":"id2","temp_id":"id1_id2","type":"heading","parameters":{"text":"name_test"}}]}]
    expected_counts = {"extracted": 2, "reviewed": 0}
    response = process_elements(elements,counts)
    assert response == expected_elements
    assert expected_counts == counts


def test_page_group_review(monkeypatch):
    request_factory = RequestFactory()
    page_data = page
    request = request_factory.get('/api/grouping/review/afe2d978a-0f6a-4844-b872-812222764908/$')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    response = page_group_review(request, page_data['doc_id'])
    assert response['status'] == 'success'
    response = page_group_review(request, 'http://kfvhmsef.safjiu')
    assert response['status'] == 'failure'
    response = page_group_review(request, page_data['doc_id'])
    assert "status" in response.keys()


def test_document_data():
    page_data = page
    response = document_data(page_data['doc_id'], page_data['solution_id'],
                             entity_reqd=True, rules_reqd=True)
    assert "status" and  "msg" and "data" in response.keys()


def test_get_template_type():
    res = get_template_type("unknown","test_solution")
    assert res == "unknown"


def test_save_threshold_data():
    payload={"data":{}}
    res =save_threshold_data("test_solution",payload)
    assert "status" and "msg" in res.keys()


test_msg_3 = {'filter_obj': {}}
page_data = page


@pytest.mark.parametrize("test_msg",[(test_msg_3)])
def test_documents_data(test_msg):
    response = documents_data(page_data['solution_id'], test_msg['filter_obj'])
    assert response['status'] == 'success'

    response = documents_data(page_data['solution_id'], '125678')
    assert response['status'] == 'failure'
    response = documents_data(page_data, 'filter_obj')
    assert response['status'] == 'failure'
    response = documents_data(page_data['solution_id'], test_msg['filter_obj'])
    assert "status" and "msg" in response.keys()


def test_download_document_json(monkeypatch):
    request_factory = RequestFactory()
    request = request_factory.get\
        ('/api/download/json/afe2d978a-0f6a-4844-b872-812222764908/$')
    page_data = page
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    response = download_document_json(request, page_data['doc_id'])
    assert response is not None


def test_process_text_feedback(monkeypatch):
    page_data = page
    request_factory = RequestFactory()
    request = request_factory.post('/api/feedback/text/$',
           json.dumps({"element": {"section_id": "default",
                                   "type": "field", "text": "hello",
                                   "is_corrected": True,
                                   "label": "name"},
                       "request_type": "extract_text",
                       "doc_id": "afe2d978a-0f6a-4844-b872-812222764908"}),
           content_type='application/json')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    response = process_text_feedback(request)
    assert "status" and "msg" in response.keys()
    request = request_factory.post('/api/feedback/text/$'
            , json.dumps({'doc_id': 'afe2d978a-0f6a-4844-b872-812222764908',
                    'element': 'data','request_type': 'fetched'}),
                     content_type='application/json')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    response = process_text_feedback(request)
    assert response['status'] == 'failure'


def test_process_complete_review(monkeypatch):
    request_factory = RequestFactory()
    request = request_factory.get\
        ('/api/completeReview/text/afe2d978a-0f6a-4844-b872-812222764908/$')
    page_data = page
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    # response = process_complete_review(request, page_data['doc_id'])
    # assert response['status'] == 'success'
    response = process_complete_review(request, page_data['solution_id'])
    assert response['status'] == 'failure'
    response = process_complete_review(request, '963412043291')
    assert response['status'] == 'failure'


def test_entity_process_complete_review(monkeypatch):
    request_factory = RequestFactory()
    request = request_factory.get('/api/completeReview/entity/afe2d978a-0f6a-4844-b872-812222764908/$')
    doc_id = "afe2d978a-0f6a-4844-b872-812222764908"
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    res = process_complete_review(request, doc_id)
    assert res['status'] == 'failure'
    res = process_complete_review(request, 'uwoifwgf982348rt')
    assert res['status'] == 'failure'
    res = process_complete_review(request, '935739734343')
    assert res['status'] == 'failure'


# @pytest.mark.parametrize("expected",[(True)])
# def test_process_entity_linking(expected, monkeypatch):
#     request_factory = RequestFactory()
#     request = request_factory.get\
#         ('/api/entitylink/afe2d978a-0f6a-4844-b872-812222764908/$')
#     page_data = page
#     monkeypatch.setattr(common, 'get_solution_from_session',
#                         MagicMock(return_value=page_data['solution_id']))
#     res = process_entity_linking(request, page_data['doc_id'])
#     status = res['status']
#     if status == 'success':
#         status = True
#     assert status == expected


def test_is_request_timeout():
    response = {'msg':'Timeout'}
    assert is_request_timeout(response) is True
    response = {'status':'success'}
    assert is_request_timeout(response) is False


def test_update_queue_status():
    assert update_queue_status(data ="document",
                               state= "extracted", status ="In progress",
                               update_reqd=True) is not None
    assert update_queue_status(data ="document",
                               state= "extracted", status ="Closed",
                               update_reqd=True) is not None


def test_check_current_status():
    document = page
    res = check_current_status(document, state= "processed")
    assert res is None



def test_remove_items():
    page_data = page
    response = remove_items(page_data,["entity_feedback","entity_insight_map"])
    assert response is not None
    assert response['doc_id'] == "86645a0d-aa08-41ba-9e08-52a136fe4ef4"


def test_update_queue_extracted_feedback():
    page_data = page
    res = update_queue_extracted_feedback(page_data, page_data['doc_id'],"extracted")
    assert res == {"status": "success", "msg": "Feedback submitted"}
    res = update_queue_extracted_feedback(document= '', doc_id = '',state="extracted")
    assert res['status'] == 'failed'



# def test_fetch_sections_data(monkeypatch):
#     request_factory = RequestFactory()
#     request = request_factory.get('/api/extractiondata/afe2d978a-0f6a-4844-b872-812222764908/')
#     page_data = page
#     monkeypatch.setattr(common, 'get_solution_from_session',
#                         MagicMock(return_value=page_data['solution_id']))
#     res = fetch_sections_data(request, page_data['doc_id'])
#     assert res['status'] == 'success'
#     res = fetch_sections_data(request, doc_id = '')
#     assert res['status'] == 'failure'


@pytest.mark.parametrize("test_var1,test_var2, expected",
                         [
                             ({"doc_state":"processed"}, True, 100),
                             ({"doc_state":"reviewed"}, True, 100),
                             ({"doc_state":"extracted"}, True, 100),
                             ({"doc_state":"processing"},True, 0)
                         ])
def test_get_confidence_score(test_var1, test_var2, expected):
    response = get_confidence_score(test_var1, test_var2)
    assert response == expected


def test_get_review_state():
    response = get_review_state(entity_reqd = False,rules_reqd = False, doc_type='image',template_type="known")
    assert response is not None


def test_construct_table_data_new():
    counts = {"extracted": 0, "reviewed": 0}
    response = construct_table_data_new(columns, "1234",counts)
    assert len(response) == 2


def test_get_doc_type():
    page_data = page
    response = get_doc_type(page['metadata']['properties']['extension'])
    assert response is not None


def test_get_doc_type():
    page_data = page
    response = get_doc_type(page['metadata']['properties']['extension'])
    assert response is not None

"""delete DOC_ELEMENTS_COLLECTION database record"""

def test_delete_db(doc_id="afe2d978a-0f6a-4844-b872-812222764908"):
    delete_data = MongoDbConn.remove(DOC_ELEMENTS_COLLECTION,
                                     {"doc_id": doc_id})
    return True


"""delete MAPPING_COLLECTION database record"""

def test_delete_mapdb(solution_id="aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7"):
    delete_map = MongoDbConn.remove(MAPPING_COLLECTION,
                                    {"solution_id":solution_id})
    return True


"""delete DOCUMENTS_COLLECTION"""
def test_delete_doc_db(doc_id="afe2d978a-0f6a-4844-b872-812222764908"):
    delete_doc_db = MongoDbConn.remove(DOCUMENTS_COLLECTION,
                                       {"doc_id":doc_id})
    return True


"""delete TEMPLATE_COLLECTION"""

def test_delete_temp_db(solution_id="aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7"):
    delete_doc_db = MongoDbConn.remove(TEMPLATE_COLLECTION,
                                       {"solution_id":solution_id})
    return True




