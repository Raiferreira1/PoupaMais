from django.utils.deprecation import MiddlewareMixin
from .models import Categoria

class CategoriasPadraoMiddleware(MiddlewareMixin):
    """
    Middleware que garante que as categorias padrão existam.
    Executa a cada requisição para garantir que o sistema sempre tenha as categorias necessárias.
    """
    
    def process_request(self, request):
        """
        Verifica se as categorias padrão existem a cada requisição.
        Se não existirem, cria automaticamente.
        """
        # Só verificar se não for uma requisição de admin ou static
        if not request.path.startswith('/admin/') and not request.path.startswith('/static/'):
            self.verificar_categorias_padrao()
    
    def verificar_categorias_padrao(self):
        """
        Verifica e cria as categorias padrão se necessário.
        """
        # Categorias padrão essenciais
        categorias_essenciais = [
            'Alimentação', 'Transporte', 'Saúde', 'Lazer', 
            'Educação', 'Moradia', 'Salário', 'Outros'
        ]
        
        # Verificar se todas as categorias essenciais existem
        categorias_existentes = set(
            Categoria.objects.values_list('nome', flat=True)
        )
        
        categorias_faltando = set(categorias_essenciais) - categorias_existentes
        
        if categorias_faltando:
            print(f"⚠️ Categorias faltando: {categorias_faltando}")
            self.criar_categorias_faltantes(categorias_faltando)
    
    def criar_categorias_faltantes(self, categorias_faltando):
        """
        Cria as categorias que estão faltando.
        """
        categorias_config = {
            'Alimentação': {'tipo': 'Despesa', 'descricao': 'Gastos com alimentação, mercado, restaurantes, etc.'},
            'Transporte': {'tipo': 'Despesa', 'descricao': 'Gastos com transporte público, combustível, etc.'},
            'Saúde': {'tipo': 'Despesa', 'descricao': 'Gastos com saúde, farmácia, consultas médicas, etc.'},
            'Lazer': {'tipo': 'Despesa', 'descricao': 'Gastos com entretenimento, lazer, etc.'},
            'Educação': {'tipo': 'Despesa', 'descricao': 'Gastos com educação, cursos, material escolar, etc.'},
            'Moradia': {'tipo': 'Despesa', 'descricao': 'Gastos com moradia, aluguel, contas, etc.'},
            'Salário': {'tipo': 'Receita', 'descricao': 'Receitas de salário e rendimentos'},
            'Outros': {'tipo': 'Despesa', 'descricao': 'Categoria para transações não classificadas'}
        }
        
        for nome in categorias_faltando:
            if nome in categorias_config:
                config = categorias_config[nome]
                config['padrao'] = True  # Marcar como categoria padrão
                categoria, created = Categoria.objects.get_or_create(
                    nome=nome,
                    defaults=config
                )
                if created:
                    print(f"✅ Categoria criada automaticamente: {nome} ({config['tipo']})") 