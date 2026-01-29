from rest_framework import serializers
from django.contrib.auth.hashers import check_password
from ...models.usuario import Usuario

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data["email"]
        password = data["password"]

        try:
            usuario = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Credenciales inválidas")
        
        if not usuario.activo:
            raise serializers.ValidationError("Credenciales inválidas")


        if not check_password(password, usuario.password_hash):
            raise serializers.ValidationError("Credenciales inválidas")

        data["usuario"] = usuario
        return data
