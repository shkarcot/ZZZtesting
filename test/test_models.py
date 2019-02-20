import os
import json
import pytest
from services.models import process_model_data

def pytest_generate_tests(metafunc):

    file_name = os.path.basename(__file__)
    abspath = os.path.abspath(__file__)
    dir_name = os.path.dirname(abspath)
    dir_name = dir_name + "/test_cases/"
    test_path = dir_name + file_name
    test_path_parts = test_path.split(".")
    for parameter_name in ["process_model_data_test"]:
        if parameter_name in metafunc.funcargnames:
            tests_file = test_path_parts[0] + "/" + parameter_name + ".json"
            with open(tests_file) as data_file:
                data = json.load(data_file)
                metafunc.parametrize(parameter_name, data["test_cases"])

@pytest.mark.run(order=50)
def test_process_model_data(process_model_data_test):

    model_detail_data = process_model_data_test[0]["model_detail_data"]
    process_model_data_response = process_model_data(model_detail_data)
    print(process_model_data_response)
    assert process_model_data_response
