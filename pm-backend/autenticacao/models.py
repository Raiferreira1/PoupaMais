from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    name= models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    
    # Caso queira personalizar o comportamento do campo senha, como requisitos adicionais
    senha = models.CharField(max_length=128)
    
    def __str__(self):
        return self.nome
