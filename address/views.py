from rest_framework import viewsets

from address.serializers import AddressSerializer, AddressWriteSerializer
from .models import Address


class AddressViewset(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    pagination_class = None

    def create(self, request, *args, **kwargs):
        request.data.update({"cust": request.user.id})
        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        request.data.update({"cust": request.user.id})
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.default == True:
            address = (
                Address.objects.filter(cust=self.request.user.id)
                .exclude(id=instance.id)
                .first()
            )
            address.default = True
            address.save()
        return super().destroy(request, *args, **kwargs)

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(cust=self.request.user.id)

    def get_serializer_class(self):
        if (
            self.action == "create"
            or self.action == "update"
            or self.action == "partial_update"
        ):
            return AddressWriteSerializer
        return AddressSerializer
