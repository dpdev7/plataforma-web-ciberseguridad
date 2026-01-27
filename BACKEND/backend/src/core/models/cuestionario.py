from django.db import models


class Cuestionario(models.Model):
    cuestionario_id = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    es_activo = models.BooleanField(default=True)
    tiempo_limite_minutos = models.IntegerField(default=0)

    class Meta:
        db_table = "cuestionario"
