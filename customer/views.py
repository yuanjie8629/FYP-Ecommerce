from django.dispatch import receiver
from django.template.loader import render_to_string
from customer.models import Cust, CustPosReg
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from customer.serializers import (
    ChangePassSerializer,
    CustPosRegSerializer,
    CustSerializer,
    RegisterSerializer,
)
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.hashers import check_password


class RegisterView(generics.CreateAPIView):
    queryset = Cust.objects.all()
    serializer_class = RegisterSerializer


class ChangePassView(generics.UpdateAPIView):
    queryset = Cust.objects.all()
    serializer_class = ChangePassSerializer

    def update(self, request, *args, **kwargs):
        if not check_password(
            request.data.pop("password", None), self.get_object().password
        ):
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"error": "invalid_password"}
            )
        return super().update(request, *args, **kwargs)


class CustDetails(generics.RetrieveUpdateAPIView):
    queryset = Cust.objects.all()
    serializer_class = CustSerializer

    def update(self, request, *args, **kwargs):
        if not check_password(request.data.pop("password", None), self.get_object().password):
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"error": "invalid_password"}
            )
        return super().update(request, *args, **kwargs)


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    print("sending email")
    print(reset_password_token.user.email)
    # send an e-mail to the user
    context = {
        "email": reset_password_token.user.email,
        "reset_password_url": "{}?token={}&email={}".format(
            instance.request.build_absolute_uri("/pass_reset"),
            reset_password_token.key,
            reset_password_token.user.email,
        ),
    }

    # render email text
    email_html_message = render_to_string("reset_password_email.html", context)
    email_plaintext_message = render_to_string("reset_password_email.txt", context)

    msg = EmailMultiAlternatives(
        # title:
        "{title} - Password Reset".format(title="Sharifah Food"),
        # message:
        email_plaintext_message,
        # from:
        "fyp.shrf@gmail.com",
        # to:
        [reset_password_token.user.email],
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()


class CustPosRegView(generics.CreateAPIView):
    queryset = CustPosReg.objects.all()
    serializer_class = CustPosRegSerializer
