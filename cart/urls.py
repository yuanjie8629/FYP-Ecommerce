from django.urls import include, path
from cart.views import (
    CartAddItemView,
    CartRemoveItemView,
    CartRetrieveView,
    CartSetItemView,
)


urlpatterns = [
    path(r"cart/<int:cust__id>/", CartRetrieveView.as_view(), name="cart"),
    path(r"cart/<int:cust__id>/add/", CartAddItemView.as_view(), name="cart_add"),
    path(
        r"cart/<int:cust__id>/remove/", CartRemoveItemView.as_view(), name="cart_remove"
    ),
    path(r"cart/<int:cust__id>/set/", CartSetItemView.as_view(), name="cart_remove"),
]
