from django.contrib import admin
from django.urls import path,include
from autenticacao.views import cadastrar_usuario, home  # Importação única e correta
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app_categorias.views import CategoriaViewSet
from app_transacoes.views import TransacaoViewSet
from rest_framework import routers
from app_ia.views import CategoriaIASuggestionView, AnaliseGastosView

router = routers.DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'transacoes', TransacaoViewSet)


urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/register/', cadastrar_usuario, name='cadastrar_usuario'),  # Endpoint de registro de usuário
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint para obter o token de autenticação
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para atualizar o token de autenticação
    path('', home, name='home'),  # Página inicial
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/ia/sugerir-categoria/', CategoriaIASuggestionView.as_view()),
    path('api/ia/analise-gastos/', AnaliseGastosView.as_view()),
]
