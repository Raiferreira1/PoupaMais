from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'name', 'is_active', 'date_joined', 'password_display')

admin.site.register(User, UserAdmin)
