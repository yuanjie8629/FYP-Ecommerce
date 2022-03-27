from django.conf import settings
from django.shortcuts import render
from rest_framework.decorators import APIView
from rest_framework.response import Response

# Create your views here.
class StripeConfigView(APIView):
    """
    StripeConfigView is the API of configs resource, and
    responsible to handle the requests of /config/ endpoint.
    """
    def get(self, request, format=None):
        config = {
            "publishable_key": str(settings.STRIPE_PUBLISHABLE_KEY)
        }
        return Response(config)