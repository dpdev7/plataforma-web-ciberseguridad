from datetime import timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Publicacion, Usuario
from ..services.publicaciones.publicacion_service import val_tiempo_publicacion


@api_view(['POST'])
def crear_publicacion(request):
    titulo = request.data.get("titulo")
    contenido = request.data.get("contenido")
    usuario_id = request.data.get("usuario_id")
    es_anonima = request.data.get("es_anonima", False)

    if not titulo or not contenido or not usuario_id:
        return Response(
            {
                "success": False,
                "message": "titulo, contenido y usuario_id son obligatorios"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        usuario = Usuario.objects.get(usuario_id=usuario_id, activo=True)
    except Usuario.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Usuario no encontrado o inactivo"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    publicacion = Publicacion.objects.create(
        titulo=titulo,
        contenido=contenido,
        es_anonima=es_anonima,
        usuario=usuario
    )

    return Response(
        {
            "success": True,
            "result": {
                "publicacion_id": publicacion.publicacion_id,
                "titulo": publicacion.titulo,
                "contenido": publicacion.contenido,
                "es_anonima": publicacion.es_anonima,
                "fecha_creacion": publicacion.fecha_creacion,
                "editada": publicacion.editada,
                "usuario_id": usuario.usuario_id
            }
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['PATCH'])
def editar_publicacion(request, publicacion_id):
    try:
        publicacion = Publicacion.objects.get(publicacion_id=publicacion_id)
    except Publicacion.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Publicación no encontrada"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Validar tiempo (30 minutos)
    tiempo_limite = val_tiempo_publicacion(30, publicacion_id)

    if timezone.now() > tiempo_limite:
        return Response(
            {
                "success": False,
                "message": "No se puede editar la publicación después de 30 minutos"
            },
            status=status.HTTP_403_FORBIDDEN
        )

    titulo = request.data.get("titulo")
    contenido = request.data.get("contenido")

    if not titulo and not contenido:
        return Response(
            {
                "success": False,
                "message": "Debe enviar al menos titulo o contenido para editar"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if titulo:
        publicacion.titulo = titulo

    if contenido:
        publicacion.contenido = contenido

    publicacion.editada = True
    publicacion.save()

    return Response(
        {
            "success": True,
            "result": {
                "publicacion_id": publicacion.publicacion_id,
                "titulo": publicacion.titulo,
                "contenido": publicacion.contenido,
                "editada": publicacion.editada
            }
        },
        status=status.HTTP_200_OK
    )

@api_view(['DELETE'])
def eliminar_publicacion(request, publicacion_id):
    try:
        publicacion = Publicacion.objects.get(publicacion_id=publicacion_id)
    except Publicacion.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Publicación no encontrada"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    publicacion.delete()

    return Response(
        {
            "success": True,
            "result": "Publicación eliminada correctamente"
        },
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def obtener_publicaciones_usuario(request, usuario_id):
    try:
        usuario = Usuario.objects.get(usuario_id=usuario_id, activo=True)
    except Usuario.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Usuario no encontrado o inactivo"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    publicaciones = Publicacion.objects.filter(usuario=usuario).order_by("-fecha_creacion")

    resultado = []

    for pub in publicaciones:
        resultado.append({
            "publicacion_id": pub.publicacion_id,
            "titulo": pub.titulo,
            "contenido": pub.contenido,
            "es_anonima": pub.es_anonima,
            "fecha_creacion": pub.fecha_creacion,
            "editada": pub.editada,
            "usuario": None if pub.es_anonima else {
                "usuario_id": usuario.usuario_id,
            }
        })

    return Response(
        {
            "success": True,
            "result": resultado
        },
        status=status.HTTP_200_OK
    )