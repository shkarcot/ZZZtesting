from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from services.solutions import SolutionService
#from api.models import SolutionUser
import json
from config_vars import SERVICE_NAME
from xpms_common import trace
import traceback
from uuid import uuid4
from xc.keycloak_service import KeycloakService

tracer = trace.Tracer.get_instance(SERVICE_NAME)

def auth_user(request):
    context = tracer.get_context(request_id=str(uuid4()), log_level="INFO")
    context.start_span(component=__name__)
    try:
        req = json.loads(request.body.decode())
        user = KeycloakService.authenticateKeycloakUser(username=req["email"], password=req["password"])
        if user:
            user.pop('last_login')
            request.session['user'] = user
            request.session['username'] = user.get('username')
            request.session['user_id'] = user.get('_id')
            return get_success("user login successful", user)
        else:
            return {"msg": "Invalid Login Details", "status": "failure"}
    # TODO raise specific exception
    except Exception as e:
        context.log(message=str(e), obj={"tb": traceback.format_exc()})
        return {"msg": "Authentication error " + str(e), "status": "failure"}
    finally:
        context.end_span()

def logout(request):
    access_token = request.META.get('HTTP_AUTHORIZATION', b'')
    KeycloakService.logout(access_token)


def get_success(msg, json_extra):

    resp = {
        "msg": msg,
        "sess_id": "FAKE_SESSION",
        "status": "success",
    }
    resp.update(json_extra)
    return resp


def auth_user_info(request):
    try:
        from xc.keycloak_service import KeycloakService
        user_info = KeycloakService.get_logged_in_user_info(request)
        user = User.objects.get_by_natural_key(username=user_info["username"])

        if user:
            solution_user = None

            json_extra = {"user": {"_id": user.pk,
                                   "email": user.email,
                                   "first_name": user.first_name,
                                   "last_name": user.last_name,
                                   "solutions": SolutionService().get_solutions()
                                   },
                          "role": user_info["role"]
                          }
            if solution_user:
                json_extra["user"]["role"] = solution_user.user_type
                request.session['username'] = user_info["username"]
                request.session['user_id'] = user.pk
            else:
                json_extra["user"]["role"] = "sa"
            return get_success("user login successful", json_extra)

        else:
            return {"msg": "Invalid session Details", "status": "failure"}
    except Exception as e:
        return {"msg": "Session error " + str(e), "status": "failure"}
