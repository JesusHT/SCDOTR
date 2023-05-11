import json
from functools import wraps
from flask import request, redirect, url_for, session

class RoutePermission:
    def __init__(self):
        self.path = "routes/path.json"
        self.routes = self.load_routes()

    def load_routes(self):
        with open(self.path) as f:
            data = json.load(f)
        return data.get("routes")

    def get_roles(self, path):
        for route in self.routes:
            if route.get("path") == path:
                return route.get("roles", [])
        return []

    def check_permission(self, roles):
        user_role = session.get("role")
        if not user_role:
            return False
        if user_role == 'admin' and 'admin' in roles:
            return True
        if user_role == 'user' and 'user' in roles:
            return True
        return False

    def verificar_permiso(self, path, roles):
        def wrapper(func):
            @wraps(func)
            def inner(*args, **kwargs):
                if not session.get("username") or not self.check_permission(roles):
                    return redirect(url_for("index"))
                return func(*args, **kwargs)
            return inner
        return wrapper
