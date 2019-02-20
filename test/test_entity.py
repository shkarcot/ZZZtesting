import os
from unittest.mock import MagicMock
import django
import pytest
from django.test import RequestFactory
from services.entity import config_from_endpoint, entity_get, get_count, check_entity_used_elsewhere,\
    add_key_path, process_all_domains, remove_none_fields, convert_heirarchial_to_flat,\
    validate_entity_updates, invalid_edit_msg, getFailedEntityStatus, process_deletion, \
    format_entity_data, process_uploaded_entities, get_entity_definitions, convert_flat_to_heirarchial,\
    remove_unwanted_keys, threshold_mapping_list
from config_vars import ENTITY_CONFIG
from test.vars_testing import post_test_entity, del_test_entity, input_convert_heirarchial_to_flat, \
    output_convert_heirarchial_to_flat, input_response, solution_id
from utilities import common

os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()

# to save test data #
post_data = post_test_entity()

#getting response as None need to check
# def test_get_data_from_entity():
#     response = get_data_from_entity(ENTITY_CONFIG['default'], solution_id)
#     assert response is not None
#     response = get_data_from_entity(ENTITY_CONFIG['action'], solution_id)
#     assert response is not None


def test_process_all_domains():
    response = process_all_domains([])
    assert response == {}


def test_add_key_path():
    response = add_key_path({"entity_name": "test"}, [], "")
    assert response == []


@pytest.mark.parametrize("test_var, expected",
                         [
                             ({"occurrences": None, "ts": None}, {}),
                             ({"occurrences": None, "ts": None, "test": "test"}, {"test": "test"}),
                             ({"occurrences": None, "test": "test"},  {"test": "test"})
                         ])
def test_remove_none_fields(test_var, expected):
    response = remove_none_fields(test_var)
    assert response == expected


def test_entity_get():
    response = entity_get(solution_id, ENTITY_CONFIG["default"], '')
    assert "domain_object" and "entities" in response.keys()


def test_check_entity_used_elsewhere():
    response = check_entity_used_elsewhere("test", "Signature_2", "test_9fcc6c7a-562d-488f-ad8a-a8cfe84a3830")
    assert response is False
    response = check_entity_used_elsewhere("test", "Provider", solution_id)
    assert response is True


@pytest.mark.parametrize("test_var1,test_var2, expected",
                         [
                             (ENTITY_CONFIG, "", ENTITY_CONFIG["default"]),
                             (ENTITY_CONFIG, "domainmapping", ENTITY_CONFIG["default"]),
                             (ENTITY_CONFIG, "domainobject",  ENTITY_CONFIG["default"]),
                             (ENTITY_CONFIG, "relationship",  ENTITY_CONFIG["relationship"]),
                             (ENTITY_CONFIG, "feedback",  ENTITY_CONFIG["feedback"]),
                             (ENTITY_CONFIG, "action",  ENTITY_CONFIG["action"])
                         ])
def test_false_config_from_endpoint(test_var1, test_var2, expected):
    response = config_from_endpoint(test_var1, test_var2)
    assert response == expected


@pytest.mark.parametrize("test_var1,test_var2, expected",
                         [
                             (ENTITY_CONFIG, "action", ENTITY_CONFIG["action"]),
                             (ENTITY_CONFIG, "relationship", ENTITY_CONFIG["relationship"]),
                             (ENTITY_CONFIG, "enrichments",  ENTITY_CONFIG["enrichments"]),
                             (ENTITY_CONFIG, "download",  ENTITY_CONFIG["download"])
                         ])
def test_true_config_from_endpoint(test_var1, test_var2, expected):
    response = config_from_endpoint(test_var1, test_var2,)
    assert response == expected


def test_convert_heirarchial_to_flat():
    response = convert_heirarchial_to_flat(input_convert_heirarchial_to_flat["entity_cfg"])
    assert response == output_convert_heirarchial_to_flat
    assert type(response) == list


def test_convert_flat_to_heirarchial():
    response = convert_flat_to_heirarchial(input_convert_heirarchial_to_flat["entity_cfg"])
    assert type(response) == tuple


def test_validate_entity_updates():
    response = validate_entity_updates(solution_id, output_convert_heirarchial_to_flat)
    assert response is True


def test_invalid_edit_msg():
    response = invalid_edit_msg()
    assert type(response) == dict
    assert "status" and "msg" in response.keys()


def test_getFailedEntityStatus():
    response = getFailedEntityStatus(input_response)
    assert response == (True, None)


def test_process_deletion():
    response = process_deletion(input_convert_heirarchial_to_flat, [], solution_id)
    assert response == (True, ["test"])


def test_format_entity_data():
    response = format_entity_data(output_convert_heirarchial_to_flat)
    assert response == []


def test_process_uploaded_entities():
    response = process_uploaded_entities(solution_id, input_convert_heirarchial_to_flat, ENTITY_CONFIG)
    assert type(response) == dict
    assert response["status"] == "failure"


def test_get_entity_definitions():
    response = get_entity_definitions(solution_id)
    assert type(response) == list


@pytest.mark.parametrize("test_var1,test_var2, expected",
                         [
                             ({"key_name": "test", "entity_type": "test_type", "entity_synonym": "test_synonym"},
                              "domain_object", {'entity_relation': {'cardinality': '1', 'name': 'test'},
                                                'key_name': 'test', 'synonym': 'test_synonym',
                                                'type': 'test_type'}),
                             ({"key_name": "test"}, "domainobject", {'attributes': [], 'entity_name': 'test'}),

                         ])
def test_remove_unwanted_keys(test_var1, test_var2, expected):
    response = remove_unwanted_keys(test_var1, test_var2)
    assert response == expected


@pytest.mark.parametrize("test_msg1,test_msg2, expected",
                         [
                             ({'test1': ['age', 'name']}, ["provider"], []),
                             ({'test1': ['age', 'name']}, ["test1"], ['test1.age', 'test1.name']),
                             ({'test2': ['age', 'name']}, ["test2"], ['test2.age', 'test2.name'])
                         ])
def test_threshold_mapping_list(test_msg1, test_msg2, expected):
    response = threshold_mapping_list(test_msg1, test_msg2)
    assert response == expected


def test_get_count(monkeypatch):
    request_factory = RequestFactory()
    request = request_factory.get("api/get/templatecount/")
    monkeypatch.setattr(common, 'get_solution_from_session',
                        MagicMock(return_value=solution_id))
    response = get_count(request)
    assert "success" and "data" and "msg" in response.keys()


# delete test entity data
del_test_entity()
