from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..services.cuestionarios.cuestionarios_service import all_cuestionarios
from ..models import Cuestionario


@api_view(['POST'])
def crear_cuestionario(request):
    titulo = request.data.get('titulo')
    descripcion = request.data.get('descripcion')
    tiempo_limite_minutos = request.data.get('tiempo_limite_minutos', 0)
    es_activo = request.data.get('es_activo')

    if not titulo:
        return Response(
            {
                "success": False,
                "message": "El campo 'titulo' es obligatorio"
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        tiempo_limite_minutos = int(tiempo_limite_minutos)
        if tiempo_limite_minutos < 0:
            raise ValueError
    except ValueError:
        return Response(
            {
                "success": False,
                "message": "El tiempo_limite_minutos debe ser mayor o igual a 0"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if es_activo is None:
        es_activo = True
    else:
        if isinstance(es_activo, bool):
            pass
        elif str(es_activo).lower() == "true":
            es_activo = True
        elif str(es_activo).lower() == "false":
            es_activo = False
        else:
            return Response(
                {
                    "success": False,
                    "message": "El campo 'es_activo' debe ser true o false"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    cuestionario = Cuestionario.objects.create(
        titulo=titulo,
        descripcion=descripcion,
        tiempo_limite_minutos=tiempo_limite_minutos,
        es_activo=es_activo
    )

    return Response(
        {
            "success": True,
            "result": {
                "cuestionario_id": str(cuestionario.cuestionario_id),
                "titulo": cuestionario.titulo,
                "descripcion": cuestionario.descripcion,
                "es_activo": cuestionario.es_activo,
                "tiempo_limite_minutos": cuestionario.tiempo_limite_minutos
            }
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['GET'])
def obtener_cuestionarios(request):
    res = all_cuestionarios()

    data = [
        {
            "cuestionario_id": str(u.cuestionario_id),
            "titulo": u.titulo,
            "descripcion": u.descripcion,
            "es_activo": u.es_activo,
            "tiempo_limite_minutos": u.tiempo_limite_minutos

        }for u in res
    ]
    
    return Response(
        {"success": True, "result": data},
        status=status.HTTP_200_OK
    )

@api_view(['DELETE'])
def eliminar_cuestionario(request, cuestionario_id):
    try:
        cuestionario = Cuestionario.objects.get(
            cuestionario_id=cuestionario_id,
        )
    except Cuestionario.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Cuestionario no encontrado"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    cuestionario.delete()

    return Response(
        {
            "success": True,
            "result": "Cuestionario eliminado correctamente"
        },
        status=status.HTTP_200_OK
    )
