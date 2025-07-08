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
        padrao (bool): Indica se é uma categoria padrão do sistema (não pode ser editada/apagada)
    """
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=10, choices=[('Receita', 'Receita'), ('Despesa', 'Despesa')])
    descricao = models.TextField(blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    padrao = models.BooleanField(default=False, help_text="Indica se é uma categoria padrão do sistema")

    def __str__(self):
        """
        Retorna a representação em string da categoria.
        
        Returns:
            str: Nome da categoria
        """
        return self.nome
    
    def pode_ser_editada(self):
        """
        Verifica se a categoria pode ser editada.
        Categorias padrão não podem ser editadas.
        
        Returns:
            bool: True se pode ser editada, False caso contrário
        """
        return not self.padrao
    
    def pode_ser_apagada(self):
        """
        Verifica se a categoria pode ser apagada.
        Categorias padrão não podem ser apagadas.
        
        Returns:
            bool: True se pode ser apagada, False caso contrário
        """
        return not self.padrao
    
    @classmethod
    def get_categorias_padrao(cls):
        """
        Retorna a lista de nomes das categorias padrão do sistema.
        
        Returns:
            list: Lista com os nomes das categorias padrão
        """
        return [
            'Alimentação', 'Transporte', 'Saúde', 'Lazer', 
            'Educação', 'Moradia', 'Salário', 'Outros'
        ]
