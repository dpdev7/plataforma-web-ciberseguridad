# src/core/views.py

from django.shortcuts import render
from django.http import JsonResponse
from .models.usuario import Usuario
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services.usuario_service import RegistroUsuarioSerializer

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


def health_check_view(request):
    return JsonResponse({"status": "ok"})


