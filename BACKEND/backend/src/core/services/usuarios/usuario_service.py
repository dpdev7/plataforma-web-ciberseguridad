from ...models.usuario import Usuario
from ...serializers.usuarios.usuario_serializer import RegistroUsuarioSerializer
from rest_framework.exceptions import PermissionDenied, NotFound

def registrar_usuario(data):
    serializer = RegistroUsuarioSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    return serializer.save()


def eliminar_usuario(usuario_objetivo, usuario_solicitante):
    if not usuario_solicitante.es_administrador:
        if usuario_objetivo.usuario_id != usuario_solicitante.usuario_id:
            raise PermissionDenied("No tienes permiso para eliminar este usuario")

    if not usuario_objetivo.activo:
        raise NotFound("El usuario ya está inactivo")

    usuario_objetivo.activo = False
    usuario_objetivo.save()

    return usuario_objetivo

def obtener_usuarios_activos():

    usuario = Usuario.objects.filter(activo=True)
    return usuario
