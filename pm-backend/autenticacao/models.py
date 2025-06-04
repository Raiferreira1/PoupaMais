from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Modelo personalizado de usuário que estende o AbstractUser do Django.
    
    Este modelo adiciona campos adicionais ao modelo de usuário padrão do Django,
    incluindo nome completo e senha como campos separados.
    
    Attributes:
        name (str): Nome completo do usuário
        email (str): Endereço de e-mail do usuário (único)
        senha (str): Senha do usuário armazenada de forma segura
    """
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    
    def __str__(self):
        """
        Retorna a representação em string do usuário.
        
        Returns:
            str: Nome do usuário se definido, caso contrário retorna o username
        """
        return self.name if self.name else self.username

    # Método para exibir se a senha está definida, mas sem mostrar o valor real
    def password_display(self):
        """
        Método para verificar se a senha do usuário está definida.
        
        Returns:
            str: Mensagem indicando se a senha está definida ou não
        """
        return "Senha definida" if self.senha else "Senha não definida"
