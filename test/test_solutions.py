import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
import django
django.setup()
from unittest.mock import MagicMock
from django.test import RequestFactory
from utilities import common
from services.solutions import SolutionService, get_solution_id, solution_request
from test.vars_testing import TEST_SOLN, TEST_SOLN_NAME

solution_id = None


def test_create_solution():
    response = SolutionService().create_solution(TEST_SOLN)
    print(response)
    try:
        assert response["status"] == "success"
    except AssertionError:
        assert "solution name already exists" in response["msg"]


def test_get_solution():
    response = SolutionService().get_solution(solution_name=TEST_SOLN_NAME)
    global solution_id
    print(response)
    assert response
    assert response['solution_id']
    solution_id = response['solution_id']

solution_id1 = "aranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7"

def test_get_solution_id(monkeypatch):
    request_factory = RequestFactory()
    request = request_factory.get('/api/get/solnid/')
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=solution_id1))
    response = get_solution_id(request)
    assert response
    assert response["status"] == 'success'


def test_get_solutions():
    response = SolutionService().get_solutions()
    global solution_id
    assert response
    assert response['status'] == 'success'


def test_solution_request():
    request_factory = RequestFactory()
    request = request_factory.get('/api/soln/')
    response = solution_request(request, solution_name='')
    assert response["status"] == "success"
    request = request_factory.get('/api/soln/')
    response = solution_request(request, solution_name=TEST_SOLN_NAME)
    assert response["status"] == "success"


def test_delete_solution():
    response = SolutionService().delete_solution({"solution_id": solution_id})
    assert response["status"] == 'success'