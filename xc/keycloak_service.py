import json
import os
from bossoidc.settings import *
from bossoidc.backend import get_access_token, get_roles, get_token_audience, token_audience_is_valid, get_user_model, check_username
import requests
from jwkest.jwt import JWT
from bossoidc.models import Keycloak as KeycloakModel
import datetime


class KeycloakService:

    @staticmethod
    def configure_keyloack():
        KEYCLOAK_URL = os.environ.get("KEYCLOAK_URL")
        KEYCLOAK_PORT = os.environ.get("KEYCLOAK_PORT")
        KEYCLOAK_REALM = os.environ.get("KEYCLOAK_REALM")
        KEYCLOAK_CLIENT_ID = os.environ.get("KEYCLOAK_CLIENT_ID")
        KEYCLOAK_APP_REDIRECT_URL = os.environ.get("KEYCLOAK_APP_REDIRECT_URL")
        auth_uri = "http://{keycloak_url}:{keycloak_port}/auth/realms/{keycloak_realm}".format(
            keycloak_url=KEYCLOAK_URL, keycloak_port=KEYCLOAK_PORT, keycloak_realm=KEYCLOAK_REALM)
        public_uri = "http://{BASE_URL}".format(BASE_URL=KEYCLOAK_APP_REDIRECT_URL)
        from bossoidc.settings import configure_oidc
        configure_oidc(auth_uri, KEYCLOAK_CLIENT_ID, public_uri)

    @staticmethod
    def get_logged_in_user_role(request):
        access_token = get_access_token(request)
        roles = get_roles(access_token)
        return KeycloakService.get_role(roles)

    @staticmethod
    def get_logged_in_user_info(request):
        data = dict()
        data['logged_in'] = False
        access_token = get_access_token(request)
        if access_token:
            data['logged_in'] = True
        roles = get_roles(access_token)
        data['role'] = KeycloakService.get_role(roles)
        data['username'] = request.user.username
        return data

    @staticmethod
    def get_role(roles):
        user_role = ""
        if 'se' in roles:
            user_role = "se"
        if 'bu' in roles:
            user_role = "bu"
        if 'sv' in roles:
            user_role = "sv"
        if 'sa' in roles:
            user_role = "sa"
        return user_role

    @staticmethod
    def authenticateKeycloakUser(username,password):
        keycloak_url = os.environ.get("KEYCLOAK_URL")
        keycloak_client_id = os.environ.get("KEYCLOAK_CLIENT_ID")
        keycloak_realm = os.environ.get("KEYCLOAK_REALM")
        keycloak_port = os.environ.get("KEYCLOAK_PORT")
        login_url = "http://{keycloak_url}:{keycloak_port}/auth/realms/{keycloak_realm}/protocol/openid-connect/token".format(keycloak_url=keycloak_url,keycloak_port=keycloak_port,keycloak_realm=keycloak_realm)
        print(login_url)
        data = {"username": username, "password": password, "grant_type": "password", "client_id": keycloak_client_id}
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(login_url, data=data, headers=headers)
        if response:
            tokens = response.json()
            if "access_token" in tokens:
                userResponse = KeycloakService.get_logged_in_user_info_from_request(tokens["access_token"])
                return userResponse
        return None

    @staticmethod
    def logout(access_token,refresh_token=None):
        keycloak_url = os.environ.get("KEYCLOAK_URL")
        keycloak_client_id = os.environ.get("KEYCLOAK_CLIENT_ID")
        keycloak_realm = os.environ.get("KEYCLOAK_REALM")
        keycloak_port = os.environ.get("KEYCLOAK_PORT")
        login_url = "http://{keycloak_url}:{keycloak_port}/auth/realms/{keycloak_realm}/protocol/openid-connect/logout".format(
            keycloak_url=keycloak_url, keycloak_port=keycloak_port, keycloak_realm=keycloak_realm)
        print(login_url)
        data = {"refresh_token": refresh_token , "client_id": keycloak_client_id}
        auth_header = "Bearer {access_token}".format(access_token=access_token)
        headers = {"Content-Type": "application/x-www-form-urlencoded","Authorization":auth_header}
        response = requests.post(login_url, data=data, headers=headers)
        return response.json()

    @staticmethod
    def get_logged_in_user_info_from_request(access_token):
        user = dict()
        if access_token:
            decode_token = JWT().unpack(access_token).payload()
            user = get_user_by_token(decode_token)
            user['logged_in'] = True
            user['accesstoken'] = access_token
            user['sess_id'] = access_token
        else:
            user['logged_in'] = False
        return user



def get_user_by_token(id_token):
    audience = get_token_audience(id_token)
    if not token_audience_is_valid(audience):
        return None

    UserModel = get_user_model()
    uid = id_token['sub']
    username = id_token['preferred_username']

    check_username(username)

    # Some OP may actually choose to withhold some information, so we must test if it is present
    user = {'_id':uid,'last_login': datetime.datetime.now()}
    if 'first_name' in id_token.keys():
        user['first_name'] = id_token['first_name']
    if 'given_name' in id_token.keys():
        user['first_name'] = id_token['given_name']
    if 'christian_name' in id_token.keys():
        user['first_name'] = id_token['christian_name']
    if 'family_name' in id_token.keys():
        user['last_name'] = id_token['family_name']
    if 'last_name' in id_token.keys():
        user['last_name'] = id_token['last_name']
    if 'email' in id_token.keys():
        user['email'] = id_token['email']
    if 'preferred_username' in id_token.keys():
        user['username'] = id_token['preferred_username']
    if 'solutions' in id_token.keys():
        solutions = []
        sol_strings = id_token['solutions']
        for sol_string in sol_strings:
            solutions.append(json.loads(sol_string))
        user['solutions'] = solutions

    roles = get_roles(id_token)
    user['role']=KeycloakService.get_role(roles)
    print(user)
    return user
