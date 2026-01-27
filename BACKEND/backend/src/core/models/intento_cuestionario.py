import uuid
from django.db import models
from .cuestionario import Cuestionario
from .usuario import Usuario


class IntentoCuestionario(models.Model):
    intento_id = models.UUIDField(
        primary_key=True,      
        default=uuid.uuid4,    
        editable=False
    )
    fecha_intento = models.DateTimeField(auto_now_add=True)
    puntaje_total = models.IntegerField(null=True, blank=True)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="intentos"
    )

    cuestionario = models.ForeignKey(
        Cuestionario,
        on_delete=models.CASCADE,
        related_name="intentos"
    )

    class Meta:
        db_table = "intento_cuestionario"
