from django.test import RequestFactory
from config_vars import RULES_COLLECTION
from connections.mongodb import MongoDbConn
from services.rules import delete_rule, get_config, get_custom_rules, update_custom_rule, process_rules,\
    update_rule, is_rule_valid, get_rule, get_rule_info, execute_rules, format_source_data, \
    format_hierarchy_rules, execute_custom_rules, process_custom_rules
from utilities import common
import json
from unittest.mock import MagicMock
import os
import pytest
import django
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()


rules_data = {
    "rule_id": "aa0c6bae1-a458-4a3a-ba0e-30f4cd15128a",
    "solution_id": "aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7",
    "rule_name": "",
    "rule_type": "T",
    "rule": {
        "actions": [
            {
                "act": "join",
                "attr": {
                    "lval": [
                        "state_patient",
                        "zipcode_patient"
                    ],
                    "sep": ".",
                    "rval": "Claim.Patient.state_zipcode"
                },
                "op": "join"
            }
        ]
    },
    "desc": ""
}


def get_rules_data(rule_id=None):
    query = {"rule_id": rule_id}
    rules_data = MongoDbConn.find_one(RULES_COLLECTION, query)
    return rules_data


get_rules_data(rule_id="aa0c6bae1-a458-4a3a-ba0e-30f4cd15128a")


@pytest.mark.run(order=1)
def insert_rules_data(rules_data = None):
    MongoDbConn.insert(RULES_COLLECTION, rules_data)
    return rules_data['solution_id']


@pytest.mark.run(order=2)
def test_update_rule():
    page_data = rules_data
    res = update_rule(page_data['solution_id'], page_data)
    assert "status" in res.keys()


@pytest.mark.run(order=3)
def test_get_config(monkeypatch):
    page_data = rules_data
    request_factory = RequestFactory()
    request = request_factory.get('/api/jrules/config/')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=rules_data['solution_id']))
    res = get_config(request)
    assert res['status'] == 'success'


@pytest.mark.run(order=4)
def test_get_custom_rules():
    page_data = rules_data
    res = get_custom_rules(page_data['solution_id'], type = page_data['rule_type'])
    assert "msg" and "status" in res.keys()


@pytest.mark.run(order=5)
def test_update_custom_rule():
    page_data = rules_data
    res = update_custom_rule(solution_id = rules_data['solution_id'], data= rules_data)
    assert res['status'] == 'failure'
    res = update_custom_rule(solution_id = None, data = None)
    assert res['status'] == 'failure'


@pytest.mark.run(order=6)
def test_process_rules(monkeypatch):
    request_factory = RequestFactory()
    request = request_factory.get('/api/jrules/')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=rules_data['solution_id']))
    res = process_rules(request)
    assert "status" in res.keys()
    res = process_rules(request = None)
    assert res['status'] == 'failure'


@pytest.mark.run(order=7)
def test_is_rule_valid():
    response = is_rule_valid(rule = None)
    assert response is False


@pytest.mark.run(order=8)
def test_get_rule():
    page_data = rules_data
    res = get_rule(page_data['solution_id'], page_data['rule_id'])
    assert res is not None
    res = get_rule(page_data['solution_id'], rule_id = None)
    assert "status" in res.keys()


@pytest.mark.run(order=9)
def test_get_rule_info():
    page_data = rules_data
    res = get_rule_info(page_data['solution_id'], page_data['rule_id'])
    assert res is None


@pytest.mark.run(order=10)
def test_execute_rules(monkeypatch):
    page_data = rules_data
    request_factory = RequestFactory()
    request = request_factory.post('/api/jrules/test/'
                                   , json.dumps({'rules_data': rules_data}),
                                   content_type='application/json')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    response = execute_rules(request)
    assert response['status'] == 'failure'


@pytest.mark.run(order=11)
def test_execute_custom_rules(monkeypatch):
    page_data = rules_data
    request_factory = RequestFactory()
    request = request_factory.post('/api/jrules/customtest/'
                                   , json.dumps({'rules_data': rules_data}),
                                   content_type='application/json')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    response = execute_custom_rules(request)
    assert response['status'] == 'failure'


@pytest.mark.run(order=12)
def test_process_custom_rules(monkeypatch):
    page_data = rules_data
    request_factory = RequestFactory()
    request = request_factory.get('/api/jrules/customtest/')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=page_data['solution_id']))
    response = process_custom_rules(request, type = page_data['rule_type'])
    assert response['status'] == 'success'
    response = process_custom_rules(request = None, type=None)
    assert response['status'] == 'failure'


@pytest.mark.run(order=13)
def test_format_source_data():
    page_data = rules_data
    res = format_source_data(rules_data['rule'])
    assert res is not None
    assert type(res) == dict


@pytest.mark.run(order=14)
def test_format_hierarchy_rules():
    res = format_hierarchy_rules(attr='')
    assert res is not None


@pytest.mark.run(order=15)
def test_delete_rule():
    page_data = rules_data
    res = delete_rule(page_data['solution_id'], page_data['rule_id'])
    assert "status" in res.keys()
    response = delete_rule(solution_id = None, rule_id = None)
    assert "status" in response.keys()


@pytest.mark.run(order=20)
def test_delete_rules_data(rule_id="aa0c6bae1-a458-4a3a-ba0e-30f4cd15128a"):
    delete_rules_data = MongoDbConn.remove(RULES_COLLECTION, {"rule_id":rule_id})
    return True