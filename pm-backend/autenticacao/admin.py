from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'is_active', 'date_joined')  # Campos que você quer exibir

admin.site.register(User, UserAdmin)
