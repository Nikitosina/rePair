class TFormCreateRoom extends TControl {
    constructor(Canvas) {
        super();
        this.Canvas = Canvas;
        this.players_num = 2;
        this.game_type = 'Castle';
        this.money = 100;
        this.private = false;
        this.table_bg = document.getElementById("table_bgimg");
        this.two_btn = this.add_child(new TButton(Canvas, 5, 10, 28, 10, "#CA6505", '2', 1));
        this.three_btn = this.add_child(new TButton(Canvas, 36, 10, 28, 10, "#CA6505", '3', 1));
        this.four_btn = this.add_child(new TButton(Canvas, 67, 10, 28, 10, "#CA6505", '4', 1));
        this.two_btn.click = this.change_player_num.bind(this);
        this.three_btn.click = this.change_player_num.bind(this);
        this.four_btn.click = this.change_player_num.bind(this);
        this.two_btn.pressed = true;
        this.castle_btn = this.add_child(new TButton(Canvas, 5, 30, 90, 10, "#CA6505", 'Castle', 2));
        this.castle_btn.pressed = true;
        this.money_left_btn = this.add_child(new TButton(Canvas, 5, 50, 8, 10, "#CA6505", '<'));
        this.money_btn = this.add_child(new TButton(Canvas, 15, 50, 70, 10, "#CA6505", 'MONEY'));
        this.money_right_btn = this.add_child(new TButton(Canvas, 87, 50, 8, 10, "#CA6505", '>'));
        this.public_btn = this.add_child(new TButton(Canvas, 5, 70, 44, 10, "#CA6505", 'Public', 3));
        this.public_btn.pressed = true;
        this.private_btn = this.add_child(new TButton(Canvas, 51, 70, 44, 10, "#CA6505", 'Private', 3));
        this.create_btn = this.add_child(new TButton(Canvas, 5, 82, 90, 10, "#CA6505", 'CREATE'));
        this.create_btn.click = this.create_btn_click.bind(this);
        socket.on('created_room', this.on_created_room.bind(this));
    }
    Show() {
        this.Canvas.drawImage(this.table_bg, 0, 0, CanvasElement.width, CanvasElement.height);
        super.Show()
    }
    change_player_num(e, btn) {
        this.players_num = parseInt(btn.text);
        console.log(this.players_num);
    }
    create_btn_click(e) {
        var room_data = {'players_num': this.players_num,
                         'game_type': this.game_type,
                         'money': this.money,
                         'private': this.private,
                         'first_card': new TCard(this.Canvas, 50, 25, 150),
                         'win_places': []};
        socket.emit('create_room', room_data);
    }
    on_created_room(room) {
        var FormLoadingScreen = new TFormLoadingScreen(Canvas, room);
		Application.set_form(FormLoadingScreen);
    }
}