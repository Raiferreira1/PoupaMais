# Create your views here.
from rest_framework import viewsets
from .models import Transacao
from .serializers import TransacaoSerializer

class TransacaoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar operações CRUD de transações financeiras.
    
    Este ViewSet fornece endpoints padrão do REST framework para:
    - Listar todas as transações (GET)
    - Criar nova transação (POST)
    - Recuperar uma transação específica (GET <id>)
    - Atualizar uma transação (PUT/PATCH <id>)
    - Deletar uma transação (DELETE <id>)
    
    Attributes:
        queryset: Conjunto de todas as transações no banco de dados
        serializer_class: Classe responsável pela serialização/deserialização
                         dos dados das transações
    """
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer
