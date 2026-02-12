from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..services.recursos.categorias_service import all_categorias_recursos
from ..models import CategoriaRecurso


@api_view(['POST'])
def crear_categoria_recurso(request):
    nombre = request.data.get('nombre')
    descripcion = request.data.get('descripcion')

    if not nombre:
        return Response(
            {
                "success": False,
                "message": "El campo 'nombre' es obligatorio"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    categoria = CategoriaRecurso.objects.create(
        nombre=nombre,
        descripcion=descripcion
    )

    return Response(
        {
            "success": True,
            "result": {
                "categoria_id": str(categoria.categoria_id),
                "nombre": categoria.nombre,
                "descripcion": categoria.descripcion
            }
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['DELETE'])
def eliminar_categoria_recurso(request, categoria_id):
    try:
        categoria = CategoriaRecurso.objects.get(categoria_id=categoria_id)
    except CategoriaRecurso.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Categoría no encontrada"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    categoria.delete()

    return Response(
        {
            "success": True,
            "result": "Categoría eliminada correctamente"
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def obtener_categorias_recurso(request):
    res = all_categorias_recursos()
    data = [
        {
            "categoria_id": str(u.categoria_id),
            "nombre": u.nombre,
            "descripcion": u.descripcion
        }for u in res
    ]

    return Response(
        {"success": True, "result": data},
        status=status.HTTP_200_OK
    )

