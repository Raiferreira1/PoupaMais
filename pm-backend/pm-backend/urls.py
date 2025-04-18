from django.contrib import admin
from django.urls import path
from autenticacao.views import cadastrar_usuario, home  # Importação única e correta

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/register/', cadastrar_usuario, name='cadastrar_usuario'),  # Corrigindo a importação
    path('', home),  # Página inicial
]
