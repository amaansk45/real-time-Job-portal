from django.contrib import admin
from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'location', 'company_size', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'industry', 'created_at')
    search_fields = ('name', 'description', 'location')
