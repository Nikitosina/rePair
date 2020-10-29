from flask import Flask, render_template, json, request, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit
from datetime import datetime
from random import randint
import traceback
from multiprocessing import Process, SimpleQueue
from threading import Timer
import time
from pprint import pprint
from Classes import Room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'rePaiR!'
socketio = SocketIO(app)

# data = {}
rooms = [Room({'players_num': 2, 'game_type': 'Castle', 'n_cards': 5, 'money': 100, 'private': False, 'first_card': {}, 'win_places': []}, 9098696378)]
#          Room({'players_num': 2, 'game_type': 'Castle', 'money': 200, 'private': False}, 9098696372),
#          Room({'players_num': 2, 'game_type': 'Castle', 'money': 300, 'private': False}, 9098696371)]
p1 = None
t = None


def send_to_all_clients_in_room(room, req_sid, event, data):
    for client in room['players']:
        emit(event, data, room=client)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('create_room')
def create_room(json):
    global rooms
    new_room = Room(json, request.sid)
    rooms.append(new_room)
    print([x.name for x in rooms])
    emit('created_room', new_room.to_json())


@socketio.on('get_all_rooms')
def get_all_rooms():
    global rooms
    res = []
    for room in rooms:
        if len(room.players) < room.players_num and not room.private and room.visible:
            res.append(room.to_json())
    emit('all_rooms', res, room=request.sid)


@socketio.on('get_private_room')
def get_private_room(json):
    global rooms
    print(json)
    for room in rooms:
        if room.private:
            if room.codename == json['codename']:
                print(1)
                join({'name': room.name})
                return
    print(2)
    emit('error', {'error': f'Room "{json["codename"]}" was not found'}, room=request.sid)


@socketio.on('join')
def join(json):
    global rooms, p1, t
    for room in rooms:
        if room.name == json['name']:
            if len(room.players) < room.players_num:
                room.broadcast('new_player', request.sid)
                room.players.append(request.sid)
                emit('connect_to_room', room.to_json(), room=request.sid)
                if len(room.players) == room.players_num:
                    room.visible = False
                    print('start')
                    room.broadcast('start', {})
            else:
                print(1)
                emit('error', {'error': 'too many players'}, room=request.sid)
            return


@socketio.on('disconnect')
def disconnect():
    global rooms
    print(123)
    for room in rooms:
        if request.sid in room.players:
            room.players.pop(room.players.index(request.sid))
            if not room.players:
                rooms.pop(rooms.index(room))


@socketio.on('update_castle')
def update_castle(json):
    items = json['items']
    item_id = json['item_id']
    print(items, item_id)
    for room in rooms:
        if request.sid in room.players:
            success = room.place_card(items, item_id, request.sid)
            if success:
                emit('card_played', {}, room=request.sid)
            # room.broadcast('updated_castle', json)


@socketio.on('get_place')
def get_place():
    for room in rooms:
        if request.sid in room.players:
            if request.sid not in room.win_places:
                room.win_places.append(request.sid)
                emit('get_place', {'place': len(room.win_places)}) # room.places.index(request.sid) + 1})
                if len(room.win_places) == room.players_num - 1: # means game has finished
                    for i in room.players:
                        if i not in room.win_places:
                            last_player = i
                    emit('get_place', {'place': room.players_num}, room=last_player)
                    room.broadcast('game_has_ended', {})
                    room.win_places.append(last_player)
                    room.old_players = room.players.copy()
                    room.win_places = []
                    room.players = []


@socketio.on('leave_room')
def leave_room(json):
    for room in rooms:
        if json['name'] == room.name:
            if request.sid in room.players:
                room.players.pop(room.players.index(request.sid))
            if request.sid in room.old_players:
                room.old_players.pop(room.old_players.index(request.sid))

            if not room.players and not room.old_players:
                rooms.pop(rooms.index(room))
            elif not room.old_players and len(room.players) < room.players_num and not room.win_places:
                room.visible = True
            return


@socketio.on('play_again')
def play_again(json):
    for room in rooms:
        if json['name'] == room.name:
            if request.sid in room.old_players and len(room.players) < room.players_num:
                room.old_players.pop(room.old_players.index(request.sid))
                join(json)
            if not room.old_players and len(room.players) < room.players_num and not room.win_places:
                room.visible = True


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='5000')
