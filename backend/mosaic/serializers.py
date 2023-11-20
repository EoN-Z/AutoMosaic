from rest_framework import serializers
from .models import VideoUpload, VideoDownload

class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoUpload
        fields = ['file']
        

class DownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoDownload
        fields = ['file']