from django.db import models
from .publicacion import Publicacion
from .usuario import Usuario


class Comentario(models.Model):
    comentario_id = models.AutoField(primary_key=True)
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    publicacion = models.ForeignKey(
        Publicacion,
        on_delete=models.CASCADE,
        related_name="comentarios"
    )

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="comentarios"
    )

    class Meta:
        db_table = "comentario"
