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
        total_amount = request.data.get("total_amt", None) * 100
        payment_method = request.data.get("payment_method", None)
        if total_amount:
            try:
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
                    # success_url="https://localhost:3000/?success=true&session_id={CHECKOUT_SESSION_ID}",
                    # cancel_url="https://localhost:3000/?cancel=true",
                )
                print(session)
                return redirect(session.url)

            except:
                return Response(
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    data={"error": "stipe_session_failed"},
                )
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"error": "no_amount_stated"}
            )
