from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.http import JsonResponse

User = get_user_model()



@api_view(['POST'])
def cadastrar_usuario(request):
    nome = request.data.get('name')
    email = request.data.get('email')
    senha = request.data.get('password')

    # Verificando se todos os dados foram fornecidos
    if not nome or not email or not senha:
        return Response({'erro': 'Dados incompletos.'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificando se o e-mail já está cadastrado
    if User.objects.filter(email=email).exists():
        return Response({'erro': 'E-mail já cadastrado.'}, status=status.HTTP_400_BAD_REQUEST)

    # Criando o usuário
    username = email  # Usando o e-mail como nome de usuário
    user = User.objects.create_user(username=username, email=email, password=senha)
    user.first_name = nome
    user.save()

    return Response({'mensagem': 'Usuário criado com sucesso!'}, status=status.HTTP_201_CREATED)


def home(request):
    return JsonResponse({"mensagem": "Bem-vindo ao PoupaMais!"})
