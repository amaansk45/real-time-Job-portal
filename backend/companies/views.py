from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company
from .serializers import CompanySerializer

class CompanyListCreateView(generics.ListCreateAPIView):
    """
    List verified companies or register a new company profile.
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['industry', 'location', 'company_size', 'is_verified']
    search_fields = ['name', 'description', 'industry', 'location']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a company profile.
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
