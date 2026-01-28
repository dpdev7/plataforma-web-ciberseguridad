# src/core/views.py

from django.shortcuts import render
from django.http import JsonResponse
from .models.usuario import Usuario
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services.usuarios.usuario_service import RegistroUsuarioSerializer
from .services.usuarios.login_service import login_usuario

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


def health_check_view(request):
    return JsonResponse({"status": "ok"})


