class TFormCastleGame extends TControl{
	constructor(Canvas, room) {
		super();
		this.Canvas = Canvas;
		this.table_bg = document.getElementById("table_bgimg");

		this.room = room;
		console.log(this.room);
		this.deck = this.generate_deck(this.room.n_cards);
		this.card = this.deck[0];
		this.on_castle_init({'top_card': room['first_card']}); //creates this.top_card
		this.add_child(this.card);
		this.add_child(this.top_card);
		console.log(this.children);
		this.finished = false;
		this.place = null;

		this.main_menu_btn = this.add_child(new TButton(Canvas, 5, 85, 90, 10, "#CA6505", 'Main menu'));
		this.main_menu_btn.click = this.main_menu_btn_click.bind(this);

		socket.on('updated_castle', this.on_castle_updated.bind(this));
		socket.on('get_place', this.on_get_place.bind(this))

//		this.ButtonUp1 = new TButton();
	}
	on_key_down(e) {}
	Show() {
		this.Canvas.drawImage(this.table_bg, 0, 0, CanvasElement.width, CanvasElement.height);
		this.top_card.Show();
		if (this.finished) {
			this.Canvas.globalAlpha = 0.5;
			this.Canvas.fillStyle = 'black';
			this.Canvas.fillRect(0, 0, CanvasElement.width, CanvasElement.height);
			this.Canvas.globalAlpha = 1;
			Application.print_with_the_font('your place is ' + this.place, 13 * Application.ScaleX, 20 * Application.ScaleY, Application.ScaleX * 0.5);
			this.main_menu_btn.Show();
		}
		else {
			this.card.Show();
        }
	}
	generate_deck(n_cards) {
		var deck = [];
		for (var i = 0; i < n_cards; i++) {
			deck.push(new TCard(Canvas, 50, 75, 180));
		}
		return deck
	}
	show_players() {
		if (this.room.players_num < 4) {
			for (var i = 0; i < this.room.players_num; i++)
			players_pos = [[150 * Application.ScaleX, 50 * Application.ScaleY], []]
        }
		this.Canvas.fillStyle = '#ffffff';
        this.Canvas.font = (8 * Application.ScaleY).toString() + 'px Arial';
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'top';

	}
	on_click(e) {
		if (!this.finished) {
			var your_id_clicked = this.card.get_item_id(e);
			var top_id_clicked = this.top_card.get_item_id(e);
			var flag = false;
			if (your_id_clicked > -1) {
				if (this.top_card.check_item(your_id_clicked)) flag = true;
			} else if (top_id_clicked > -1) {
				if (this.card.check_item(top_id_clicked)) flag = true;
			}
			if (flag) {
				this.top_card.items = this.card.items;
				this.top_card.n_items = this.card.n_items;
				this.deck.splice(0, 1);
				console.log(this.deck);
				socket.emit('update_castle', {'items': this.top_card.items});
				if (this.deck.length > 0) this.card = this.deck[0];
				else {
					this.card = null;
					this.finished = true;
					socket.emit('get_place');
				}
			}
		}
		else this.main_menu_btn.on_click(e);
	}
	on_castle_init(msg) { // initializes castle
		this.top_card = new TCard(this.Canvas, msg['top_card']['x'], msg['top_card']['y'], 150);
		this.top_card.items = [];
		this.top_card.n_items = msg['top_card']['n_items'];
		for (var i = 0; i < msg['top_card']['items'].length; i++) {
			this.top_card.items.push(new TItem(this.Canvas, msg['top_card']['items'][i]['number'], msg['top_card']['r'], 0, 0, msg['top_card']['items'][i]['scale'], msg['top_card']['items'][i]['rotation']))
		}
		console.log(this.top_card)
	}
	on_castle_updated(msg) { // updates castle
		var new_items = msg.items
		this.top_card = new TCard(this.Canvas, this.top_card.x, this.top_card.y, 150);
		this.top_card.items = [];
		this.top_card.n_items = new_items.length;
		for (var i = 0; i < this.top_card.n_items; i++) {
			this.top_card.items.push(new TItem(this.Canvas, new_items[i].number, this.top_card.r, 0, 0, new_items[i].scale, new_items[i]['rotation']))
		}
		this.children[0] = this.top_card;
	}
	on_get_place(msg) {
		this.place = msg['place'];
		this.finished = true;
		console.log(this.place)
	}
	main_menu_btn_click(){
		var FormMainScreen = new TFormMainScreen(Canvas);
		Application.set_form(FormMainScreen);
	}
}

class TCard {
	constructor(Canvas, x, y, r) {
		this.Canvas = Canvas;
		this.max_r = r;
		this.r = r;
		this.n_items = getRandomInt(8, 10);
		this.items = this.generate_items();
		this.items[this.n_items - 1].scale += 0.1;
		this.x = x; // %
		this.y = y; // в процентах
	}
	Show() {
		if (30 * Application.ScaleX < this.max_r) this.r = 30 * Application.ScaleX;
		this.Canvas.fillStyle = '#ffffff';
		this.Canvas.beginPath();
		this.Canvas.arc(this.x * Application.ScaleX, this.y * Application.ScaleY, this.r, 0, 2 * Math.PI);
		this.Canvas.fill();
		//var img1 = this.get_image_coords(20, 0, 0);
		//this.Canvas.drawImage(this.images, img1[0], img1[1], img1[2], img1[3], 0, 0, img1[2], img1[3]);

		/*this.Canvas.strokeStyle = '#ff0000';
		this.Canvas.beginPath();
		this.Canvas.arc(this.x * Application.ScaleX, this.y * Application.ScaleY, this.r * 0.7, 0, 2 * Math.PI);
		this.Canvas.stroke();*/

		for (var i = 0; i < this.n_items - 1; i++) {
			var xc = this.x * Application.ScaleX + Math.cos(2 * (i + 1) * Math.PI / (this.n_items - 1)) * this.r * 0.7;
			var yc = this.y * Application.ScaleY - Math.sin(2 * (i + 1) * Math.PI / (this.n_items - 1)) * this.r * 0.7;

			this.items[i].xc = xc;
			this.items[i].yc = yc;
			this.items[i].rc = this.r;
			this.items[i].Show();
		}
			this.items[this.n_items - 1].xc = this.x * Application.ScaleX;
			this.items[this.n_items - 1].yc = this.y * Application.ScaleY;
			this.items[this.n_items - 1].rc = this.r;
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
		if (x * x + y * y <= this.r * this.r) {
			for (var i of this.items) {
				var xi = this.x * Application.ScaleX - i.xc - x;
				var yi = this.y * Application.ScaleY - i.yc - y;
				if (xi * xi + yi * yi <= (i.rc * i.scale) * (i.rc * i.scale)) return i.number;
			}
		}
		return -1
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