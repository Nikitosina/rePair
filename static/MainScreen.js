class TFormMainScreen extends TControl {
	constructor(Canvas){
		super();
		this.Canvas = Canvas;
		this.table_bg = document.getElementById("table_bgimg");
		this.create_room_btn = this.add_child(new TButton(Canvas, 5, 85, 90, 10, "#CA6505", 'Create Room'));
		this.create_room_btn.click = this.create_room_btn_click.bind(this);
		this.login_page_btn = this.add_child(new TButton(Canvas, 47, 5, 48, 10, "#CA6505", 'login'));
		this.login_page_btn.click = this.to_login_page.bind();
		this.box = this.add_child(new TBox(Canvas, 5, 20, 90, 60, '#824401'));
		this.refresh_btn = this.add_child(new TButton(Canvas, 5, 5, 40, 10, "#CA6505", 'Refresh'));
		this.refresh_btn.click = this.get_all_rooms.bind(this);
		socket.on('all_rooms', this.on_get_all_rooms.bind(this));
		socket.on('new_player', this.on_new_player.bind(this));
		socket.on('err', this.on_error.bind(this));
		this.get_all_rooms()
	}
	Show() {
		this.Canvas.drawImage(this.table_bg, 0, 0, CanvasElement.width, CanvasElement.height);
		super.Show();

		//Application.print_with_the_font('alpha v0.2', CanvasElement.width-CanvasElement.width/7, CanvasElement.height-CanvasElement.height/28, CanvasElement.width/700);
	}
	get_all_rooms() {
		socket.emit('get_all_rooms');
	}
	on_get_all_rooms(msg) {
		this.box.children = [];
		console.log(msg);
		//this.box = [];
        for (var i = 0; i < msg.length; i++) {
            var b = this.box.add_child(new TButton(this.Canvas, this.box.x + 2, this.box.y + (i * 10) + 2, this.box.width - 4, 8, '#CA6505', msg[i]['name']));
        	b.click = this.join_room_btn_click.bind(this);
        	b.json = msg[i]
        }
	}
	create_room_btn_click(e) {
		var FormCreateRoom = new TFormCreateRoom(Canvas);
		Application.set_form(FormCreateRoom);
	}
	join_room_btn_click(e, btn) {
		socket.emit('join', {'name': btn.json['name']});
	}
	on_new_player(msg) {
		console.log(msg);
		var FormLoadingScreen = new TFormLoadingScreen(Canvas, msg);
		Application.set_form(FormLoadingScreen);
	}
	on_error(msg) {
		console.log(msg);
		this.get_all_rooms();
	}
	to_login_page(msg) {
		var FormLoginPage = new TFormLoginPage(Canvas, msg);
		Application.set_form(FormLoginPage);
	}
	on_click(e) {
		super.on_click(e);
		if ((e.x >= 0) && (e.y >= 0) && (e.x <= 100) && (e.y <= 100)){
			this.get_all_rooms()
		}
		/*if ((e.x >= 0) && (e.y >= 0) && (e.x <= 100) && (e.y <= 100)){
			var FormLoadingScreen = new TFormLoadingScreen(Canvas);
		    Application.set_form(FormLoadingScreen);
			window.FormField = new TFormField(Canvas);
			//var n = {};
			//n.map = Maps[map_now];
			//n[FormField.Tank.name] = FormField.Tank;
            socket.emit('join', {map: Maps[map_now], obj: [FormField.Tank]});

			//obj = [];
			//Maps[map_now].restart();
			// window.map = Maps[map_now].map;
			//Application.set_form(FormField);

            //socket.on('connect', function() {
            //    console.log('connected!');
            //});
		}
		if (this.create_room_btn.is_inside(e.x, e.y)) {
			console.log(e.x, e.y);
		    //Application.set_form(FormLoadingScreen);
		}*/
	}
}

window.socket = io();

var FormMainScreen = new TFormMainScreen(Canvas);

Application.set_form(FormMainScreen);