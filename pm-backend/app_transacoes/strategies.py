from rest_framework import serializers

class ValidadorTransacaoStrategy:
    """Interface para estratégias de validação de transação."""
    def validar(self, transacao_data):
        raise NotImplementedError

class ValidadorDespesa(ValidadorTransacaoStrategy):
    def validar(self, transacao_data):
        valor = transacao_data.get('valor')
        if valor > 0:
            raise serializers.ValidationError("Despesas devem ter valor negativo.")
        # Outras regras específicas para despesas podem ser adicionadas aqui

class ValidadorReceita(ValidadorTransacaoStrategy):
    def validar(self, transacao_data):
        valor = transacao_data.get('valor')
        if valor < 0:
            raise serializers.ValidationError("Receitas devem ter valor positivo.")
        # Outras regras específicas para receitas podem ser adicionadas aqui

def get_validador_strategy(tipo_categoria):
    if tipo_categoria == 'Despesa':
        return ValidadorDespesa()
    elif tipo_categoria == 'Receita':
        return ValidadorReceita()
    else:
        raise serializers.ValidationError("Tipo de categoria inválido para transação.") 