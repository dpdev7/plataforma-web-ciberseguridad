from django.urls import path

from ..controllers.views_cuestionarios import crear_cuestionario, eliminar_cuestionario, obtener_cuestionarios

urlpatterns = [
    path('cuestionario/crear/', crear_cuestionario),
    path('cuestionario/obtener/all/', obtener_cuestionarios),
    path('cuestionario/eliminar/<uuid:cuestionario_id>/', eliminar_cuestionario)

]