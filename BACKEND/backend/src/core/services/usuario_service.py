from ..serializers.usuario_serializer import RegistroUsuarioSerializer

def registrar_usuario(data):
    serializer = RegistroUsuarioSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    return serializer.save()
