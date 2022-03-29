import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from payment.models import Payment

from payment.serializers import PaymentSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutView(APIView):
    def post(self, request):
        amount = request.data.get("total_amt", None)
        total_amount = int(amount * 100)
        payment_method = request.data.get("payment_method", None)
        order_id = request.data.get("order_id", None)

        if not (total_amount and payment_method and order_id):
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"detail": "missing required fields."},
            )

        print(request.user)

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
            customer_email=request.user.email
            if hasattr(request.user, "email")
            else None,
            # success_url="https://fyp-shrf-ecommerce.herokuapp.com/?success=true&session_id={CHECKOUT_SESSION_ID}",
            # cancel_url="https://fyp-shrf-ecommerce.herokuapp.com/?cancel=true",
            success_url="http://127.0.0.1:3000/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id={order_id}&amount={amount}",
            cancel_url="http://127.0.0.1:3000/payment/cancel?order_id={order_id}",
        )

        print(payment_method)
        print(amount)
        print(order_id)
        print(session.payment_intent)
        data = {
            "method": payment_method,
            "amount": amount,
            "order": order_id,
            "paid": False,
            "reference_num": session.payment_intent,
        }
        serializer = PaymentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        serializer.save()
        return Response(data={"url": session.url})

        # except:
        #     return Response(
        #         status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        #         data={"error": "stipe_session_failed"},
        #     )


class StripeWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
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

        if event["type"] == "payment_intent.succeeded":
            print(event)
            payment = Payment.objects.get(
                reference_num=event["data"]["object"]["charges"]["data"][0][
                    "payment_intent"
                ]
            )
            payment.paid = True
            payment.save()
            if payment.order.shipment.type=='pickup':
                payment.order.status = "toPick"
            else:
                payment.order.status = "toShip"
            payment.order.save()

        if event["type"] == "checkout.session.async_payment_failed":
            print("payment failed")

        return Response(status=200)
