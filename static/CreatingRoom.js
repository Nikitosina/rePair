class TFormCreateRoom extends TControl {
    constructor(Canvas) {
        super();
        this.Canvas = Canvas;
        this.players_num = 2;
        this.game_type = 'Castle';
        this.money = 0;
        this.n_cards = 3;
        this.private = false;
        this.table_bg = document.getElementById("table_bgimg");
        this.two_btn = this.add_child(new TButton(Canvas, 5, 10, 28, 10, STYLES.btn, '2', 1));
        this.three_btn = this.add_child(new TButton(Canvas, 36, 10, 28, 10, STYLES.btn, '3', 1));
        this.four_btn = this.add_child(new TButton(Canvas, 67, 10, 28, 10, STYLES.btn, '4', 1));
        this.two_btn.click = this.change_player_num.bind(this);
        this.three_btn.click = this.change_player_num.bind(this);
        this.four_btn.click = this.change_player_num.bind(this);
        this.two_btn.pressed = true;
        this.castle_btn = this.add_child(new TButton(Canvas, 5, 25, 90, 10, STYLES.btn, 'Castle', 2));
        this.castle_btn.pressed = true;
        this.add_child(new TTextField(Canvas, 'Number of cards', 5, 38, 90, 10, '', 6))
        this.cards_less_btn = this.add_child(new TButton(Canvas, 5, 50, 8, 10, STYLES.btn, '<'));
        this.card_count = this.add_child(new TTextField(Canvas, this.n_cards, 15, 50, 70, 10, STYLES.btn));
        this.cards_more_btn = this.add_child(new TButton(Canvas, 87, 50, 8, 10, STYLES.btn, '>'));
        this.cards_less_btn.click = this.less_cards.bind(this)
        this.cards_more_btn.click = this.more_cards.bind(this)
        this.public_btn = this.add_child(new TButton(Canvas, 5, 70, 44, 10, STYLES.btn, 'Public', 3));
        this.public_btn.pressed = true;
        this.public_btn.click = this.make_public.bind(this)
        this.private_btn = this.add_child(new TButton(Canvas, 51, 70, 44, 10, STYLES.btn, 'Private', 3));
        this.private_btn.click = this.make_private.bind(this)
        this.create_btn = this.add_child(new TButton(Canvas, 5, 82, 90, 10, STYLES.btn, 'CREATE'));
        this.create_btn.click = this.create_btn_click.bind(this);
        this.home = this.add_child(new TButton(Canvas, 1, 1, 10, 8, STYLES.btn, 'Home', undefined, 2));
        this.home.click = this.home_btn_click.bind(this)
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
    less_cards(e, btn) {
        if (this.n_cards > 3) {
            this.n_cards -= 1;
            this.card_count.change_text(this.n_cards);
        }
    }
    more_cards(e, btn) {
        if (this.n_cards < 24) {
            this.n_cards += 1;
            this.card_count.change_text(this.n_cards);
        }
    }
    make_private(e, btn) {
        this.private = true;
    }
    make_public(e, btn) {
        this.private = false;
    }
    create_btn_click(e) {
        var room_data = {'players_num': this.players_num,
                         'game_type': this.game_type,
                         'n_cards': this.n_cards,
                         'money': 0,
                         'private': this.private,
                         'first_card': new TCard(this.Canvas, 50, 25, 150),
                         'win_places': []};
        socket.emit('create_room', room_data);
    }
    home_btn_click() {
		var FormMainScreen = new TFormMainScreen(Canvas);
		Application.set_form(FormMainScreen);
	}
    on_created_room(room) {
        var FormLoadingScreen = new TFormLoadingScreen(Canvas, room);
		Application.set_form(FormLoadingScreen);
    }
}