from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    
    def __str__(self):
        return self.name if self.name else self.username

    # Método para exibir se a senha está definida, mas sem mostrar o valor real
    def password_display(self):
        return "Senha definida" if self.senha else "Senha não definida"
