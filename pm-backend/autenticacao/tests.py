from django.test import TestCase
from .models import User
from .serializers import UserSerializer

# Create your tests here.

class UserSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='teste@teste.com', email='teste@teste.com', senha='123456', name='Teste')

    def test_serializer_usuario_valido(self):
        data = {
            'name': 'Novo Usuário',
            'email': 'novo@teste.com',
            'senha': 'senha123',
            'username': 'novo@teste.com'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_usuario_email_duplicado(self):
        data = {
            'name': 'Outro Usuário',
            'email': 'teste@teste.com',
            'senha': 'senha123',
            'username': 'teste@teste.com'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_serializer_usuario_nome_vazio(self):
        data = {
            'name': '',
            'email': 'vazio@teste.com',
            'senha': 'senha123',
            'username': 'vazio@teste.com'
        }
        serializer = UserSerializer(data=data)
        # O campo name pode ser opcional, mas se quiser validar, adicione validação no serializer
        self.assertTrue(serializer.is_valid(), serializer.errors)
