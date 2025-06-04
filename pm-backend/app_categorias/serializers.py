from rest_framework import serializers
from .models import Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo de Categoria.
    
    Este serializer converte objetos do modelo Categoria em formato JSON e vice-versa,
    permitindo a serialização e deserialização dos dados para as operações da API.
    
    Attributes:
        model: Modelo Categoria que será serializado
        fields: Lista de campos do modelo que serão incluídos na serialização
                '__all__' indica que todos os campos do modelo serão serializados
    
    Fields serializados:
        - nome (str): Nome da categoria
        - tipo (str): Tipo da categoria ('Receita' ou 'Despesa')
        - descricao (str): Descrição opcional da categoria
        - data_criacao (DateTime): Data e hora de criação da categoria
    """
    class Meta:
        model = Categoria
        fields = '__all__'
