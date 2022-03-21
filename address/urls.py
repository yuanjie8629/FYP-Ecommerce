from django.urls import include, path
from rest_framework.routers import DefaultRouter

from address.views import AddressViewset

router = DefaultRouter()
router.register(r"address", AddressViewset)

urlpatterns = []

urlpatterns += router.urls
