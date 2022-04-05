from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from notification.models import Notification
from order.models import Order, OrderLine
from django.utils.translation import gettext as _
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.db.models import Sum, F, Case, When
from shipment.models import Shipment
from reversion.models import Version


# @receiver(pre_save, sender=OrderLine)
# def deduct_product_quantity(sender, instance, **kwargs):
#     item = instance.item
#     if item.stock <= 0 or instance.quantity > item.stock:
#         raise serializers.ValidationError({"detail": "no_stock"})
#     item.stock = item.stock - instance.quantity
#     item.save()


@receiver(post_save, sender=Order)
def send_order_confirmation(sender, instance, **kwargs):
    update_fields = kwargs["update_fields"]
    if (
        update_fields is not None
        and "status" in update_fields
        and (instance.status == "toShip" or instance.status == "toPick")
    ):
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

        total_discount = 0

        if instance.voucher:
            voucher_version = (
                Version.objects.get_for_object(instance.voucher)
                .filter(revision__date_created__lte=instance.created_at)
                .order_by("-revision__date_created")
                .first()
            )

            code = instance.voucher.code

            if voucher_version:
                code = voucher_version.field_dict["code"]
                if voucher_version.field_dict["type"] == "percentage":
                    total_discount = subtotal * voucher_version.field_dict["discount"]
                else:
                    total_discount = voucher_version.field_dict["discount"]

            else:
                if instance.voucher.type == "percentage":
                    total_discount = subtotal * instance.voucher.discount
                else:
                    total_discount = instance.voucher.discount

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
            "discount": "{:.2f}".format(float(total_discount))
            if instance.voucher
            else None,
            "subtotal": subtotal,
            "order_line": order_line,
            "voucher": code if instance.voucher else None,
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

        title = "New Order"
        description = "<p><span>{} has placed new order!</span></p><p><span>Please proceed with his order.</span></p>".format(instance.email)
        type = 'order'
        Notification.objects.create(title=title, description=description, type=type)
