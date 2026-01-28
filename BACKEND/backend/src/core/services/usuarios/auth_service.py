import jwt
from django.conf import settings
from datetime import datetime, timedelta

def generar_token(usuario):
    payload = {
        "user_id": str(usuario.usuario_id),
        "email": usuario.email,
        "es_administrador": usuario.es_administrador,
        "exp": datetime.utcnow() + timedelta(hours=8),
        "iat": datetime.utcnow(),
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256"
    )

    return token
