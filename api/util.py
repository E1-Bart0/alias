import random
import string

from api.models import Room, User


def code_generator():
    length = 6
    code = ''.join(random.choices(string.ascii_uppercase, k=length))
    while Room.objects.filter(room=code).exists():
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
    return code


def delete_prev_room(host):
    room = Room.objects.filter(host=User.objects.filter(host=host)[0])
    if room.exists():
        room.delete()