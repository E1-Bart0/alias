from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import User, Room
from api.serializer import UserSerializer, PlayerUpdateSerializer, CreateRoomSerializer, RoomsSerializer, \
    GameSerializer
from api.util import code_generator, delete_prev_room


class GetPlayerView(APIView):
    serializer_class = UserSerializer

    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        host = self.request.session.session_key
        if not User.objects.filter(host=host).exists():
            player = User(host=host, name=None)
            player.save()
        player = User.objects.filter(host=host)
        data = UserSerializer(player[0]).data
        return Response(data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        host = self.request.session.session_key
        serializer = PlayerUpdateSerializer(data=request.data)
        name = serializer.initial_data.get('name')
        color = serializer.initial_data.get('color')
        player = User.objects.filter(host=host)
        if not player.exists():
            if not player.exists():
                player = User(host=host, name=name, color=color)
                player.save()
        player = player[0]
        player.name = name
        player.color = color
        player.save(update_fields=['name', 'color'])
        return Response(UserSerializer(player).data, status=status.HTTP_201_CREATED)


class AllRoomsView(generics.ListAPIView):
    serializer_class = RoomsSerializer
    queryset = Room.objects.all()


class RoomView(APIView):
    serializer_class = RoomsSerializer

    def get(self, request):
        host = self.request.session.session_key
        if not self.request.session.exists(host):
            self.request.session.create()
        if not User.objects.filter(host=host).exists():
            player = User(host=host)
            player.save()
        host_room = Room.objects.filter(host=User.objects.filter(host=host)[0])
        if host_room.exists():
            return Response(self.serializer_class(host_room[0]).data, status=status.HTTP_200_OK)
        return Response({'Room': None}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        host = self.request.session.session_key
        room = Room.objects.filter(host=User.objects.filter(host=host)[0])
        if room.exists():
            room.delete()
        return Response({}, status=status.HTTP_201_CREATED)


class CreateRoom(APIView):
    serializer = CreateRoomSerializer

    def post(self, request):
        host = self.request.session.session_key
        if not self.request.session.exists(host):
            self.request.session.create()
        room = code_generator()
        room_serializer = self.serializer(data=request.data)
        if room_serializer.is_valid():
            delete_prev_room(host)
            words_amount = room_serializer.data.get('words_amount')
            difficulty = room_serializer.data.get('difficulty')
            room_data = Room(host=User.objects.filter(host=host)[0],
                             room=room,
                             difficulty=difficulty,
                             words_amount=words_amount, )
            room_data.save()
            return Response({'room': room}, status=status.HTTP_201_CREATED)
        return Response({'Bad Response': f'Not Valid Data: {room_serializer.errors}'},
                        status=status.HTTP_400_BAD_REQUEST)


class GameView(APIView):

    def patch(self, request):
        host = self.request.session.session_key
        if not self.request.session.exists(host):
            self.request.session.create()

        serializer = GameSerializer(data=request.data)
        room_code = serializer.initial_data.get('room_code')
        team = serializer.initial_data.get('team')
        room = Room.objects.filter(room=room_code)

        player = User.objects.filter(host=host)
        if not player.exists():
            player = User(host=host).save()
        player = player[0]
        if not room.exists():
            player.room_code = None
            player.save(update_fields=['room_code', 'team'])
            return Response({'Bad Response': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        player.room_code = room_code
        player.team = team
        player.save(update_fields=['room_code', 'team'])
        players = User.objects.filter(room_code=room_code)

        context = {'room': RoomsSerializer(room[0]).data,
                   'all_players': [UserSerializer(p).data for p in players],
                   'player': UserSerializer(player).data}
        return Response(context, status=status.HTTP_200_OK)


class LeaveGameView(APIView):
    def post(self, request):
        host = self.request.session.session_key
        serializer = GameSerializer(data=request.data)
        room_code = serializer.initial_data.get('room')
        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({'Bad Response': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        delete_prev_room(host)
        player = User.objects.filter(host=host)[0]
        player.room_code = None
        player.team = 0
        player.save(update_fields=['room_code', 'team'])
        return Response({}, status=status.HTTP_200_OK)
