from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo de Usuário.
    
    Este serializer converte objetos do modelo User em formato JSON e vice-versa,
    permitindo a serialização e deserialização dos dados para as operações da API.
    
    Attributes:
        model: Modelo User personalizado que será serializado
        fields: Lista específica de campos do modelo que serão incluídos na serialização
    
    Fields serializados:
        - name (str): Nome completo do usuário
        - email (str): Endereço de e-mail do usuário
        - senha (str): Campo de senha (apenas para escrita)
        - username (str): Nome de usuário (gerado automaticamente do email)
    """
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'senha', 'username')
        extra_kwargs = {
            'senha': {'write_only': True},
            'username': {'read_only': True}
        } 