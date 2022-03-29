from django.urls import include, path
from rest_framework.routers import DefaultRouter
from order.views import OrderDetailsView, OrderViewSet

router = DefaultRouter()
router.register(r"", OrderViewSet)

urlpatterns = [
    path(
        "search/",
        OrderDetailsView.as_view(),
        name="orderDetailsView",
    ),
]

urlpatterns += router.urls
