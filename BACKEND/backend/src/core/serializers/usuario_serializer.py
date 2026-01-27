# src/core/services/usuario_service.py
from rest_framework import serializers
from ..models.usuario import Usuario
from django.contrib.auth.hashers import make_password

class RegistroUsuarioSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    nombre = serializers.CharField(max_length=100)

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        nombre = validated_data["nombre"]

        if Usuario.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": "Este correo ya está registrado"}
            )

        usuario = Usuario.objects.create(
            email=email,
            password_hash=make_password(password),
            nombre=nombre,
            es_administrador=False
        )

        return usuario
