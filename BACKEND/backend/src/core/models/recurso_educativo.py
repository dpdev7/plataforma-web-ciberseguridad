import uuid
from django.db import models
from .categoria_recurso import CategoriaRecurso

class RecursoEducativo(models.Model):
    recurso_id = models.UUIDField(
        primary_key=True,      
        default=uuid.uuid4,     
        editable=False
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)
    url_recurso = models.CharField(max_length=500, null=True, blank=True)
    tipo_recurso = models.CharField(max_length=50, null=True, blank=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    es_publico = models.BooleanField(default=True)

    categoria = models.ForeignKey(
        CategoriaRecurso,
        on_delete=models.SET_NULL,
        null=True,
        related_name="recursos"
    )

    class Meta:
        db_table = "recurso_educativo"
