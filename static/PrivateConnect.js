class TFormPrivateConnect extends TControl {
	constructor(Canvas) {
		super();
		this.Canvas = Canvas;
		this.table_bg = document.getElementById("table_bgimg");

        this.create_btns();

		socket.on('error', this.on_error.bind(this));

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
    create_btns() {
        this.add_child(new TTextField(Canvas, 'Join room by codename:', 5, 5, 90, 10, '', 4))
        this.pw_circles = this.add_child(new TPasswordCircles(Canvas, 6, 24, 20, 60, 2, '#CA6505', '#CA6505'))
        this.home = this.add_child(new TButton(Canvas, 1, 1, 10, 8, "#CA6505", 'Home', undefined, 2));
        this.home.click = this.home_btn_click.bind(this)

        var x0 = 24;
        var y0 = 30;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var b = this.add_child(new TButton(this.Canvas, x0 + j * 18, y0 + i * 15, 15, 12, '#CA6505', i * 3 + j + 1));
                b.click = this.pw_circles.new_number.bind(this.pw_circles);
            }
        }
        this.paste_btn = this.add_child(new TButton(this.Canvas, x0 + 0 * 18, y0 + 3 * 15, 15, 12, '#CA6505', 'Paste', undefined, 4));
        this.paste_btn.click = this.pw_circles.paste.bind(this.pw_circles);
        this.zero = this.add_child(new TButton(this.Canvas, x0 + 1 * 18, y0 + 3 * 15, 15, 12, '#CA6505', 0));
        this.zero.click = this.pw_circles.new_number.bind(this.pw_circles);
        this.delete_btn = this.add_child(new TButton(this.Canvas, x0 + 2 * 18, y0 + 3 * 15, 15, 12, '#CA6505', 'Delete', undefined, 4));
        this.delete_btn.click = this.pw_circles.del_last.bind(this.pw_circles);
    }
    home_btn_click() {
		var FormMainScreen = new TFormMainScreen(Canvas);
		Application.set_form(FormMainScreen);
    }
    on_key_down(e) {
        for (var i = 0; i < this.children.length; i++) {
            if ((this.children[i] instanceof TButton) && (this.children[i].text == window.KEYCODES[e.keyCode])) this.children[i].click(e, this.children[i]);
        }
    }
    on_error(msg) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] instanceof TErrorField) this.children.splice(i, 1)
        }
        this.add_child(new TErrorField(this.Canvas, msg.error, 50, 1, 1, 2, '', 2))
        this.pw_circles.clear()
    }
}


class TPasswordCircle {
    constructor(Canvas, x, y, r, stroke_color='ffffff', fill_color='ffffff', number=-1) {
        this.Canvas = Canvas;
        this.x = x;
        this.y = y;
        this.r = r;
        this.stroke_color = stroke_color;
        this.fill_color = fill_color;
        this.number = number;
    }
    Show() {
        if (this.number == -1) {
            this.Canvas.strokeStyle = this.stroke_color;
            this.Canvas.lineWidth = 3;
            this.Canvas.beginPath();
	  	    this.Canvas.arc(this.x * Application.ScaleX, this.y * Application.ScaleY, this.r * Application.ScaleY, 0, 2 * Math.PI);
	  	    this.Canvas.stroke();
        } else {
            this.Canvas.fillStyle = this.fill_color;
            this.Canvas.beginPath();
	  	    this.Canvas.arc(this.x * Application.ScaleX, this.y * Application.ScaleY, this.r * Application.ScaleY, 0, 2 * Math.PI);
	  	    this.Canvas.fill();
        }
    }
}


class TPasswordCircles extends TControl {
    constructor(Canvas, n, x, y, w, r, stroke_color='ffffff', fill_color='ffffff') {
        super();
        this.Canvas = Canvas;
        this.n = n;
        this.x = x;
        this.y = y;
        this.w = w; // все в %
        this.r = r;
        this.stroke_color = stroke_color;
        this.fill_color = fill_color;
        this.pos = 0;
        this.circles = [];
        var indent = this.w / this.n;
        for (var i = 0; i < this.n; i++) {
            this.circles.push(new TPasswordCircle(this.Canvas, this.x + i * indent, this.y, this.r, this.stroke_color, this.fill_color))
        }
    }
    Show() {
        for (var i = 0; i < this.n; i++) {
            this.circles[i].Show()
        }
    }
    new_number(e, btn) {
        var new_n = btn.text;
        this.circles[this.pos].number = new_n;
        console.log(this.circles)
        if (this.pos + 1 == this.n) {
            this.pos += 1;
            socket.emit('get_private_room', {'codename': this.get_codename()});
        }
        else this.pos += 1;
    }
    del_last(e, btn) {
        if (this.pos > 0) {
            this.pos -= 1;
            this.circles[this.pos].number = -1;
            return true
        }
        return false
    }
    paste() {
        navigator.clipboard.readText()
            .then(codename => {
                if ((codename.length == 6) && (codename == parseInt(codename))) {
                    this.pos = 0
                    for (var i = 0; i < codename.length; i++) {
                        var btn_emit = {'text': codename[i]}
                        this.new_number(0, btn_emit)
                    }
                }
                else {this.parent.on_error({'error': 'Invalid codename'})}
            })
    }
    clear() {
        var flag = this.del_last();
        while (flag) flag = this.del_last();
    }
    get_codename() {
        var res = ''
        for (var i = 0; i < this.circles.length; i++) res += this.circles[i].number;
        return res
    }
}