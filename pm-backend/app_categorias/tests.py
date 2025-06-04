from django.test import TestCase
from .models import Categoria
from .serializers import CategoriaSerializer

# Create your tests here.

class CategoriaSerializerTest(TestCase):
    def setUp(self):
        self.categoria = Categoria.objects.create(nome='Alimentação', tipo='Despesa')

    def test_serializer_categoria_valida(self):
        data = {
            'nome': 'Transporte',
            'tipo': 'Despesa',
            'descricao': 'Gastos com transporte'
        }
        serializer = CategoriaSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_categoria_nome_curto(self):
        data = {
            'nome': 'ab',
            'tipo': 'Despesa',
            'descricao': 'Teste'
        }
        serializer = CategoriaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nome', serializer.errors)

    def test_serializer_categoria_tipo_invalido(self):
        data = {
            'nome': 'Viagem',
            'tipo': 'Outro',
            'descricao': 'Teste'
        }
        serializer = CategoriaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('tipo', serializer.errors)

    def test_serializer_categoria_duplicada(self):
        data = {
            'nome': 'Alimentação',
            'tipo': 'Despesa',
            'descricao': 'Duplicada'
        }
        serializer = CategoriaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
