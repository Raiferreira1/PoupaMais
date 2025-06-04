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

    def validate_nome(self, value):
        """
        Valida o nome da categoria.
        
        Args:
            value: Nome da categoria
            
        Returns:
            str: Nome validado
            
        Raises:
            serializers.ValidationError: Se o nome estiver vazio ou for muito curto
        """
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "O nome da categoria deve ter pelo menos 3 caracteres."
            )
        return value.strip()

    def validate_tipo(self, value):
        """
        Valida o tipo da categoria.
        
        Args:
            value: Tipo da categoria
            
        Returns:
            str: Tipo validado
            
        Raises:
            serializers.ValidationError: Se o tipo não for 'Receita' ou 'Despesa'
        """
        tipos_validos = ['Receita', 'Despesa']
        if value not in tipos_validos:
            raise serializers.ValidationError(
                f"Tipo de categoria inválido. Escolha entre: {', '.join(tipos_validos)}"
            )
        return value

    def validate(self, data):
        """
        Valida os dados da categoria como um todo.
        
        Args:
            data: Dicionário com todos os dados da categoria
            
        Returns:
            dict: Dados validados
            
        Raises:
            serializers.ValidationError: Se houver dados inconsistentes
        """
        # Verifica se já existe uma categoria com o mesmo nome e tipo
        nome = data.get('nome')
        tipo = data.get('tipo')
        
        # Exclui a própria categoria em caso de atualização
        instance = getattr(self, 'instance', None)
        if instance is None:  # Criação de nova categoria
            if Categoria.objects.filter(nome__iexact=nome, tipo=tipo).exists():
                raise serializers.ValidationError(
                    f"Já existe uma categoria do tipo {tipo} com o nome '{nome}'"
                )
        else:  # Atualização de categoria existente
            if Categoria.objects.exclude(id=instance.id).filter(
                nome__iexact=nome, tipo=tipo
            ).exists():
                raise serializers.ValidationError(
                    f"Já existe uma categoria do tipo {tipo} com o nome '{nome}'"
                )
        
        return data
