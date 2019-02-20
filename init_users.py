import os, django
from config_vars import SERVICE_NAME
from uuid import uuid4

os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()

from services.solutions import SolutionService
from config_vars import DEFAULT_SOLN_NAME, DB_AUTH_NM_MONGO, DB_USERID_MONGO, \
    DB_PASSWORD_MONGO, DB_HOST_MONGO, DB_PORT_MONGO
from pymongo import MongoClient
from services.user_services import UserServices
from xpms_common import trace
import traceback

tracer = trace.Tracer.get_instance(SERVICE_NAME)

us_obj = UserServices()


solution_payload = {"solution_name": DEFAULT_SOLN_NAME, "solution_type": "automation",
                    "description": "This is the default solution create after environment is up."}

se_payload = {"userName": DEFAULT_SOLN_NAME + "_se", "password": "pass", "roles": [], "solutions": []}
bu_payload = {"userName": DEFAULT_SOLN_NAME + "_bu", "password": "pass", "roles": [], "solutions": []}
sv_payload = {"userName": DEFAULT_SOLN_NAME + "_sv", "password": "pass", "roles": [], "solutions": []}
sa_payload = {"userName": DEFAULT_SOLN_NAME + "_sa", "password": "pass", "roles": [], "solutions": []}
admin_payload = {"userName": 'admin', 'password': 'pass', 'roles': [], 'solutions': []}
user_roles = [{'name': 'se', 'description': 'default se role', 'users': [], 'id': ''},
                     {'name': 'sa', 'description': 'default sa role', 'users': [], 'id': ''},
                     {'name': 'bu', 'description': 'default bu role', 'users': [], 'id': ''},
                     {'name': 'sv', 'description': 'default sv role', 'users': [], 'id': ''}]


def create_soln(context):
    try:
        SolutionService().create_solution(solution_payload)
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def create_admin(context):
    try:

        admin_payload['solutions'] = [{'id': '', 'name': ''}]
        admin_resp = us_obj.create_users(admin_payload)
        if admin_resp['status_code'] == 200:
            msg = 'admin created successfully'
            context.log(message=msg, obj={})
        else:
            msg = 'admin not created'
            context.log(message=msg, obj={})
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def create_user(payload, solution, roles, user_type, context):
    try:
        payload["solutions"] = [solution]
        payload['roles'] = [roles[user_type]]
        resp = us_obj.create_users(payload)
        if resp['status_code'] == 200:
            msg = "created " + user_type + " user."
            context.log(message=msg, obj={})
        else:
            msg = "Not created " + user_type + " user."
            context.log(message=msg, obj={})
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def create_users(roles, context):
    try:
        solution = get_default_solution(context)
        if solution:
            create_user(se_payload, solution, roles, 'se', context)
            create_user(sa_payload, solution, roles, 'sa', context)
            create_user(bu_payload, solution, roles, 'bu', context)
            create_user(sv_payload, solution, roles, 'sv', context)
        else:
            msg = "default solution not available"
            context.log(message=msg, obj={})
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def get_default_solution(context):
    try:
        solution = SolutionService().get_solution(solution_name=DEFAULT_SOLN_NAME)
        if solution:
            return {"id": solution['solution_id'],
                    "name": solution['solution_name']}
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def create_db(context):
    try:
        client = MongoClient(DB_HOST_MONGO, int(DB_PORT_MONGO))
        client.admin.authenticate(DB_USERID_MONGO, DB_PASSWORD_MONGO)
        db = client[DB_AUTH_NM_MONGO]
        db.add_user(DB_USERID_MONGO, DB_PASSWORD_MONGO,
                    roles=[{'role': 'readWrite', 'db': DB_AUTH_NM_MONGO}])
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def create_default_roles(roles, context):
    try:
        for item in user_roles:
            try:
                if item['name'] not in roles.keys():
                    resp = us_obj.create_user_roles(item)
            except:
                pass
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})


def get_default_user_roles(context):
    try:
        default_roles = {}
        all_roles = us_obj.get_user_roles()
        if all_roles and 'result' in all_roles and 'data' in all_roles['result']:
            for item in all_roles['result']['data']:
                if item['name'] in ['bu', 'se', 'sa', 'sv']:
                    default_roles[item['name']] = item['id']
        return default_roles
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {}


if __name__ == '__main__':
    main_context = tracer.get_context(request_id=str(uuid4()),
                                 log_level="INFO")
    main_context.start_span(component=__name__)
    create_admin(main_context)
    create_db(main_context)
    create_soln(main_context)
    default_roles = get_default_user_roles(main_context)
    create_default_roles(default_roles, main_context)
    updated_default_roles = get_default_user_roles(main_context)
    create_users(updated_default_roles, main_context)
