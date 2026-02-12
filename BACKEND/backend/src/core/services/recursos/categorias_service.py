from ...models.categoria_recurso import CategoriaRecurso

def all_categorias_recursos():
    
    result = CategoriaRecurso.objects.all()
    return result
