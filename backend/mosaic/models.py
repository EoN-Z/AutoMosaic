from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import os


class OverwriteUpload(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        _, ext = os.path.splitext(name)
        newname = "input" + ext
        self.delete(newname)
        return newname



class OverwriteDownload(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        _, ext = os.path.splitext(name)
        newname = "output" + ext
        self.delete(newname)
        return newname
    


class VideoUpload(models.Model):
    file = models.FileField(upload_to='', storage=OverwriteUpload())
    
    def __str__(self):
        return self.file
    
    def save(self, *args, **kwargs):
        self.__class__.objects.exclude(id=self.id).delete()
        super(VideoUpload, self).save(*args, **kwargs)
        


class VideoDownload(models.Model):
    file = models.FileField(upload_to='', storage=OverwriteDownload())
    
    def __str__(self):
        return self.file
    
    def save(self, *args, **kwargs):
        self.__class__.objects.exclude(id=self.id).delete()
        super(VideoDownload, self).save(*args, **kwargs)

