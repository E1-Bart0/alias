from rest_framework import serializers

from api.models import User, Room


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class PlayerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['color', 'name']


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['difficulty', 'words_amount']


class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['room_code', 'team']
