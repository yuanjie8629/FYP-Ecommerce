from django.urls import include, path
from cart.views import CartViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"cart", CartViewSet)

urlpatterns = router.urls
