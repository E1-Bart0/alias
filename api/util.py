import random
import string

from api.models import Room, User, Comments, Leader


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


def get_comments(room):
    comments = Comments.objects.filter(room=room)

    return comments


def next_player(players, room):
    team_1 = list(filter(lambda pl: pl.team == 1, players))
    team_2 = list(filter(lambda pl: pl.team == 2, players))
    player_not_lead_1 = list(filter(lambda pl: not pl.lead, team_1))
    player_not_lead_2 = list(filter(lambda pl: not pl.lead, team_2))

    if len(player_not_lead_1) == 0:
        player_not_lead_1 = discard_leads(team_1)
    if len(player_not_lead_2) == 0:
        player_not_lead_2 = discard_leads(team_2)

    leaders = Leader.objects.filter(room=room)
    if leaders.exists():
        leader = leaders
        if leader[0].player.team == 1:
            player = player_not_lead_2[0]
        else:
            player = player_not_lead_1[0]
        leader.update(player=player)
        winner_check(leader[0], room)
    else:
        player = player_not_lead_1[0] if len(player_not_lead_1) >= len(player_not_lead_2) \
            else player_not_lead_2[0]
        Leader(room=room, player=player).save()
    player.lead = True
    player.save(update_fields=['lead'])
    return player


def winner_check(leader, room):
    if leader.player.team == 1:
        if room.team_1 >= room.words_amount or room.team_2 >= room.words_amount:
            if room.team_1 > room.team_2:
                room.winner = 'Team 1'
            elif room.team_1 < room.team_2:
                room.winner = 'Team 2'
            else:
                room.winner = 'Tie'
            room.save(update_fields=['winner'])
    return


def discard_leads(team):
    for player in team:
        player.lead = False
        player.save(update_fields=['lead'])
    return team
