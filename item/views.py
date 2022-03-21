from django.db.models import Prefetch
from rest_framework import generics
from rest_framework.response import Response
from item.filters import ItemFilter, PackageFilter, ProductFilter
from item.models import Item, Package, Product
from item.serializers import (
    ItemSerializer,
    PackagePrevSerializer,
    PackageSerializer,
    ProductPrevSerializer,
    ProductSerializer,
)


class ItemActiveListView(generics.ListAPIView):
    queryset = (
        Item.objects.all()
        .prefetch_related("image")
        .filter(status="active", stock__gt=0)
        .order_by(("-last_update"))
    )
    serializer_class = ItemSerializer
    filterset_class = ItemFilter


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all().prefetch_related("image").order_by(("-last_update"))
    serializer_class = ItemSerializer
    filterset_class = ItemFilter


class ItemView(generics.RetrieveAPIView):
    queryset = Item.objects.all().filter(status="active").prefetch_related("image")
    serializer_class = ItemSerializer

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        item = Item.objects.get(pk=pk)
        if item.type == "prod":
            print("prod")
            serializer = ProductSerializer(item.product)

        else:
            print("pack")
            serializer = PackageSerializer(item.package)

        return Response(serializer.data)


class ProductPrevView(generics.ListAPIView):
    queryset = (
        Product.objects.all()
        .filter(status="active", stock__gt=0)
        .prefetch_related("image")
        .order_by(("-last_update"))
    )
    serializer_class = ProductPrevSerializer
    filterset_class = ProductFilter


class PackagePrevView(generics.ListAPIView):
    queryset = (
        Package.objects.all()
        .filter(status="active", stock__gt=0)
        .prefetch_related("image", "pack_item", Prefetch("pack_item__prod"))
        .order_by("-last_update")
    )
    serializer_class = PackagePrevSerializer
    filterset_class = PackageFilter
