from django.contrib import admin
from django.urls import path
from autenticacao.views import cadastrar_usuario, home  # Importação única e correta
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/register/', cadastrar_usuario, name='cadastrar_usuario'),  # Endpoint de registro de usuário
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint para obter o token de autenticação
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para atualizar o token de autenticação
    path('', home, name='home'),  # Página inicial
]
