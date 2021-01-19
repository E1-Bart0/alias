from django.db import models


class User(models.Model):
    host = models.CharField(max_length=60)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=50, null=True)
    color = models.CharField(max_length=10, default='#989898')
    room_code = models.CharField(max_length=10, null=True)


class Players(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.IntegerField(default=0)
    ready = models.BooleanField(default=False)


class Room(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.CharField(max_length=10, null=True)
    difficulty = models.CharField(max_length=20, default='easy')
    words_amount = models.IntegerField(default=2)
    created_at = models.DateTimeField(auto_now_add=True)
    players = models.ForeignKey(Players, on_delete=models.CASCADE)