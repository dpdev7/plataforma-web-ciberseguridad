from ...serializers.usuarios.login_serializer import LoginSerializer
from .auth_service import generar_token

def login_usuario(data):
    serializer = LoginSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    usuario = serializer.validated_data["usuario"]
    token = generar_token(usuario)

    return usuario, token
