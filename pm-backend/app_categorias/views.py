# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
    
    Proteções implementadas:
    - Categorias padrão não podem ser editadas
    - Categorias padrão não podem ser apagadas
    
    Attributes:
        queryset: Conjunto de todas as categorias no banco de dados
        serializer_class: Classe responsável pela serialização/deserialização
                         dos dados das categorias
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    
    def update(self, request, *args, **kwargs):
        """
        Sobrescreve o método update para proteger categorias padrão.
        """
        instance = self.get_object()
        
        # Verificar se é uma categoria padrão
        if instance.padrao:
            return Response({
                'error': f'Não é possível editar a categoria "{instance.nome}" pois é uma categoria padrão do sistema.',
                'detail': 'Categorias padrão são protegidas e não podem ser modificadas.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        """
        Sobrescreve o método partial_update para proteger categorias padrão.
        """
        instance = self.get_object()
        
        # Verificar se é uma categoria padrão
        if instance.padrao:
            return Response({
                'error': f'Não é possível editar a categoria "{instance.nome}" pois é uma categoria padrão do sistema.',
                'detail': 'Categorias padrão são protegidas e não podem ser modificadas.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Sobrescreve o método destroy para proteger categorias padrão.
        """
        instance = self.get_object()
        
        # Verificar se é uma categoria padrão
        if instance.padrao:
            return Response({
                'error': f'Não é possível apagar a categoria "{instance.nome}" pois é uma categoria padrão do sistema.',
                'detail': 'Categorias padrão são protegidas e não podem ser removidas.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def padrao(self, request):
        """
        Endpoint para listar apenas as categorias padrão do sistema.
        """
        categorias_padrao = Categoria.objects.filter(padrao=True)
        serializer = self.get_serializer(categorias_padrao, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def customizadas(self, request):
        """
        Endpoint para listar apenas as categorias customizadas (não padrão).
        """
        categorias_customizadas = Categoria.objects.filter(padrao=False)
        serializer = self.get_serializer(categorias_customizadas, many=True)
        return Response(serializer.data)
