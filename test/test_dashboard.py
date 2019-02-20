import os
from unittest.mock import MagicMock

import django

from utilities import common

os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()
import json
from services.dashboard import generate_data
from services.dashboard import get_dashboard_docs
from test.test_case_queue import post_case_queue_var, del_case_queue
from django.test import RequestFactory



#adding document to the case queue collection
post_case_queue_var()

solution_id = "default_61a1cf82-a02b-44a9-80ab-5c911a0e843b"
doc_queue = {'document_type': '1753c24d-d594-41d5-a788-363a724ba838',
             'solution_id': 'qatest_c02eeb50-7530-4d42-bd55-0eec9f2ac78d',
             'created_ts': (2018, 7, 6, 12, 24, 26),
             'processing_state': ['post_processed', 'extracted'],
             'supervisor': ['test_sv', 'default_sv'], 'is_deleted': False,
             'queue_id': 460897, 'solution': 'qatest_test',
             'queue_name': 'extracted_test_rj', 'modified_ts': (2018, 7, 6, 12, 24, 26),
             'agents': ['default_bu', 'sol_bu']}


def test_generate_data():
    response = generate_data(solution_id)
    assert response is None
    response = generate_data(solution_id, file_id="test")
    assert response is None


res = {"tab_data": [
    {'description': 'Need classification', 'show_in': 'tab', 'queue': 30, 'state': 'classified', 'time_in_queue': 10,
     'display': 'Needs Classification', 'Accuracy': 97},
    {'description': 'processing', 'show_in': 'all', 'queue': 30, 'state': 'processing', 'time_in_queue': 10,
     'display': 'Processing', 'Accuracy': 97},
    {'description': 'processed', 'show_in': 'all', 'queue': 30, 'state': 'processed', 'time_in_queue': 10,
     'display': 'Post Processing', 'Accuracy': 97},
    {'description': 'reviewed', 'show_in': 'all', 'queue': 30, 'state': 'reviewed', 'time_in_queue': 10,
     'display': 'Reviewed', 'Accuracy': 97}]}


def test_get_dashboard_docs(monkeypatch):
    request_factory = RequestFactory()
    payload = {"filter_obj": {"page_no": 1,
                              "no_of_recs": 8,
                              "sort_by": "created_ts",
                              "order_by": False}, "queue_id": "460897", "role": "bu",
               "user_name": "default_bu"}
    request = request_factory.post('api/dashboard/docs/', json.dumps(payload),
                                   content_type='application/json')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=solution_id))
    response = get_dashboard_docs(request)
    assert type(response) == dict
    assert response is not None


#deleting the case_queue inserted document
del_case_queue()
