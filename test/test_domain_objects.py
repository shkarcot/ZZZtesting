from services import entity
from config_vars import ENTITY_CONFIG
from utilities.common import is_draft_valid
from test.vars_testing import TEST_ENTITIES


def test_is_valid_entity():
    assert is_draft_valid(entity.entity_schema, TEST_ENTITIES)


