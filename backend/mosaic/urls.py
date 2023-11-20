from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UploadViewSet, DownloadViewSet, TimeViewSet, FaceViewSet

router = DefaultRouter()
router.register('upload', UploadViewSet, basename='upload')
router.register('download', DownloadViewSet, basename='download')
router.register('time', TimeViewSet, basename='time')
router.register('face', FaceViewSet, basename='face')

urlpatterns = [
    path('api/', include(router.urls))
]