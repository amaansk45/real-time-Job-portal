from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView

app_name = 'reviews'

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='review_list_create'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review_detail'),
]
