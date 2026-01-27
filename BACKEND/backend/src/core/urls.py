# src/core/urls.py
from django.urls import path
from .views import health_check_view, registro_usuario

urlpatterns = [
    path("health/", health_check_view),
    path("usuario/registro/", registro_usuario),
]
