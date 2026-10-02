from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_verified', 'is_staff', 'is_active')
    list_filter = ('role', 'is_verified', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile Details', {'fields': ('role', 'phone', 'is_verified', 'avatar')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Profile Details', {'fields': ('role', 'phone', 'is_verified', 'avatar')}),
    )
