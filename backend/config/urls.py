"""
URL configuration for JobConnect backend.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # OpenAPI 3 Schema & Interactive Swagger UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Modular API Endpoints
    path('api/users/', include('users.urls', namespace='users')),
    path('api/jobs/', include('jobs.urls', namespace='jobs')),
    path('api/companies/', include('companies.urls', namespace='companies')),
    path('api/applications/', include('applications.urls', namespace='applications')),
    path('api/interviews/', include('interviews.urls', namespace='interviews')),
    path('api/notifications/', include('notifications.urls', namespace='notifications')),
    path('api/reviews/', include('reviews.urls', namespace='reviews')),
    path('api/reports/', include('reports.urls', namespace='reports')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
