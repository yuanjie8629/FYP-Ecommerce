from django.urls import path
from payment.views import StripeCheckoutView, StripeWebhookView

urlpatterns = [
    path(
        "create_checkout_session/", StripeCheckoutView.as_view(), name="stripeCheckout"
    ),
    path("stripe_webhooks/", StripeWebhookView.as_view(), name="stripeWebhook"),
]
