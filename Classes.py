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
        self.old_players = []
        self.game_type = json['game_type']
        self.n_cards = json['n_cards']
        self.money = json['money']
        self.private = json['private']
        self.visible = True
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

    def broadcast(self, event, msg, exc=''):
        print(msg)
        for p in self.players:
            if p != exc:
                emit(event, msg, room=p)
    
    def place_card(self, items, item_id, req_sid):
        for i in range(len(self.first_card['items'])):
            if item_id == self.first_card['items'][i]['number']:
                self.first_card['items'] = items
                self.broadcast('updated_castle', {'items': items, 'player': req_sid}, exc=req_sid)
                return True
        return False


class DB:
    def __init__(self, filename):
        self.filename = filename

    def find_user(self, login):
        pass
