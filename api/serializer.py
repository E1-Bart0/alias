from rest_framework import serializers

from api.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['color', 'name']


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['difficulty', 'words_amount','finish_time']


class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'color', 'id']


class PlayerSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(required=True)

    class Meta:
        model = Players
        fields = ['user', 'team', 'ready', 'is_host', 'lead']


class LeaderSerializer(serializers.ModelSerializer):
    player = PlayerSerializer(required=True)

    class Meta:
        model = Leader
        fields = ['player']


class WordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Words
        fields = ['word', 'guess', 'img']


class GameRoomSerializer(serializers.ModelSerializer):
    in_room = PlayerSerializer(many=True, read_only=True)
    room_lead = LeaderSerializer(many=True, read_only=True)
    room_words = WordsSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['room', 'difficulty', 'in_room', 'start', 'room_lead',
                  'timer', 'room_words', 'team_1', 'team_2', 'words_amount',
                  'winner', 'finish_time',]


class CommentsSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer(required=True)

    class Meta:
        model = Comments
        fields = ['user', 'visible', 'text']
