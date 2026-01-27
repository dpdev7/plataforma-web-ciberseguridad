from django.db import models
from .pregunta import Pregunta


class OpcionRespuesta(models.Model):
    opcion_id = models.AutoField(primary_key=True)
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
