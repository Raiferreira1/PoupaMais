from rest_framework import serializers
from .models import Transacao

class TransacaoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo de Transação.
    
    Este serializer converte objetos do modelo Transacao em formato JSON e vice-versa,
    permitindo a serialização e deserialização dos dados para as operações da API.
    
    Attributes:
        model: Modelo Transacao que será serializado
        fields: Lista de campos do modelo que serão incluídos na serialização
                '__all__' indica que todos os campos do modelo serão serializados
    
    Fields serializados:
        - titulo (str): Título da transação
        - valor (Decimal): Valor monetário
        - data (Date): Data da transação
        - categoria (int): ID da categoria relacionada
        - descricao (str): Descrição opcional da transação
    """
    class Meta:
        model = Transacao
        fields = '__all__'
