from opcode import hasconst
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from order.models import Order, OrderLine
from rest_framework import serializers
from django.utils.translation import gettext as _
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.db.models import Sum, F, Case, When
from shipment.models import Pickup, Shipment


@receiver(pre_save, sender=OrderLine)
def deduct_product_quantity(sender, instance, **kwargs):
    item = instance.item
    if item.stock <= 0 or instance.quantity > item.stock:
        raise serializers.ValidationError({"detail": "no_stock"})
    item.stock = item.stock - instance.quantity
    item.save()


@receiver(post_save, sender=Order)
def send_order_confirmation(sender, instance, **kwargs):
    if instance.status == "toShip":
        check_shipment = Shipment.objects.filter(order=instance).exists()
        if check_shipment:
            shipment = instance.shipment.shipment
        else:
            shipment = instance.shipment.pickup

        postcode = shipment.postcode if check_shipment else None

        print(shipment)

        order_line = OrderLine.objects.filter(order=instance)
        print(order_line)

        result = instance.order_line.aggregate(
            subtotal_price=Sum(
                Case(
                    When(
                        item__special_price__isnull=True,
                        then=(F("quantity") * F("price")),
                    ),
                    When(
                        item__special_price__isnull=False,
                        then=(F("quantity") * F("special_price")),
                    ),
                )
            )
        )

        subtotal = result.get("subtotal_price")

        context = {
            "email": instance.email,
            "contact_name": shipment.contact_name,
            "contact_num": shipment.contact_num,
            "shipment": True if check_shipment else False,
            "address": shipment.address if hasattr(shipment, "address") else None,
            "postcode": postcode.postcode if hasattr(postcode, "postcode") else None,
            "city": postcode.city if hasattr(postcode, "city") else None,
            "state": postcode.state.name if hasattr(postcode, "state") else None,
            "pickup": shipment.pickup_loc.location if not check_shipment else None,
            "order_id": instance.id,
            "total_price": instance.total_amt,
            "shipping_fee": shipment.ship_fee
            if hasattr(shipment, "ship_fee")
            else None,
            "discount": instance.discount,
            "subtotal": subtotal,
            "order_line": order_line,
        }

        # render email text
        email_html_message = render_to_string("order_confirmation.html", context)
        email_plaintext_message = render_to_string("order_confirmation.txt", context)

        print("sending email")
        msg = EmailMultiAlternatives(
            # title:
            "{title} - Order Confirmation".format(title="Sharifah Food"),
            # message:
            email_plaintext_message,
            # from:
            "fyp.shrf@gmail.com",
            # to:
            [instance.email],
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()
