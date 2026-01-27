import uuid
from django.db import models


class Cuestionario(models.Model):
    cuestionario_id = models.UUIDField(
        primary_key=True,       
        default=uuid.uuid4,     
        editable=False
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    es_activo = models.BooleanField(default=True)
    tiempo_limite_minutos = models.IntegerField(default=0)

    class Meta:
        db_table = "cuestionario"
