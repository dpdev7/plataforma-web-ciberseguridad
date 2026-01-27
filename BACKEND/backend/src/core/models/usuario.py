import uuid
from django.db import models

class Usuario(models.Model):
    usuario_id = models.UUIDField(
        primary_key=True,       
        default=uuid.uuid4,    
        editable=False
    )
    email = models.EmailField(unique=True, max_length=255)
    password_hash = models.CharField(max_length=255)
    nombre = models.CharField(max_length=100)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    es_administrador = models.BooleanField(default=False)

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return self.email
