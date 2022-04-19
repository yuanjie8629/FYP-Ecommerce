from django.contrib import admin
from cart.models import Cart
from reversion.admin import VersionAdmin
from core.admin import SoftDeleteAdmin


@admin.register(Cart)
class CartAdmin(SoftDeleteAdmin, VersionAdmin):
    pass
