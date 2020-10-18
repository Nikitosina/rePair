class TFormGameOver {
	constructor(Canvas) {
		this.Canvas = Canvas;
		this.PlayButton = document.getElementById("PlayButtonimg");
		this.ButtonWidth = 0;
		this.ButtonHeight = 0;
	}
	Show() {
		this.ButtonWidth = CanvasElement.width*0.4;
		this.ButtonHeight = this.PlayButton.height*this.ButtonWidth/this.PlayButton.width;
		this.Canvas.drawImage(this.PlayButton, CanvasElement.width/2-this.ButtonWidth/2, CanvasElement.height/2.5-this.ButtonHeight/2, this.ButtonWidth, this.ButtonHeight);
		this.Canvas.drawImage(MainMenuButtonimg, CanvasElement.width/2-this.ButtonWidth/2, CanvasElement.height/1.3-this.ButtonHeight/2, this.ButtonWidth, this.ButtonHeight);
		Application.print_with_the_font('game over', CanvasElement.width/5-10, CanvasElement.height/10, CanvasElement.width/125);
	}
	on_click(e) {
		if ((e.x >= CanvasElement.width/2-this.ButtonWidth/2) && (e.x <= CanvasElement.width/2+this.ButtonWidth/2) && (e.y >= CanvasElement.height/2.5-this.ButtonHeight/2) && (e.y <= CanvasElement.height/2.5+this.ButtonHeight/2)) {
			obj = [];
			Maps[map_now].restart();
			window.FormLoadingScreen = new TFormLoadingScreen(Canvas);
			Application.set_form(FormLoadingScreen);
			window.FormField = new TFormField(Canvas);
            socket.emit('join', {map: Maps[map_now], obj: [FormField.Tank]});
		}
		if ((e.x >= CanvasElement.width/2-this.ButtonWidth/2) && (e.x <= CanvasElement.width/2+this.ButtonWidth/2) && (e.y >= CanvasElement.height/1.3-this.ButtonHeight/2) && (e.y <= CanvasElement.height/1.3+this.ButtonHeight/2)) {
			obj = [];
			Maps[map_now].restart();
			Application.set_form(FormMainScreen);
		}
	}	
	on_key_down(e){
		if (e.keyCode == 13) {
			obj = [];
			window.map = Maps[map_now].map;
			window.FormField = new TFormField(Canvas);
			Application.set_form(FormField);
		}			
	}
}

var FormGameOver = new TFormGameOver(Canvas);