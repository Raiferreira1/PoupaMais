# Create your views here.
from rest_framework import viewsets
from .models import Categoria
from .serializers import CategoriaSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar operações CRUD de categorias.
    
    Este ViewSet fornece endpoints padrão do REST framework para:
    - Listar todas as categorias (GET)
    - Criar nova categoria (POST)
    - Recuperar uma categoria específica (GET <id>)
    - Atualizar uma categoria (PUT/PATCH <id>)
    - Deletar uma categoria (DELETE <id>)
    
    Attributes:
        queryset: Conjunto de todas as categorias no banco de dados
        serializer_class: Classe responsável pela serialização/deserialização
                         dos dados das categorias
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
