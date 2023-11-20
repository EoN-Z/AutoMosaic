from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.response import Response
from .models import VideoUpload, VideoDownload
from .serializers import UploadSerializer, DownloadSerializer
import sys
import os

ai_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ai')
sys.path.append(ai_dir)

from ai.aihandler import facelist, domosaic



class UploadViewSet(viewsets.ModelViewSet):
    queryset = VideoUpload.objects.all()
    serializer_class = UploadSerializer
    


class DownloadViewSet(viewsets.ModelViewSet):
    queryset = VideoDownload.objects.all()
    serializer_class = DownloadSerializer



class TimeViewSet(viewsets.ModelViewSet):
    def create(self, request):
        response_data = {}
        response_data["facenum"] = facelist(request.data["times"])
        return Response(response_data)



class FaceViewSet(viewsets.ModelViewSet):
    def create(self, request):
        domosaic(request.data["faces"])
        return Response({'state': "Success"})