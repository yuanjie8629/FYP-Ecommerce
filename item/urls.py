from django.urls import include, path
from rest_framework.routers import DefaultRouter

from item.views import (
    ItemActiveListView,
    ItemListView,
    ItemView,
    PackagePrevView,
    ProductPrevView,
)

urlpatterns = [
    path("", ItemListView.as_view(), name="itemList"),
    path("active/", ItemActiveListView.as_view(), name="itemList"),
    path(r"product/", ProductPrevView.as_view(), name="productPrev"),
    path(r"package/", PackagePrevView.as_view(), name="packagePrev"),
    path(r"<int:pk>/", ItemView.as_view(), name="itemView"),
]
