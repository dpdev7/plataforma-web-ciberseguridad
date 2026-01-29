# src/core/services/usuario_service.py
from rest_framework import serializers

from ...validations.validar_usuario import validar_password
from ...models.usuario import Usuario
from django.contrib.auth.hashers import make_password

class RegistroUsuarioSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, validators=[validar_password], required=True)
    nombre = serializers.CharField(max_length=100)
    es_administrador = serializers.BooleanField(
        required=False,
        default=False
    )

    def create(self, validated_data):

        print("VALIDATED DATA:", validated_data)

        email = validated_data["email"]
        password = validated_data.get("password")
        nombre = validated_data["nombre"]
        es_administrador = validated_data.get("es_administrador", False)

        if not password:
            raise serializers.ValidationError(
                {"password": "La contraseña es obligatoria"}
            )

        if Usuario.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": "Este correo ya está registrado"}
            )

        usuario = Usuario.objects.create(
            email=email,
            password_hash=make_password(password),
            nombre=nombre,
            es_administrador=es_administrador
        )

        return usuario