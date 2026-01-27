from django.db import models
from .usuario import Usuario


class Publicacion(models.Model):
    publicacion_id = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    es_anonima = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    editada = models.BooleanField(default=False)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="publicaciones"
    )

    class Meta:
        db_table = "publicacion"
