from django.test import TestCase
from app_categorias.models import Categoria
from .models import Transacao
from .serializers import TransacaoSerializer
from .strategies import ValidadorDespesa, ValidadorReceita, get_validador_strategy
from rest_framework.exceptions import ValidationError
from datetime import date

# Create your tests here.

class StrategyValidationTest(TestCase):
    def setUp(self):
        self.categoria_despesa = Categoria.objects.create(nome='Alimentação', tipo='Despesa')
        self.categoria_receita = Categoria.objects.create(nome='Salário', tipo='Receita')

    def test_validador_despesa_valor_negativo(self):
        validador = ValidadorDespesa()
        validador.validar({'valor': -100})  # Não deve lançar exceção

    def test_validador_despesa_valor_positivo(self):
        validador = ValidadorDespesa()
        with self.assertRaises(ValidationError):
            validador.validar({'valor': 100})

    def test_validador_receita_valor_positivo(self):
        validador = ValidadorReceita()
        validador.validar({'valor': 100})  # Não deve lançar exceção

    def test_validador_receita_valor_negativo(self):
        validador = ValidadorReceita()
        with self.assertRaises(ValidationError):
            validador.validar({'valor': -100})

    def test_get_validador_strategy(self):
        self.assertIsInstance(get_validador_strategy('Despesa'), ValidadorDespesa)
        self.assertIsInstance(get_validador_strategy('Receita'), ValidadorReceita)
        with self.assertRaises(ValidationError):
            get_validador_strategy('Outro')

class TransacaoSerializerTest(TestCase):
    def setUp(self):
        self.categoria_despesa = Categoria.objects.create(nome='Alimentação', tipo='Despesa')
        self.categoria_receita = Categoria.objects.create(nome='Salário', tipo='Receita')

    def test_serializer_despesa_valida(self):
        data = {
            'titulo': 'Compra',
            'valor': -50,
            'data': date.today(),
            'categoria': self.categoria_despesa.id,
            'descricao': 'Mercado'
        }
        serializer = TransacaoSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_despesa_invalida(self):
        data = {
            'titulo': 'Compra',
            'valor': 50,
            'data': date.today(),
            'categoria': self.categoria_despesa.id,
            'descricao': 'Mercado'
        }
        serializer = TransacaoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_serializer_receita_valida(self):
        data = {
            'titulo': 'Salário',
            'valor': 1000,
            'data': date.today(),
            'categoria': self.categoria_receita.id,
            'descricao': 'Pagamento mensal'
        }
        serializer = TransacaoSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_receita_invalida(self):
        data = {
            'titulo': 'Salário',
            'valor': -1000,
            'data': date.today(),
            'categoria': self.categoria_receita.id,
            'descricao': 'Pagamento mensal'
        }
        serializer = TransacaoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
