class TFormCastleGame extends TControl{
	constructor(Canvas, room) {
		super();
		this.Canvas = Canvas;
		this.table_bg = document.getElementById("table_bgimg");
		this.animations = [];
		this.my_sid = socket.io.engine.id;

		this.room = room;
		console.log(this.room);
		this.castle = []; // all top cards
		this.deck = this.generate_deck(this.room.n_cards);
		this.card = this.deck[0];
		this.on_castle_init({'top_card': room['first_card']}); //creates this.top_card
		this.next_card = null;
		this.enemies = [];
		this.create_enemies();
		console.log(this.enemies)
		this.add_child(this.top_card);
		this.finished = false;
		this.place = null;

		this.main_menu_btn = this.add_child(new TButton(Canvas, 5, 85, 90, 10, STYLES.btn, 'Main Menu'));
		this.main_menu_btn.click = this.main_menu_btn_click.bind(this);
		this.play_again_btn = this.add_child(new TButton(Canvas, 5, 72, 90, 10, STYLES.btn, 'Play Again'));
		this.play_again_btn.click = this.play_again.bind(this);
		this.play_again_btn.visible = false;
		this.place_label = this.add_child(new TTextField(this.Canvas, 'Your place is ', 50, 5, 1, 1, '', 6))

		if ('$updated_castle' in socket._callbacks) {
			socket._callbacks['$updated_castle'] = []
			socket._callbacks['$get_place'] = []
			socket._callbacks['$card_played'] = []
			socket._callbacks['$game_has_ended'] = []
		}
		
		socket.on('updated_castle', this.on_castle_updated.bind(this));
		socket.on('get_place', this.on_get_place.bind(this));
		socket.on('card_played', this.on_card_played.bind(this));
		socket.on('game_has_ended', this.on_game_end.bind(this));

		console.log(socket._callbacks);
	}
	on_key_down(e) {}
	Show() {
		this.Canvas.drawImage(this.table_bg, 0, 0, CanvasElement.width, CanvasElement.height);
		this.castle.map(card => card.Show());
		this.enemies.map(e => e.card.Show());
		if (this.animations.map(a => a.A_type).indexOf('my_turn') == -1) this.top_card.Show();
		if (this.finished) {
			this.Canvas.globalAlpha = 0.5;
			this.Canvas.fillStyle = 'black';
			this.Canvas.fillRect(0, 0, CanvasElement.width, CanvasElement.height);
			this.Canvas.globalAlpha = 1;
			// Application.print_with_the_font('your place is ' + this.place, 13 * Application.ScaleX, 20 * Application.ScaleY, Application.ScaleX * 0.5);
			this.place_label.Show()
			this.main_menu_btn.Show();
			if (this.play_again_btn.visible) this.play_again_btn.Show();
		}
		else {
			this.card.Show();
		}
		for (var i = 0; i < this.animations.length; i++) {
			if (this.animations[i].ended) {
				this.animations[i].Show();

				this.top_card = new TCard(this.Canvas, this.animations[i].card_A.x, this.animations[i].card_A.y, 17);
				this.top_card.items = [];
				this.top_card.n_items = this.next_card.items.length;
				for (var j = 0; j < this.top_card.n_items; j++) this.top_card.items.push(new TItem(this.Canvas, this.next_card.items[j].number, this.top_card.r, 0, 0, this.next_card.items[j].scale, this.next_card.items[j].rotation));
				this.animations.splice(i, 1);
				this.add_child(this.top_card);
			}
			else this.animations[i].Show();
		}
	}
	generate_deck(n_cards) {
		var deck = [];
		for (var i = 0; i < n_cards; i++) {
			var card = new TCard(Canvas, 50, 75, 20); 
			deck.push(card);
			this.add_child(card)
		}
		return deck
	}
	create_enemies() {
		for (var i = 0; i < this.room.players.length; i++) {
			if (this.room.players[i] != this.my_sid) {
				switch (this.enemies.length) {
					case 0:
						this.enemies.push({'sid': this.room.players[i], 'card': new TEnemyCard(this.Canvas, -10, 35, 20)});
						break;
					case 1:
						this.enemies.push({'sid': this.room.players[i], 'card': new TEnemyCard(this.Canvas, 110, 35, 20)});
						break;
					case 2:
						this.enemies.push({'sid': this.room.players[i], 'card': new TEnemyCard(this.Canvas, 50, -10, 20)});
				}
			}
		}
	}
	on_click(e) {
		if (!this.finished) {
			var id = -1;
			if (this.card.is_inside(e)) {
				var your_id_clicked = this.card.get_item_id(e);
				if ((your_id_clicked > -1) && (this.card.check_timer()) && (this.top_card.check_item(your_id_clicked))) id = your_id_clicked;
			}
			if (this.card.is_inside(e)) {
				var top_id_clicked = this.top_card.get_item_id(e);
				if ((top_id_clicked > -1) && (this.top_card.check_timer()) && (this.card.check_item(your_id_clicked))) id = top_id_clicked;
			}

			if (id > -1) {
				socket.emit('update_castle', {'items': this.card.items, 'item_id': id});
			}
		}
		else super.on_click(e);
	}
	on_castle_init(msg) { // initializes castle
		this.top_card = new TCard(this.Canvas, msg['top_card']['x'], msg['top_card']['y'], 17);
		this.top_card.items = [];
		this.top_card.n_items = msg['top_card']['items'].length;
		for (var i = 0; i < msg['top_card']['items'].length; i++) {
			this.top_card.items.push(new TItem(this.Canvas, msg['top_card']['items'][i]['number'], msg['top_card']['r'], 0, 0, msg['top_card']['items'][i]['scale'], msg['top_card']['items'][i]['rotation']))
		}
		console.log(this.top_card)
	}
	on_castle_updated(msg) { // updates castle
		var new_items = msg.items
		this.castle.push(this.top_card);

		for (var i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].sid == msg.player) {
				var next_card = new TCard(this.Canvas, this.enemies[i].card.x, this.enemies[i].card.y, 17);
				next_card.items = [];
				next_card.n_items = new_items.length;
				for (var i = 0; i < next_card.n_items; i++) {
					next_card.items.push(new TItem(this.Canvas, new_items[i].number, next_card.r, 0, 0, new_items[i].scale, new_items[i]['rotation']))
				}
				this.next_card = next_card;

				this.animations.push(new TAnimation(this.Canvas, this.next_card, this.top_card, 15, 'turn', 3));
			}
		}

		for (var i = 0; i < this.enemies.length; i++) if (this.enemies[i].sid == msg.player) this.enemies[i].card = new TEnemyCard(this.Canvas, this.enemies[i].card.x, this.enemies[i].card.y, this.enemies[i].card.r);
		// this.add_child(this.top_card);
		// + enemy card animation
	}
	on_card_played() {
		this.deck.splice(0, 1);
		// start animation
		this.castle.push(this.top_card);
		this.animations.push(new TAnimation(this.Canvas, this.card, this.top_card, 15, 'turn', 3, 5));
		this.next_card = this.card;

		if (this.deck.length > 0) this.card = this.deck[0];
		else {
			this.card = null;
			this.finished = true;
			socket.emit('get_place');
		}
	}
	on_get_place(msg) {
		this.place = msg['place'];
		this.finished = true;
		this.place_label.change_text('Your place is ' + this.place)
		console.log(this.place)
	}
	on_game_end(msg) {
		this.play_again_btn.visible = true;
	}
	play_again() {
		socket.emit('play_again', this.room)
	}
	main_menu_btn_click() {
		socket.emit('leave_room', this.room);
		var FormMainScreen = new TFormMainScreen(Canvas);
		Application.set_form(FormMainScreen);
	}
}


class TAnimation extends TControl {
	constructor(Canvas, card_A, card_B, angle, A_type, speed=0, k_shiftx=0) {
		super();
		this.Canvas = Canvas;
		this.card_A = card_A;
		this.card_B = card_B;
		this.A_type = A_type;
		this.speed = speed; // %
		this.k_shiftx = k_shiftx;
		this.shiftx = this.k_shiftx * (Math.random() - 0.5)
		this.g = 9.8;
		this.angle = angle;
		this.dx = this.card_A.x - this.card_B.x + this.shiftx;
		this.dy = this.card_A.y - this.card_B.y;
		this.init_r = this.card_A.r;
		this.init_x = this.card_A.x;
		this.init_y = this.card_A.y;
		this.hyp = Math.sqrt(this.dx ** 2 + this.dy ** 2); // hypotenuse
		this.r0 = (this.card_A.r - this.card_B.r) * Math.tan((90 - this.angle) * Math.PI / 180);
		this.v1 = Math.sqrt((this.g * (this.hyp - this.r0)) / (2 * Math.sin(this.angle * Math.PI / 180)));
		this.cur_pos = 0;
		this.ended = false;
	}
	Show() {
		if (this.A_type == 'turn') {
			if (this.cur_pos < this.hyp) {
				var sin_beta = this.dx / this.hyp;
				var cos_beta = this.dy / this.hyp
				var h = this.cur_pos * Math.tan(this.angle * Math.PI / 180) - (this.g * (this.cur_pos ** 2)) / (2 * (this.v1 ** 2) * Math.cos(this.angle * Math.PI / 180));
				var deltaX = this.cur_pos * sin_beta
				var deltaY = this.cur_pos * cos_beta
				this.card_A.x = this.init_x - deltaX;
				this.card_A.y = this.init_y - deltaY;
				this.card_A.r = this.init_r + h;
				this.cur_pos += this.speed;
				this.card_A.Show()
			}
			else {
				this.card_A.y = this.card_B.y;
				this.card_A.Show()
				this.ended = true;
			}
		}
	}
}


class TCard {
	constructor(Canvas, x, y, r) {
		this.Canvas = Canvas;
		this.max_r = r; // % by y-axis !!!
		this.r = r;
		this.n_items = getRandomInt(8, 10);
		this.items = this.generate_items();
		this.items[this.n_items - 1].scale += 0.1;
		this.x = x; // %
		this.y = y; // в процентах
		this.clicks_count = 0;
		this.timer = null;
	}
	Show() {
		// if ((this.r < this.max_r) && (!this.parent.A_type)) this.r = ;
		this.Canvas.fillStyle = '#ffffff';
		this.Canvas.beginPath();
		this.Canvas.arc(this.x * Application.ScaleX, this.y * Application.ScaleY, this.r * Application.ScaleY, 0, 2 * Math.PI);
		this.Canvas.fill();
		//var img1 = this.get_image_coords(20, 0, 0);
		//this.Canvas.drawImage(this.images, img1[0], img1[1], img1[2], img1[3], 0, 0, img1[2], img1[3]);

		/*this.Canvas.strokeStyle = '#ff0000';
		this.Canvas.beginPath();
		this.Canvas.arc(this.x * Application.ScaleX, this.y * Application.ScaleY, this.r * 0.7, 0, 2 * Math.PI);
		this.Canvas.stroke();*/

		for (var i = 0; i < this.n_items - 1; i++) {
			var xc = this.x * Application.ScaleX + Math.cos(2 * (i + 1) * Math.PI / (this.n_items - 1)) * this.r * Application.ScaleY * 0.7;
			var yc = this.y * Application.ScaleY - Math.sin(2 * (i + 1) * Math.PI / (this.n_items - 1)) * this.r * Application.ScaleY * 0.7;

			this.items[i].xc = xc;
			this.items[i].yc = yc;
			this.items[i].rc = this.r * Application.ScaleY;
			this.items[i].Show();
		}
			this.items[this.n_items - 1].xc = this.x * Application.ScaleX;
			this.items[this.n_items - 1].yc = this.y * Application.ScaleY;
			this.items[this.n_items - 1].rc = this.r * Application.ScaleY;
			this.items[this.n_items - 1].Show();
	}
	generate_items() {
		var items = [];
		var numbers = [];
		while (true) {
			var x = getRandomInt(0, 22);
			var size = getRandomInt(23, 28) * 0.01;
			var rotation = getRandomInt(-25, 25);
			if (numbers.indexOf(x) == -1) {numbers.push(x); items.push(new TItem(this.Canvas, x, this.r, 0, 0, size, rotation));}
			if (items.length == this.n_items) break;
		}
		console.log(items);
		return items
	}
	check_item(id) {
		for (var i of this.items) if (i.number == id) return true;
		return false;
	}
	get_item_id(e) {
		var x = this.x * Application.ScaleX - e.x;
		var y = this.y * Application.ScaleY - e.y;
		if (this.is_inside(e)) {
			for (var i of this.items) {
				var xi = this.x * Application.ScaleX - i.xc - x;
				var yi = this.y * Application.ScaleY - i.yc - y;
				if (xi * xi + yi * yi <= (i.rc * i.scale) * (i.rc * i.scale)) return i.number;
			}
		}
		return -1
	}
	is_inside(e) {
		var x = this.x * Application.ScaleX - e.x;
		var y = this.y * Application.ScaleY - e.y;
		var r = this.r * Application.ScaleY;
		if (x * x + y * y <= r * r) return true;
		return false;
	}
	check_timer() {
		console.log(this.clicks_count);
		if (this.clicks_count == 0) {
			this.timer = setTimeout(this.reset_clicks(), 1000);
			this.clicks_count += 1
			return true;
		}
		if (this.clicks_count <= 3) {
			this.clicks_count += 1;
			return true;
		}
		clearTimeout(this.timer);
		this.clicks_count += 1
		this.timer = setTimeout(this.reset_clicks(), 500);
		return false;
	}
	reset_clicks() {
		console.log(this.clicks_count + '!')
		this.clicks_count = 0
	}
}


class TEnemyCard extends TCard {
	constructor(Canvas, x, y, r) {
		super(Canvas, x, y, r);
		for (var i = 0; i < this.items.length; i++) this.items[i].number = 63;
	}
}


class TItem {
	constructor(Canvas, number, rc, xc, yc, scale=0.25, rotation=45) {
		this.Canvas = Canvas;
		this.number = number;
		this.scale = scale;
		this.rotation = rotation;
		this.rc = rc;
		this.xc = xc;
		this.yc = yc;
		this.images = document.getElementById("card_imagesimg");
	}
	Show() {
		var img = this.get_image_coords(this.number);
		//this.Canvas.beginPath(); //circles for debug
		//this.Canvas.arc(this.xc, this.yc, this.rc * this.scale, 0, 2 * Math.PI);
		//this.Canvas.stroke();

		var xp = Math.cos(3 * Math.PI / 4) * this.rc * (this.scale + 0.05);
		var yp = Math.sin(3 * Math.PI / 4) * this.rc * (this.scale + 0.05);
		this.Canvas.save();
		this.Canvas.translate(this.xc, this.yc);
		this.Canvas.rotate(this.rotation * Math.PI / 180);
		this.Canvas.drawImage(this.images, img[0], img[1], img[2], img[3], xp, -yp, Math.abs((this.xc + xp) - (this.xc - xp)), Math.abs((this.yc + yp) - (this.yc - yp)));
		this.Canvas.restore();
	}
	get_image_coords(n) {
		var xpos = 3;
		var ypos = 3;
		var symb_width = 253; //in font png!
		var symb_height = 250;
		var next_symb_x = 256;
		var next_symb_y = 256;
		//Canvas.drawImage(this.images, xpos+next_symb_x*(n%8), ypos+next_symb_y*(Math.floor(n/8)), symb_width, symb_height, (x+(next_symb_x)), y, symb_width, symb_height);
		return ([xpos+next_symb_x*(n%8), ypos+next_symb_y*(Math.floor(n/8)), symb_width, symb_height])
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

//window.obj = [];

//window.FormField = new TFormField(Canvas);