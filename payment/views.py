import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutView(APIView):
    def post(self, request):
        total_amount = int(request.data.get("total_amt", None) * 100)
        payment_method = request.data.get("payment_method", None)
        print(request.user)
        if total_amount:
            # try:
            session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "price_data": {
                            "currency": "myr",
                            "product_data": {
                                "name": "SHRF-Ecommerce",
                            },
                            "unit_amount": total_amount,
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                payment_method_types=[payment_method],
                customer_email= request.user.email if hasattr(request.user,'email') else None,
                success_url="https://fyp-shrf-ecommerce.herokuapp.com/?success=true&session_id={CHECKOUT_SESSION_ID}",
                cancel_url="https://fyp-shrf-ecommerce.herokuapp.com/?cancel=true",
            )
            print(session)
            return Response(data={"url": session.url})

        # except:
        #     return Response(
        #         status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        #         data={"error": "stipe_session_failed"},
        #     )
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"error": "no_amount_stated"}
            )


class StripeWebhookView(APIView):
    """
    StripeWebhookView is responsible to handle the webhook
    events of /webhook/ endpoint.
    """

    def post(self, request, format=None):
        endpoint_secret = settings.STRIPE_SECRET_KEY
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]

        try:
            event = stripe.Webhook.construct_event(
                request.body, sig_header, endpoint_secret
            )
        except ValueError as e:
            print(e)
            return Response(status=400)
        except stripe.error.SignatureVerificationError as e:
            print(e)
            return Response(status=400)

        if event["type"] == "checkout.session.completed":
            print(event["data"]["object"]["payment_intent"])

        return Response(status=200)
