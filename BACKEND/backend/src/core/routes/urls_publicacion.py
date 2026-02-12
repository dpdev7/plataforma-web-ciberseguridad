from django.urls import path

from ..controllers.views_publicacion import crear_publicacion, editar_publicacion, eliminar_publicacion, obtener_publicaciones_usuario

urlpatterns = [

    path('publicacion/crear/', crear_publicacion),
    path('publicacion/editar/<uuid:publicacion_id>/', editar_publicacion),
    path('publicacion/eliminar/<uuid:publicacion_id>/', eliminar_publicacion),
    path('publicacion/obtener/usuario/<uuid:usuario_id>/', obtener_publicaciones_usuario),




]