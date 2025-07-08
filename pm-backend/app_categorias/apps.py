from django.apps import AppConfig


class AppCategoriasConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app_categorias"
    
    def ready(self):
        """
        Método executado quando o app é carregado.
        Importa os signals para garantir que sejam registrados.
        """
        import app_categorias.signals
