from rest_framework import serializers
from .models import Transacao
from app_categorias.models import Categoria
from datetime import date
from .strategies import get_validador_strategy

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'tipo']

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
        - categoria (dict): Dados da categoria relacionada
        - descricao (str): Descrição opcional da transação
    """
    categoria = CategoriaSerializer(read_only=True)  # Para leitura (GET)
    categoria_id = serializers.IntegerField(write_only=True)  # Para escrita (POST/PUT)
    
    class Meta:
        model = Transacao
        fields = '__all__'

    def validate_valor(self, value):
        """
        Valida o valor da transação.
        
        Args:
            value: Valor monetário da transação
            
        Returns:
            Decimal: Valor validado
            
        Raises:
            serializers.ValidationError: Se o valor for zero
        """
        if value == 0:
            raise serializers.ValidationError("O valor da transação não pode ser zero.")
        return value

    def validate_data(self, value):
        """
        Valida a data da transação.
        
        Args:
            value: Data da transação
            
        Returns:
            Date: Data validada
            
        Raises:
            serializers.ValidationError: Se a data for futura
        """
        if value > date.today():
            raise serializers.ValidationError("A data da transação não pode ser futura.")
        return value

    def validate(self, data):
        """
        Valida os dados da transação como um todo.
        
        Args:
            data: Dicionário com todos os dados da transação
            
        Returns:
            dict: Dados validados
            
        Raises:
            serializers.ValidationError: Se houver inconsistência entre categoria e valor
        """
        print("Dados recebidos no serializer:", data)
        categoria_id = data.get('categoria_id')
        print("Categoria ID extraída:", categoria_id)
        print("Tipo da categoria ID:", type(categoria_id))
        
        if not categoria_id:
            print("ERRO: Categoria ID não encontrada nos dados")
            raise serializers.ValidationError("A categoria é obrigatória.")
        
        # Buscar a categoria pelo ID
        try:
            categoria = Categoria.objects.get(id=categoria_id)
            data['categoria'] = categoria
        except Categoria.DoesNotExist:
            raise serializers.ValidationError("Categoria não encontrada.")
        
        if categoria:
            # Usa a estratégia de validação conforme o tipo da categoria
            validador = get_validador_strategy(categoria.tipo)
            validador.validar(data)  # Lança erro se valor estiver errado
        return data
