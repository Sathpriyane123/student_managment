from django.urls import path
from .views import  *

urlpatterns = [
    path('register/', UserSignupView.as_view(), name='user_signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('students/',StudentListCreateView.as_view(), name="student-list-create"),
    path('students/<int:pk>/',StudentDetailView.as_view(), name="student-detail"),
    path('logout/', UserLogoutView.as_view(), name='auth_logout'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    
    ]