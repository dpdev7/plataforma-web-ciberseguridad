from ..controllers.views_recursos import crear_categoria_recurso, eliminar_categoria_recurso, obtener_categorias_recurso
from django.urls import path


urlpatterns = [
path('categoria/crear/', crear_categoria_recurso),
path('categoria/eliminar/<uuid:categoria_id>/', eliminar_categoria_recurso),
path('categoria/obtener/all/', obtener_categorias_recurso)
]