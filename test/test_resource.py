import os
import pytest
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
import django
django.setup()
import json
from unittest.mock import MagicMock
from django.contrib.sessions.middleware import SessionMiddleware
from django.test import RequestFactory
from config_vars import RESOURCES_COLLECTION
from connections.mongodb import MongoDbConn
from services.resource import process_workflow_files, process_workflow_api_spec, save_uploaded_files, get_all_resources
from utilities import common


resource_data = {
    "is_deleted": False,
    "contents": ["condition"],
    "created_ts": "2018-06-08T11:48:21.533+0000",
    "resource_id": "a9d56d363-21ff-48c8-a489-6c274061247e",
    "tag": "condition.entity",
    "type": "corpus",
    "solution_id": "aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7"
}


@pytest.mark.run(order=1)
def insert_resource_data(resource_data= None):
    MongoDbConn.insert(RESOURCES_COLLECTION, resource_data)
    return resource_data['resource_id']


insert_resource_data = insert_resource_data(resource_data)


def get_resource_data(resource_id = None):
    query = {"resource_id": resource_id}
    resource_data = MongoDbConn.find_one(RESOURCES_COLLECTION, query)
    return resource_data


get_resource_data(resource_id = "a9d56d363-21ff-48c8-a489-6c274061247e")


def test_process_workflow_files():
    request_factory = RequestFactory()
    request = request_factory.get('/api/camunda/workflow/')
    res = process_workflow_files(request)
    assert res['status'] == 'success'


def test_process_workflow_api_spec():
    request_factory = RequestFactory()
    request = request_factory.get('/api/spec/')
    res = process_workflow_api_spec(request)
    assert res['status'] == 'success'


def test_save_uploaded_files(monkeypatch):
    request_factory = RequestFactory()
    filename = "dict_only.json"
    request = request_factory.post('/api/data/upload/(?P<type>[\w\-]+)/$',
                                   json.dumps({'filename': filename}),
                                   content_type='application/json')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=resource_data['solution_id']))
    res = save_uploaded_files(request, type='')
    assert res['status'] == 'failure'
    assert res["msg"] == "No files attached to the request"


def test1_save_uploaded_files():
    request_factory = RequestFactory()
    middleware = SessionMiddleware()
    request = request_factory.get('/api/data/upload/')
    middleware.process_request(request)
    res = save_uploaded_files(request, type=None)
    assert res['status'] == 'success'


def test_get_all_resources():
    res = get_all_resources(resource_data['type'],
                            resource_data['solution_id'])
    assert res['status'] == 'success'
    type = None
    res = get_all_resources(type, resource_data['solution_id'])
    assert res['status'] == 'success'


"""delete resource data"""
def test_resource_data(resource_id="a9d56d363-21ff-48c8-a489-6c274061247e"):
    MongoDbConn.remove(RESOURCES_COLLECTION,
                                    {"resource_id": resource_id})
    return True
