from django.db import models

IMG = 'https://pixabay.com/get/g4b09d9e0d046b094964dc9977fdc17ef984ffc0a09a6b0f4947ab5bff0448dfe1e40a4a4c3fed4d594931b0d4c5d0f5b2b17e7561f3f44e90845bc30eca2df21_640.jpg'


class User(models.Model):
    host = models.CharField(max_length=60)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=50, null=True)
    color = models.CharField(max_length=10, default='#989898')
    room_code = models.CharField(max_length=10, null=True)


class Room(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.CharField(max_length=10, null=True)
    difficulty = models.CharField(max_length=20, default='easy')
    words_amount = models.IntegerField(default=20)
    created_at = models.DateTimeField(auto_now_add=True)
    start = models.BooleanField(default=False)
    timer = models.BooleanField(default=False)
    team_1 = models.IntegerField(default=0)
    team_2 = models.IntegerField(default=0)
    winner = models.CharField(max_length=10, null=True)
    finish_time = models.IntegerField(default=60)


class Players(models.Model):
    user = models.ForeignKey(User, related_name='users', on_delete=models.CASCADE)
    team = models.IntegerField(default=0)
    ready = models.BooleanField(default=False)
    is_host = models.BooleanField(default=False)
    room = models.ForeignKey(Room, related_name='in_room', on_delete=models.CASCADE)
    lead = models.BooleanField(default=False)


class Leader(models.Model):
    room = models.ForeignKey(Room, related_name='room_lead', on_delete=models.CASCADE)
    player = models.ForeignKey(Players, on_delete=models.CASCADE)


class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    visible = models.IntegerField(default=0)
    text = models.CharField(null=False, max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)


class EasyWord(models.Model):
    word = models.CharField(null=False, max_length=30, unique=True)
    img = models.CharField(default=IMG, max_length=150)

    def __str__(self):
        return self.word


class MediumWord(models.Model):
    word = models.CharField(null=False, max_length=30, unique=True)
    img = models.CharField(default=IMG, max_length=150)

    def __str__(self):
        return self.word


class HardWord(models.Model):
    word = models.CharField(null=False, max_length=30, unique=True)
    img = models.CharField(default=IMG, max_length=150)

    def __str__(self):
        return self.word


class Words(models.Model):
    word = models.CharField(null=True, max_length=30)
    img = models.CharField(default=IMG, max_length=150)
    room = models.ForeignKey(Room, related_name='room_words', on_delete=models.CASCADE)
    guess = models.IntegerField(default=0)

