from django.db import models
from .intento_cuestionario import IntentoCuestionario
from .opcion_respuesta import OpcionRespuesta
from .pregunta import Pregunta


class RespuestaUsuario(models.Model):
    respuesta_id = models.AutoField(primary_key=True)

    intento = models.ForeignKey(
        IntentoCuestionario,
        on_delete=models.CASCADE,
        related_name="respuestas"
    )

    pregunta = models.ForeignKey(
        Pregunta,
        on_delete=models.CASCADE
    )

    opcion_seleccionada = models.ForeignKey(
        OpcionRespuesta,
        on_delete=models.CASCADE
    )

    class Meta:
        db_table = "respuesta_usuario"
