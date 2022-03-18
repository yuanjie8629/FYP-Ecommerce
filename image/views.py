
from rest_framework import generics
from image.models import Image

from image.serializers import ImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class ImageView(generics.RetrieveAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = [MultiPartParser, FormParser]