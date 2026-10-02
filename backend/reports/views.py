from rest_framework import generics, permissions
from .models import JobReport
from .serializers import JobReportSerializer

class JobReportListCreateView(generics.ListCreateAPIView):
    """
    List reports (Admin) or file a new suspicious job report (Authenticated User).
    """
    serializer_class = JobReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return JobReport.objects.all()
        return JobReport.objects.filter(reporter=user)

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

class JobReportDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or moderate a report status (Admin).
    """
    serializer_class = JobReportSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = JobReport.objects.all()
