import os
from bossoidc.settings import *

KEYCLOAK_URL = os.environ.get("KEYCLOAK_URL")
KEYCLOAK_PORT = os.environ.get("KEYCLOAK_PORT")
KEYCLOAK_REALM = os.environ.get("KEYCLOAK_REALM")
KEYCLOAK_CLIENT_ID = os.environ.get("KEYCLOAK_CLIENT_ID")
KEYCLOAK_APP_REDIRECT_URL = os.environ.get("KEYCLOAK_APP_REDIRECT_URL")
auth_uri = "http://{keycloak_url}:{keycloak_port}/auth/realms/{keycloak_realm}".format(keycloak_url=KEYCLOAK_URL,keycloak_port=KEYCLOAK_PORT,keycloak_realm=KEYCLOAK_REALM)
public_uri = "http://{BASE_URL}".format(BASE_URL=KEYCLOAK_APP_REDIRECT_URL)
configure_oidc(auth_uri, KEYCLOAK_CLIENT_ID, public_uri)
