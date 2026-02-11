# src/core/routes/urls_usuarios.py
from django.urls import path
from ..controllers.views_usuarios import editar_nombre_usuario, eliminar_usuario, health_check_view, obtener_usuarios, registro_usuario
from ..controllers.views_usuarios import login

urlpatterns = [
    path("health/", health_check_view),
    path("usuario/registro/", registro_usuario),
    path("usuario/login/", login),
    path('usuario/delete/<uuid:usuario_id>/', eliminar_usuario),
    path('usuario/get', obtener_usuarios),
    path('usuario/update/<uuid:usuario_id>/', editar_nombre_usuario),
]
