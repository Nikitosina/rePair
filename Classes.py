import json
from flask_socketio import SocketIO, emit
from datetime import datetime
from random import randint
import logging

# logging.basicConfig(level=logging.DEBUG, filename='TM.log')
CODENAMES_TAKEN = set()


class Room:
    def __init__(self, json, req_sid):
        self.name = 'Room' + str(randint(0, 100000))
        self.players = [req_sid]
        self.players_num = json['players_num']
        self.game_type = json['game_type']
        self.n_cards = json['n_cards']
        self.money = json['money']
        self.private = json['private']
        if self.private:
            self.codename = self.generate_codename()
        self.first_card = json['first_card']
        self.win_places = json['win_places']
        # self.create_time = datetime.now().time()

    def add_player(self, req_sid):
        self.players.append(req_sid)

    def to_json(self):
        return self.__dict__
    
    def generate_codename(self):
        global CODENAMES_TAKEN
        while True:
            x = str(randint(100000, 1000000))
            if x not in CODENAMES_TAKEN:
                CODENAMES_TAKEN.add(x)
                return x

    def broadcast(self, event, msg):
        print(msg)
        for p in self.players:
            # print(len(self.players))
            emit(event, msg, room=p)


class DB:
    def __init__(self, filename):
        self.filename = filename

    def find_user(self, login):
        pass
