from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# Obtém o modelo de usuário personalizado configurado no projeto
User = get_user_model()

@api_view(['POST'])
def cadastrar_usuario(request):
    """
    View para cadastro de novos usuários no sistema.
    
    Esta view processa requisições POST para criar novos usuários no sistema.
    Realiza validações dos dados fornecidos e cria um novo usuário se todos
    os requisitos forem atendidos.
    
    Args:
        request: Objeto HttpRequest contendo os dados do usuário
                Espera receber 'name', 'email' e 'password' no corpo da requisição
    
    Returns:
        Response: Objeto de resposta com mensagem de sucesso ou erro
                 e código de status HTTP apropriado
    """
    nome = request.data.get('name')
    email = request.data.get('email')
    senha = request.data.get('password')

    # Verificando se todos os dados foram fornecidos
    if not nome or not email or not senha:
        return Response({'erro': 'Dados incompletos.'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificando se o e-mail já está cadastrado
    if User.objects.filter(email=email).exists():
        return Response({'erro': 'E-mail já cadastrado.'}, status=status.HTTP_400_BAD_REQUEST)

    # Criando o usuário com o e-mail como nome de usuário
    username = email
    user = User.objects.create_user(username=email, email=email, password=senha)
    user.first_name = nome
    user.save()

    return Response({'mensagem': 'Usuário criado com sucesso!'}, status=status.HTTP_201_CREATED)

#@login_required
def home(request):
    """
    View para a página inicial do sistema.
    
    Retorna uma mensagem de boas-vindas para o usuário.
    Atualmente não requer autenticação (login_required está comentado).
    
    Args:
        request: Objeto HttpRequest
    
    Returns:
        JsonResponse: Mensagem de boas-vindas em formato JSON
    """
    return JsonResponse({"mensagem": "Bem-vindo ao PoupaMais!"})
