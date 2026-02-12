# src/core/controllers/views_usuarios.py

from django.shortcuts import render
from django.http import JsonResponse

from ..models.usuario import Usuario
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..services.usuarios.usuario_service import RegistroUsuarioSerializer, obtener_usuarios_activos
from ..services.usuarios.login_service import login_usuario

@api_view(["POST"])
def registro_usuario(request):
    serializer = RegistroUsuarioSerializer(data=request.data)
    if serializer.is_valid():
        usuario = serializer.save()
        return Response(
            {
                "message": "Usuario registrado correctamente",
                "usuario_id": str(usuario.usuario_id),  # convertir a string
                "email": usuario.email,
                "nombre": usuario.nombre
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login(request):
    usuario, token = login_usuario(request.data)

    return Response(
        {
            "token": token,
            "usuario": {
                "id": str(usuario.usuario_id),
                "email": usuario.email,
                "nombre": usuario.nombre,
                "es_administrador": usuario.es_administrador,
            }
        },
        status=status.HTTP_200_OK
    )

@api_view(['PATCH'])
def eliminar_usuario(request, usuario_id):
    try:
        usuario = Usuario.objects.get(usuario_id=usuario_id)
    except Usuario.DoesNotExist:
        return Response(
            {"success": "false", "message": "Usuario no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    usuario.activo = False
    usuario.save()

    return Response(
        {"success": "true","mensaje": "Usuario eliminado correctamente (inactivo)"},
        status=status.HTTP_200_OK
    )
@api_view(['GET'])
def obtener_usuarios(request):
    usuarios = obtener_usuarios_activos()

    data = [
        {
            "id": str(u.usuario_id),
            "email": u.email,
            "nombre": u.nombre,
            "es_administrador": u.es_administrador,
            "activo": u.activo
        }
        for u in usuarios
    ]

    return Response(
        {"success": True, "result": data},
        status=status.HTTP_200_OK
    )

@api_view(['PATCH'])
def editar_nombre_usuario(request, usuario_id):
    nombre = request.data.get('nombre')

    if not nombre:
        return Response(
            {
                "success": False,
                "message": "El campo 'nombre' es obligatorio"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        usuario = Usuario.objects.get(
            usuario_id=usuario_id,
            activo=True
        )
    except Usuario.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Usuario no encontrado o inactivo"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    usuario.nombre = nombre
    usuario.save()

    return Response(
        {
            "success": True,
            "result": {
                "usuario_id": str(usuario.usuario_id),
                "nombre": usuario.nombre
            }
        },
        status=status.HTTP_200_OK
    )



def health_check_view(request):
    return JsonResponse({"status": "ok"})


