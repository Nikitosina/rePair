class TControl {
    constructor() {
        this.children = [];
        this.parent;
        this.x = 0;
        this.y = 0;
    }
    Show() {
    	for (var c of this.children) c.Show();
	}
    add_child(child) {
        this.children.push(child);
        child.parent = this;
        return child;
    }
    del_child(child) {
    	for (var i = 0; i < this.children.length; i++) {
    		if (this.children[i] == child) this.children.splice(i, 1);
		}
	}
    on_click(e) {
    	for (var c of this.children) if (('on_click' in c)) c.on_click(e);
	}
	on_mousemove(e) {
    	for (var c of this.children) if (('on_mousemove' in c)) c.on_mousemove(e);
	}
	is_inside(pos_x, pos_y){
    	return true;
    }
    abs_pos() {
    	var res = [this.x, this.y];
    	if (this.parent) {
    		var p = this.parent.abs_pos();
    		res[0] += p[0];
			res[1] += p[1];
		}
    	return res;
	}
}

class TApplication {
	constructor() {
		this.curForm = null;
		this.font = document.getElementById("Fontimg");
		this.ScaleX = 1;
		this.ScaleY = 1;
		this.mode = 'horizontal';
		//this.Show = function() {};
		//this.keydown = function() {};
	}
	set_form(form) {
		//this.Show = form.Show;
		//this.keydown = form.keydown;
		this.curForm = form;
	}
	Show() {
		if ((CanvasElement.width != window.innerWidth) || (CanvasElement.height != window.innerHeight)) {
			CanvasElement.width = window.innerWidth;
			CanvasElement.height = window.innerHeight;
			Canvas.imageSmoothingEnabled = false;
		}
		this.ScaleX = CanvasElement.width / 100;
		this.ScaleY = CanvasElement.height / 100;
		this.curForm.Show();
	}
	on_key_down(e) {
		if ('on_key_down' in this.curForm) this.curForm.on_key_down(e);
	}
	on_click(e) {
		if ('on_click' in this.curForm) this.curForm.on_click(e);
	}
	on_mousemove(e) {
		if ('on_mousemove' in this.curForm) this.curForm.on_mousemove(e);
	}
	on_touch_end(e) {
		alert('a');
	}
	print_with_the_font(str, x, y, scale, align='right') {
		var s = '1234567890abcdefghijklmnopqrstuvwxyz!?().';
		var xpos = 4;
		var ypos = 4;
		var symb_width = 6; //in font png!
		var symb_height = 10;
		var next_symb_x = 10;
		var next_symb_y = 14;
		if (align == 'left') x = CanvasElement.width - str.length * (symb_width * scale) - ((str.length - 1) * ((next_symb_x * scale) - (symb_width * scale)));
		for (var i = 0; i < str.length; i++) {
			var n = s.indexOf(str[i]);
			Canvas.drawImage(this.font, xpos+next_symb_x*(n%10), ypos+next_symb_y*(Math.floor(n/10)), symb_width, symb_height, (x+(i*(next_symb_x*scale))), y, symb_width*scale, symb_height*scale);
		}
	}
}

window.Application = new TApplication;

window.CanvasElement = document.getElementById("canvas");
window.Canvas = CanvasElement.getContext('2d');

window.Sounds = {};
window.KEYCODES = {'48': 0, '49': 1, '50': 2, '51': 3, '52': 4, '53': 5, '54': 6, '55': 7, '56': 8, '57': 9}

window.isMobile = {
    Android: function() {return navigator.userAgent.match(/Android/i);},
    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
    Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
    Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
    any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};
//console.log(isMobile.any());

CanvasElement.addEventListener("touchstart", function(e) {e.preventDefault()}, false);
window.addEventListener("keydown", function(e) {Application.on_key_down(e);}, false);
window.addEventListener("click", function(e) {Application.on_click(e);}, false);
window.addEventListener("mousemove", function(e) {Application.on_mousemove(e);}, false);
window.addEventListener("touchend", function(e) {
	e.x = e.pageX;
	e.y = e.pageY;
	Application.on_click(e);
}, false);

var timer = setInterval(function() {
	Application.Show();
}, 50);


socket.on('disconnect', () => {
	console.log('disconnect')
});