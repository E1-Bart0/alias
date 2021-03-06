"""aliace URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . views import *

urlpatterns = [
    path('player', GetPlayerView.as_view()),
    path('rooms', AllRoomsView.as_view()),
    path('room', RoomView.as_view()),
    path('create-room', CreateRoom.as_view()),
    path('game', PrepareToGameView.as_view()),
    path('leave-game', LeaveGameView.as_view()),
    path('create-comment', AddComment.as_view()),
    path('game-start', GameView.as_view()),
    path('new-word', NewWord.as_view()),
    path('guess-word', GuessWord.as_view()),
    path('restart-game', RestartGame.as_view()),
    path('mix-players', MixPlayers.as_view()),
]
