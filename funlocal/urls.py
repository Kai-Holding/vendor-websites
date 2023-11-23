from django.urls import path, include
from . import views
from .views import XanoDataView

 
urlpatterns = [
    path('', views.home, name="home"),
    path('users/<str:pk>', views.users, name="users"),
    #path('xano-data/', views.get_xano_data, name='xano_data'),
    path('landing-page/', XanoDataView.as_view(), name='landing-page'), 
    path("__reload__/", include("django_browser_reload.urls")),
]

