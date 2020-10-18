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
socketio = SocketIO(app)

# data = {}
rooms = [Room({'players_num': 2, 'game_type': 'Castle', 'money': 100, 'private': False, 'first_card': {}, 'win_places': []}, 9098696378)]
#          Room({'players_num': 2, 'game_type': 'Castle', 'money': 200, 'private': False}, 9098696372),
#          Room({'players_num': 2, 'game_type': 'Castle', 'money': 300, 'private': False}, 9098696371)]
# rooms = []
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
    print(rooms[1].name)
    emit('created_room', new_room.to_json())


@socketio.on('get_all_rooms')
def get_all_rooms():
    global rooms
    res = []
    for room in rooms:
        if len(room.players) < room.players_num:
            res.append(room.to_json())
    emit('all_rooms', res, room=request.sid)


@socketio.on('join')
def join(json):
    global rooms, p1, t
    print(json)
    for room in rooms:
        if room.name == json['name']:
            if len(room.players) < room.players_num:
                room.players.append(request.sid)
                room.broadcast('new_player', room.to_json())
                if len(room.players) == room.players_num:
                    room.broadcast('start', {})
            else:
                print(1)
                emit('err', {'err': 'too many players'}, room=request.sid)
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
    print(888)
    for room in rooms:
        if request.sid in room.players:
            room.broadcast('updated_castle', json)


@socketio.on('get_place')
def get_place():
    for room in rooms:
        if request.sid in room.players:
            if request.sid not in room.win_places:
                room.win_places.append(request.sid)
                emit('get_place', {'place': len(room.win_places)}) # room.places.index(request.sid) + 1})
                if len(room.win_places) == room.players_num - 1:
                    for i in room.players:
                        if i not in room.win_places:
                            last_player = i
                    emit('get_place', {'place': room.players_num}, room=last_player)
                    rooms.pop(rooms.index(room))
                    print(rooms)



# FROM TANKOMANIA
@socketio.on('update_obj')
def update_obj(json):
    global rooms
    for room in rooms:
        if request.sid in room['players']:
            for i in range(len(json)):
                create = True
                for j in range(len(room['obj'])):
                    if json[i]['name'] == room['obj'][j]['name']:
                        if 'status' in json[i]:
                            room['obj'].pop(j)
                        else:
                            if 'skin' in json[i]:
                                json[i].pop('skin')
                            room['obj'][j].update(json[i])
                        create = False
                        break
                if create and 'status' not in json[i]:
                    room['obj'].append(json[i])
            # room.update(json)
            for client in room['players']:
                if client != request.sid:
                    emit('update_obj', json, room=client)

    print(json, rooms)


@socketio.on('update_map')
def update_map(json):
    for room in rooms:
        if request.sid in room['players']:
            room['map'] = json
            for client in room['players']:
                if client != request.sid:
                    emit('update_map', json, room=client)


'''@socketio.on('check_hit')
def check_hit(json):
    f = False
    resp = []
    for room in rooms:
        if request.sid in room['players']:
            for j in range(len(room['obj'])):
                if json[0]['name'] == room['obj'][j]['name']:
                    if json[0]['x'] == room['obj'][j]['x'] and json[0]['y'] == room['obj'][j]['y']:
                        room['obj'][j]['hp'] -= 1
                        f = True
                        resp.append(room['obj'][j])
                        break
            if f:
                for j in range(len(room['obj'])):
                    if json[1]['name'] == room['obj'][j]['name']:
                        resp.append(json[1])
                        room['obj'].pop(j)
                        send_to_all_clients_in_room(room, request.sid, 'update_obj', resp)
                        break
            else:
                send_to_all_clients_in_room(room, request.sid, 'update_obj', resp)
    print(resp)'''


@socketio.on('game_over')
def del_room(json):
    global rooms
    for i in range(len(rooms)):
        if request.sid in rooms[i]['players']:
            rooms.pop(i)
            break
    print(len(rooms))


def timer(s, room):
    time.sleep(s)
    spawn_bullet_pack(room)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port='5000')
