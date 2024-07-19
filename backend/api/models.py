from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email=models.EmailField(unique=True)
    password=models.CharField(max_length=100)
    REQUIRED_FIELDS = ['email'] 



class Students(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=6)
    grade = models.CharField(max_length=2)
    address = models.TextField()
    contact_number = models.CharField(max_length=15)

    def __str__(self):
        return self.first_name
    

