from datetime import timedelta

from ...models.publicacion import Publicacion


def val_tiempo_publicacion(time, publicacion_id):

    publicacion = Publicacion.objects.get(publicacion_id=publicacion_id)

    result = publicacion.fecha_creacion + timedelta(minutes=time)
    
    return result