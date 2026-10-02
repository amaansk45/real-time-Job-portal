from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    """
    List user notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class MarkNotificationReadView(APIView):
    """
    Mark all user notifications or a single notification as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        if pk:
            notification = Notification.objects.filter(user=request.user, pk=pk).first()
            if not notification:
                return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
            notification.is_read = True
            notification.save()
        else:
            Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'marked as read'}, status=status.HTTP_200_OK)
