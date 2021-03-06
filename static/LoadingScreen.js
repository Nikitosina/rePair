class TFormLoadingScreen extends TControl {
	constructor(Canvas, room) {
		super();
		this.Canvas = Canvas;
		this.player_count = 1;
		this.table_bg = document.getElementById("table_bgimg");
		this.room = room;
		console.log(this.room);

		this.add_child(new TTextField(Canvas, 'Waiting for players...', 50, 10, 1, 1, '', 9))
		this.player_count_label = this.add_child(new TTextField(Canvas, 'players ' + this.room.players.length + '/' + this.room.players_num, 50, 40, 1, 1, '', 7))
		if (this.room.private) {
			this.add_child(new TTextField(Canvas, 'Your room codename:', 5, 60, 90, 10, '', 6))
			this.copy_cn_btn = this.add_child(new TButton(Canvas, 30, 70, 40, 10, STYLES.btn, this.room.codename))
			this.copy_cn_btn.click = this.copy_codename.bind(this)
		}

		if ('$start' in socket._callbacks) {
			socket._callbacks['$start'] = []
			socket._callbacks['$new_player'] = []
		}
		socket.on('start', this.on_start.bind(this));
		socket.on('new_player', this.on_new_player.bind(this));

		/*var self = this;
		socket.on('new_player', function (msg) {
			self.player_count = msg;
		});*/
	}
	Show() {
		this.Canvas.drawImage(this.table_bg, 0, 0, CanvasElement.width, CanvasElement.height);
		// var map_coord = [];
		// map_coord.push([L + i * BS * (FormField.map[0].length+1), CanvasElement.height/1.4, BS * FormField.map[0].length, BS * FormField.map.length]);
		// Application.print_with_the_font('loading...', CanvasElement.width/7, CanvasElement.height/10, CanvasElement.width/125);
		// Application.print_with_the_font('players ' + this.room.players.length + '(' + this.room.players_num +  ')', CanvasElement.width/6, CanvasElement.height * 0.4, CanvasElement.width/175);
		
		super.Show()
	}
	on_new_player(msg) {
		console.log(msg);
		this.room.players.push(msg)
		this.player_count_label.change_text('players ' + this.room.players.length + '/' + this.room.players_num);
	}
	on_start(msg) {
		console.log('START');
		var FormCastleGame = new TFormCastleGame(Canvas, this.room);
		Application.set_form(FormCastleGame);
	}
	copy_codename() {
		var text = this.room.codename;
		const el = document.createElement('textarea');
  		el.value = text;
  		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}
	on_click(e) {
		super.on_click(e)
	}
	on_key_down(e) {}
}

/*socket.on('start', function(msg) {
    console.log('starting...');
    obj_update(msg);
    Maps[map_now].restart();
    Application.set_form(FormField);
});

socket.on('disconnect', function() {
	//alert('123')
});*/
