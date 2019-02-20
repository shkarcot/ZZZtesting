import os
import json
import pytest
import django
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()
from django.test import RequestFactory
from utilities.common import is_draft_valid
from services.feedback import feedback_schema, update_intent_review
from test.vars_testing import TEST_FEEDBACK


def test_valid_feedback():
    assert is_draft_valid(feedback_schema, TEST_FEEDBACK)


payload = {
        "feedback": [{"insight_id": "24eb142b-14e8-4247-8dcf-43abe84cd523:_:1000",
                      "type": "action", "vote": 1, "rate": 7, "text": "(1"
                      }]}


@pytest.mark.run(order=10)
def test_update_intent_review():
    request_factory = RequestFactory()
    request = request_factory.post('intentreview/$', json.dumps({
        'doc_id': 'afe2d978a-0f6a-4844-b872-812222764908', "elements": "data"}),
                                   content_type='application/json')
    response = update_intent_review(request)
    assert response['status'] == 'success'
    request = request_factory.post('intentreview/$', json.dumps({
        'doc_id': 'afe2d978a-0f6a-4844-b872-812222764908', "elements1": "data"}),
                                   content_type='application/json')
    response = update_intent_review(request)
    assert response['status'] == 'failure'
    request = request_factory.post('intentreview/$', json.dumps({
        'doc_id': 'afe2d978a-0f6a-4844-b872-812222764908'}),
                                   content_type='application/json')
    response = update_intent_review(request)
    assert response['status'] == 'failure'
