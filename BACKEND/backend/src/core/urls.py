from django.urls import path
from .views import health_check_view

urlpatterns = [
    path("health/", health_check_view),
]
