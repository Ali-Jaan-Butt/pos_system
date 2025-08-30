from django.db import models
import uuid


class User(models.Model):
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    is_active = models.CharField(max_length=200, default=False)
    activation_token = models.UUIDField(default=uuid.uuid4, unique=True)

    def __str__(self):
        return self.username