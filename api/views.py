import random

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializer import *
from api.util import code_generator, delete_prev_room, get_comments, next_player


class GetPlayerView(APIView):
    serializer_class = UserSerializer

    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        host = self.request.session.session_key
        if not User.objects.filter(host=host).exists():
            user = User(host=host, name=None)
            user.save()
        user = User.objects.filter(host=host)
        data = UserSerializer(user[0]).data
        return Response(data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        host = self.request.session.session_key
        serializer = UserUpdateSerializer(data=request.data)
        name = serializer.initial_data.get('name')
        color = serializer.initial_data.get('color')
        user = User.objects.filter(host=host)
        if not user.exists():
            if not user.exists():
                user = User(host=host, name=name, color=color)
                user.save()
        user = user[0]
        user.name = name
        user.color = color
        user.save(update_fields=['name', 'color'])
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


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
            user = User(host=host)
            user.save()
        host_room = Room.objects.filter(host=User.objects.filter(host=host)[0])
        if host_room.exists():
            return Response(self.serializer_class(host_room[0]).data, status=status.HTTP_200_OK)
        return Response({'Room': None}, status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        host = self.request.session.session_key
        delete_prev_room(host)
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
            finish_time = room_serializer.data.get('finish_time')

            Room(host=User.objects.filter(host=host)[0],
                 room=room,
                 difficulty=difficulty,
                 words_amount=words_amount,
                 finish_time=finish_time).save()
            return Response({'room': room}, status=status.HTTP_201_CREATED)
        return Response({'Bad Response': f'Not Valid Data: {room_serializer.errors}'},
                        status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        room_code = request.data.get('room_code')
        words_amount = request.data.get('words_amount')
        difficulty = request.data.get('difficulty')
        finish_time = request.data.get('finish_time')

        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        room.update(words_amount=words_amount, difficulty=difficulty, finish_time=finish_time)
        return Response({}, status=status.HTTP_200_OK)


class PrepareToGameView(APIView):

    def patch(self, request):
        host = self.request.session.session_key
        if not self.request.session.exists(host):
            self.request.session.create()

        room_code = request.data.get('room_code')

        user = User.objects.filter(host=host)
        if not user.exists():
            user = User(host=host).save()
        user = user[0]

        room = Room.objects.filter(room=room_code)
        if not room.exists():
            user.room_code = None
            user.save(update_fields=['room_code'])
            return Response({'Bad Response': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        user.room_code = room_code

        player = Players.objects.filter(user=user)
        if not player.exists():
            Players.objects.create(user=user, room=room[0],
                                   is_host=bool(host == room[0].host.host))
        player = Players.objects.filter(user=user)[0]
        comments = get_comments(room=room[0])
        context = {'room': GameRoomSerializer(instance=room[0]).data,
                   'me': PlayerSerializer(instance=player).data,
                   'comments': [CommentsSerializer(instance=comment).data
                                for comment in comments],
                   }
        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        host = self.request.session.session_key
        room_code = request.data.get('room_code')
        team = request.data.get('team')
        ready = request.data.get('ready')

        room = Room.objects.filter(room=room_code)
        user = User.objects.filter(host=host)
        if not room.exists() or not user.exists():
            return Response({'Bad Response': 'Room or User not found'}, status=status.HTTP_404_NOT_FOUND)

        Players.objects.filter(user=user[0]).update(team=team, ready=ready)
        return Response({}, status=status.HTTP_200_OK)


class LeaveGameView(APIView):
    def post(self, request):
        host = self.request.session.session_key
        room_code = request.data.get('room_code')

        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({'Bad Response': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        room[0].start = False
        room[0].save(update_fields=['start'])

        delete_prev_room(host)
        user = User.objects.filter(host=host)[0]
        user.room_code = None
        Players.objects.filter(user=user).delete()
        user.save(update_fields=['room_code'])
        return Response({}, status=status.HTTP_200_OK)


class AddComment(APIView):
    def post(self, request):
        host = self.request.session.session_key
        room_code = request.data.get('room')
        text = request.data.get('text')
        visible = request.data.get('visible')

        room = Room.objects.filter(room=room_code)
        user = User.objects.filter(host=host)
        if not room.exists() or not user.exists():
            return Response({'Bad Response': 'Room or User not found'}, status=status.HTTP_404_NOT_FOUND)
        Comments.objects.create(room=room[0], user=user[0], text=text, visible=visible)
        return Response({}, status=status.HTTP_201_CREATED)


class GameView(APIView):
    serializer = PlayerSerializer

    def patch(self, request):
        room_code = request.data.get('room')

        room = Room.objects.filter(room=room_code)[0]
        if not room.start:
            room.start = True
            room.save(update_fields=['start'])
        players = Players.objects.filter(room=room)
        player = next_player(players, room)
        return Response(self.serializer(player).data, status=status.HTTP_200_OK)

    def post(self, request):
        room_code = request.data.get('room')
        Room.objects.filter(room=room_code).update(start=False)
        return Response({}, status=status.HTTP_200_OK)


class NewWord(APIView):
    WordsModel = {'easy': EasyWord, 'medium': MediumWord, 'hard': HardWord}

    def patch(self, request):
        room_code = request.data.get('room')

        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        room.update(timer=True)
        words = Words.objects.filter(room=room[0])
        words = [word.word for word in words]
        for i in range(7):
            word = random.choice(self.WordsModel[room[0].difficulty].objects.all())
            while word.word in words:
                word = random.choice(self.WordsModel[room[0].difficulty].objects.all())
            Words(word=word.word, room=room[0], img=word.img).save()
            words.append(word.word)
        return Response({}, status=status.HTTP_200_OK)

    def post(self, request):
        room_code = request.data.get('room')

        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        room.update(timer=False)
        return Response({}, status=status.HTTP_200_OK)


class GuessWord(APIView):
    def patch(self, request):
        room_code = request.data.get('room_code')
        word = request.data.get('word')
        team = request.data.get('team')

        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({'Bad Response': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        Words.objects.filter(room=room[0], word=word).update(guess=1)
        room = room[0]
        if team == 1:
            room.team_1 += 1
        else:
            room.team_2 += 1
        room.save(update_fields=[f'team_{team}'])
        return Response({}, status=status.HTTP_200_OK)


class RestartGame(APIView):
    def post(self, request):
        room_code = request.data.get('room_code')
        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({'Bad Response': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        room.update(winner=None, team_1=0, team_2=0, start=False, timer=False)
        return Response({}, status=status.HTTP_200_OK)


class MixPlayers(APIView):
    def post(self, request):
        room_code = request.data.get('room_code')
        room = Room.objects.filter(room=room_code)
        if not room.exists():
            return Response({'Bad Response': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        players = Players.objects.filter(room=room[0])
        team = random.sample(list(players), k=len(players) // 2)
        number = random.randint(1, 2)
        for player in players:
            if player in team:
                player.team = number
            else:
                player.team = 3 - number
            player.ready = False
            player.save(update_fields=['team', 'ready'])
        return Response({}, status=status.HTTP_200_OK)
