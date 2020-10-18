class TFormLoadingScreen {
	constructor(Canvas, room) {
		this.Canvas = Canvas;
		this.player_count = 1;
		this.table_bg = document.getElementById("table_bgimg");
		this.room = room;

		socket.on('start', this.on_start.bind(this));

		/*var self = this;
		socket.on('new_player', function (msg) {
			self.player_count = msg;
		});*/
	}
	Show() {
		this.Canvas.drawImage(this.table_bg, 0, 0, CanvasElement.width, CanvasElement.height);
		// var map_coord = [];
		// map_coord.push([L + i * BS * (FormField.map[0].length+1), CanvasElement.height/1.4, BS * FormField.map[0].length, BS * FormField.map.length]);
		Application.print_with_the_font('loading...', CanvasElement.width/7, CanvasElement.height/10, CanvasElement.width/125);
		Application.print_with_the_font('players ' + this.room.players.length + '(' + this.room.players_num +  ')', CanvasElement.width/6, CanvasElement.height * 0.4, CanvasElement.width/175);
	}
	on_start(msg) {
		console.log(msg);
		var FormCastleGame = new TFormCastleGame(Canvas, this.room);
		Application.set_form(FormCastleGame);
	}
	on_click(e) {}
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
