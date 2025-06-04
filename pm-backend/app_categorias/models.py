# Create your models here.
from django.db import models

class Categoria(models.Model):
    """
    Modelo para representar categorias de transações financeiras.
    
    Este modelo permite classificar transações em diferentes categorias,
    diferenciando entre receitas e despesas. Cada categoria possui um nome,
    tipo (Receita/Despesa), descrição opcional e data de criação.
    
    Attributes:
        nome (str): Nome da categoria (máx. 100 caracteres)
        tipo (str): Tipo da categoria - 'Receita' ou 'Despesa'
        descricao (str): Descrição detalhada da categoria (opcional)
        data_criacao (DateTime): Data e hora de criação da categoria
    """
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=10, choices=[('Receita', 'Receita'), ('Despesa', 'Despesa')])
    descricao = models.TextField(blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Retorna a representação em string da categoria.
        
        Returns:
            str: Nome da categoria
        """
        return self.nome
