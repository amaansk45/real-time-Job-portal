from django.urls import path
from .views import NotificationListView, MarkNotificationReadView

app_name = 'notifications'

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('read/', MarkNotificationReadView.as_view(), name='mark_all_read'),
    path('<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark_one_read'),
]
