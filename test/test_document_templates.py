import pytest
from services.document_templates import get_test_template_docs, get_all_used_domainmappings, get_all_mappings,\
    format_domain_data, populate_fields, get_element_info, get_template_data, get_html_data, get_held_documents,\
    get_all_doc_variables, find_default_section, get_all_child_sections, format_elements, \
    get_domain_mapping, get_post_process_rules, format_table_mapping, get_hierarchy_temp_id, delete_template, \
    update_post_process_rules, delete_post_process_rules, post_postprocess_rules, create_new_element, \
    format_headings_mapping, list_of_dict, listoflist, get_all_rules_processed
from test.vars_testing import test_doc_temp_solution_id, test_doc_temp_template_id, post_test_doc_temp, \
    del_test_doc_temp, post_test_mapping_doc, del_test_mapping_doc, post_test_sec_doc, del_test_sec_doc

test_get_all_mappings_var_data = [{"map_to": "XLSX.Test_XLSX.SI_NO", "is_doc_var": False},
                                  {"map_to": "XLSX.Test_XLSX.Date", "is_doc_var": False},
                                  {"map_to": "XLSX.Test_XLSX.Holiday", "is_doc_var": False},
                                  {"map_to": "XLSX.Test_XLSX.Holiday_Type", "is_doc_var": False}]
# post_test_entity()

post_test_doc_temp()
post_test_mapping_doc()
post_test_sec_doc()


def test_get_held_documents():
    response = get_held_documents(test_doc_temp_solution_id)
    assert type(response) == dict
    response = get_held_documents(test_doc_temp_solution_id)
    assert response["status"] == "success"


def test_get_html_data():
    response = get_html_data("test")
    assert response == ""


def test_get_template_data():
    response = get_template_data(test_doc_temp_solution_id)
    assert type(response) == dict
    response = get_template_data(test_doc_temp_solution_id)
    assert response["status"] == "failure"


def test_get_all_doc_variables():
    response = get_all_doc_variables({"template_id": test_doc_temp_template_id,
                                      "solution_id": test_doc_temp_solution_id,
                                      "is_deleted": False})
    assert response == []


def test_get_test_template_docs():
    response = get_test_template_docs(test_doc_temp_template_id, test_doc_temp_solution_id)
    assert type(response) == dict
    assert response["status"] == "success"
    assert "status" and "msg" and "data" in response.keys()


def test_get_all_used_domainmappings():
    response = get_all_used_domainmappings(test_doc_temp_solution_id)
    assert type(response) == dict


def test_get_all_mappings():
    response = get_all_mappings({}, test_get_all_mappings_var_data)
    assert "Test_XLSX" and "XLSX" in response.keys()
    response = get_all_mappings("test", [])
    assert response == "test"


def test_format_domain_data():
    response = format_domain_data({}, "XLSX.Test_XLSX.Holiday_Type")
    assert response == {'Test_XLSX': ['Holiday_Type'], 'XLSX': ['Test_XLSX']}
    response = format_domain_data({}, "Test_XLSX")
    assert response == {}
    response = format_domain_data({}, "XLSX.Test_XLSX")
    assert response == {'XLSX': ['Test_XLSX']}


def test_populate_fields():
    response = populate_fields("test", "domain", "test")
    assert type(response) == dict
    response = populate_fields("test", "domain", "test")
    assert "name" and "confidence" and "cardinality" and "attributes" in response.keys()


def test_listoflist():
    response = listoflist([["test"]])
    assert response == (["test"], True)
    response = listoflist(["test"])
    assert response == (["test"], False)


def test_get_element_info():
    response = get_element_info("test123", [])
    assert response == {}


def test_find_default_section():
    response = find_default_section({})
    assert response == (None, [])
    response = find_default_section([{"section_id": "test", "_id": 1}])
    assert response == ({'section_id': 'test'}, [])
    response = find_default_section([{"section_id": "test", "_id": 1, "parent_section_id": "test1"}])
    assert response == (None, [{'parent_section_id': 'test1', 'section_id': 'test'}])


def test_get_all_child_sections():
    response = get_all_child_sections("test", [{"parent_section_id": "test"}])
    assert response == [{"parent_section_id": "test"}]


def test_format_elements():
    response = format_elements(None, [{"element_id": "test123"}], "a1")
    assert type(response) == list
    assert response == [{"element_id": "test123", "temp_id": "a1_test123"}]


def test_get_domain_mapping():
    response = get_domain_mapping({})
    assert response == ''


def test_get_post_process_rules():
    response = get_post_process_rules(test_doc_temp_solution_id, test_doc_temp_template_id)
    assert "data" and "msg" in response.keys()


def test_format_table_mapping():
    response = format_table_mapping([{"domain_mapping": "test"}])
    assert response == ([{"map_to": "test", "is_doc_var": False}], [{}])
    response = format_table_mapping([{"domain_mapping": "test", "document_variable": 1}])
    assert response == ([{"map_to": "test", "is_doc_var": False}], [{"document_variable": 1}])


def test_get_hierarchy_temp_id():
    response = get_hierarchy_temp_id({"section_id": "test"}, [], "")
    assert response == "test"
    response = get_hierarchy_temp_id({"section_id": "test"}, [], "test_123")
    assert response == "test_123"


def test_delete_template():
    response = delete_template({"test": "test"}, "test")
    assert "msg" and "status" in response.keys()


def test_update_post_process_rules():
    response = update_post_process_rules(test_doc_temp_solution_id, test_doc_temp_template_id, {})
    assert "msg" and "status" in response.keys()


def test_delete_post_process_rules():
    response = delete_post_process_rules(test_doc_temp_solution_id, test_doc_temp_template_id, {})
    assert "msg" and "status" in response.keys()


def test_create_new_element():
    response = create_new_element({}, test_doc_temp_solution_id)
    assert "msg" and "status" in response.keys()


def test_post_postprocess_rules():
    response = post_postprocess_rules(test_doc_temp_solution_id, {"_id": 1})
    assert "msg" and "status" in response.keys()


def test_format_headings_mapping():
    response = format_headings_mapping([{}], [{"map_to": "test", "is_doc_var": False}])
    assert response == [{"domain_mapping": "test"}]
    response = format_headings_mapping([{}], [{"map_to": "test", "is_doc_var": True}])
    assert response == [{"document_variable": "test"}]


@pytest.mark.parametrize("test_msg1, expected",
                         [
                             ([{}], True),
                             ([[]], False),
                             (["test"], False)
                         ])
def test_list_of_dict(test_msg1, expected):
    response = list_of_dict(test_msg1)
    assert response == expected


@pytest.mark.parametrize("test_msg1, expected",
                         [
                             ({"value": "test"}, ({"value": "test"}, False)),
                             ([["test"]], (["test"], True)),
                             (["test"], (["test"], False))
                         ])
def test_listoflist(test_msg1, expected):
    response = listoflist(test_msg1)
    assert response == expected


@pytest.mark.parametrize("test_msg1, expected",
                         [
                             ([], {}),
                             ([{"key_name": "test"}], {"test": {}})
                         ])
def test_get_all_rules_processed(test_msg1, expected):
    response = get_all_rules_processed(test_msg1)
    assert response == expected


del_test_doc_temp()
del_test_mapping_doc()
del_test_sec_doc()
# del_test_doc_temp_document_var()