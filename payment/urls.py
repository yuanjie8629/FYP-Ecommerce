from django.urls import path
from payment.views import StripeCheckoutView

urlpatterns = [path("create_checkout_session/", StripeCheckoutView.as_view())]
