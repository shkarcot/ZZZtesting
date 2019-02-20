#    'demo.middleware.LoginRequiredMiddleware'

from django.contrib.auth.decorators import login_required
from xc.keycloak_service import KeycloakService

class LoginRequiredMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        # No need to process URLs if user already logged in
        if request.user.is_authenticated() or request.get_full_path().startswith("/openid")\
                or "logout" in request.get_full_path()\
                or "auth" in  request.get_full_path():
            return None

        if request.session.get('user', None):
            print("user session exists")
            return None

        access_token = request.META.get('HTTP_AUTHORIZATION', b'')
        if access_token:
            user = KeycloakService.get_logged_in_user_info_from_request(access_token)
            if user:
                return None
            else :
                raise PermissionError
        return

