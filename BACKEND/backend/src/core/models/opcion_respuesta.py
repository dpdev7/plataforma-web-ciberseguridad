import uuid
from django.db import models
from .pregunta import Pregunta


class OpcionRespuesta(models.Model):
    opcion_id = models.UUIDField(
        primary_key=True,       
        default=uuid.uuid4,    
        editable=False
    )
    texto = models.TextField()
    es_correcta = models.BooleanField(default=False)
    retroalimentacion = models.TextField(null=True, blank=True)

    pregunta = models.ForeignKey(
        Pregunta,
        on_delete=models.CASCADE,
        related_name="opciones"
    )

    class Meta:
        db_table = "opcion_respuesta"
