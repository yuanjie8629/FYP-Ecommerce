from django.shortcuts import render

from customer.models import CustAcc
from rest_framework import generics

from customer.serializers import RegisterSerializer

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = CustAcc.objects.all()
    serializer_class = RegisterSerializer