from django.db import models
from .cuestionario import Cuestionario


class Pregunta(models.Model):
    pregunta_id = models.AutoField(primary_key=True)
    enunciado = models.TextField()
    puntos = models.IntegerField(default=1)

    cuestionario = models.ForeignKey(
        Cuestionario,
        on_delete=models.CASCADE,
        related_name="preguntas"
    )

    class Meta:
        db_table = "pregunta"
