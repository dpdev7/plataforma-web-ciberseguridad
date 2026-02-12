from ...models.cuestionario import Cuestionario

def all_cuestionarios():

    result = Cuestionario.objects.all()

    return result