import re
from rest_framework import serializers

def validar_password(value):
    if len(value) < 8:
        raise serializers.ValidationError(
            "La contraseña debe tener al menos 8 caracteres."
        )
    if not re.search(r"[A-Z]", value):
        raise serializers.ValidationError(
            "La contraseña debe contener al menos una letra mayúscula."
        )
    if not re.search(r"[a-z]", value):
        raise serializers.ValidationError(
            "La contraseña debe contener al menos una letra minúscula."
        )
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
        raise serializers.ValidationError(
            "La contraseña debe contener al menos un carácter especial."
        )
