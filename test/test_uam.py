import json
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'

import django
django.setup()

from django.test import RequestFactory


from django.contrib.sessions.middleware import SessionMiddleware
from services import uam

def test_get_success():
    response = uam.get_success("test message", {})
    assert response['msg'] == "test message"
    assert response["sess_id"] == "FAKE_SESSION"


def test_auth_user():
    request_factory = RequestFactory()
    middleware = SessionMiddleware()
    request = request_factory.post('/api/auth', json.dumps({"email": 'abc_se', "password": "1234"}),
                                   content_type='application/json')
    middleware.process_request(request)
    response = uam.auth_user(request)
    assert response["status"] == "failure"
