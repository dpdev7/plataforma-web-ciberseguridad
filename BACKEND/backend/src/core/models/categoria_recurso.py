from django.db import models


class CategoriaRecurso(models.Model):
    categoria_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "categoria_recurso"

    def __str__(self):
        return self.nombre
