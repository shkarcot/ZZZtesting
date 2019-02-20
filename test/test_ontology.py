from services.ontology import Ontology

solution_id = None
payload = {}


def test_get_all_ontologies():
    obj = Ontology()
    response = obj.get_all_ontologies(solution_id)
    assert "error"and "status_code" and "msg" in response.keys()


def test_create_ontology():
    obj = Ontology()
    response = obj.create_ontology(solution_id, payload)
    assert "error"and "status_code" and "msg" in response.keys()


def test_enable_ontology():
    obj = Ontology()
    response = obj.enable_ontology(solution_id, payload)
    assert "error"and "status_code" and "msg" in response.keys()

def test_get_ontology_versions():
    obj =Ontology()
    payload={
        "is_active":True,
        "version":"v1",
        "id":"062f5fe1-ba7b-4812-bb1c-742c39267957"
    }
    response = obj.enable_ontology("test_solution", payload)
    assert "status_code" and "msg" in response.keys()
