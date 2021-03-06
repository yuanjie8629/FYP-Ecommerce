from django.urls import include, path
from customer.views import RegisterView
from .views import (
    BlacklistToken,
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    MyTokenVerifyView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CookieTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", MyTokenVerifyView.as_view(), name="token_verify"),
    path("logout/", BlacklistToken.as_view(), name="logout"),
    path(
        "password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("item/", include("item.urls")),
    path("", include("cart.urls")),
    path("customer/", include("customer.urls")),
    path("postcode/", include("postcode.urls")),
    path("", include("address.urls")),
    path("shipment/", include("shipment.urls")),
    path("voucher/", include("voucher.urls")),
    path("order/", include("order.urls")),
    path("payment/", include("payment.urls")),
]
