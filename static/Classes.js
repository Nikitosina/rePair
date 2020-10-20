class TButton extends TControl {
    constructor(Canvas, x, y, width, height, fill_color='#000000', text='', groupIndex, font_size=6){
        super();
        this.Canvas = Canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill_color = fill_color;
        this.text = text;
        this.groupIndex = groupIndex;
        this.pressed = false;
        this.font_size = font_size;
    }
    Show(){
        this.Canvas.fillStyle=this.fill_color;
	  	this.Canvas.beginPath();
	  	this.Canvas.rect(this.x * Application.ScaleX, this.y * Application.ScaleY, this.width * Application.ScaleX, this.height * Application.ScaleY);
	  	this.Canvas.fill();

	  	this.Canvas.fillStyle = '#ffffff';
	  	this.Canvas.font = (this.font_size * Application.ScaleY).toString() + 'px Arial'; // 8 * Application.ScaleY
	  	this.Canvas.textAlign = 'center';
	  	this.Canvas.textBaseline = 'middle';
	  	this.Canvas.fillText(this.text, (this.x + this.width / 2) * Application.ScaleX, (this.y + this.height / 2) * Application.ScaleY);

        if (this.pressed) {
            this.Canvas.strokeStyle = '#ffffff';
            this.Canvas.lineWidth = 3;
            this.Canvas.beginPath();
	  	    this.Canvas.rect(this.x * Application.ScaleX, this.y * Application.ScaleY, this.width * Application.ScaleX, this.height * Application.ScaleY);
	  	    this.Canvas.stroke();
	  	    this.Canvas.lineWidth = 1;
        }
    }
    is_inside(pos_x, pos_y){
        if ((pos_x >= this.x * Application.ScaleX) && (pos_y >= this.y * Application.ScaleY) && (pos_x <= (this.x + this.width) * Application.ScaleX) && (pos_y <= (this.y + this.height) * Application.ScaleY))
            return true;
        return false;
    }
    on_mousemove(e){
		if (this.is_inside(e.x, e.y)) {
			this.fill_color = '#A55202';
		}
		else this.fill_color = '#CA6505';
	}
	on_click(e) {
        // console.log(this.is_inside(e.x, e.y), this);
        if (!this.is_inside(e.x, e.y)) return;
        if (this.groupIndex) {
            for (var c of this.parent.children) {
                if ((c.groupIndex) && (c.groupIndex == this.groupIndex)) if (c != this) {
                    c.pressed = false;
                }
            }
            this.pressed = true;
        }
        if ('click' in this) this.click(e, this);
    }
}

class TBox extends TControl{
    constructor(Canvas, x, y, width, height, fill_color='#000000'){
        super();
        this.Canvas = Canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill_color = fill_color;
        this.shiftY = 0;
    }
    Show() {
        this.Canvas.save();
        this.Canvas.fillStyle = this.fill_color;
        this.Canvas.beginPath();
        this.Canvas.rect(this.x * Application.ScaleX, this.y * Application.ScaleY, this.width * Application.ScaleX, this.height * Application.ScaleY);
        this.Canvas.fill();
        this.Canvas.clip();

        this.Canvas.fillStyle = '#ffffff';
        this.Canvas.font = (8 * Application.ScaleY).toString() + 'px Arial';
        this.Canvas.textAlign = 'left';
        this.Canvas.textBaseline = 'top';

        super.Show();

        this.Canvas.restore();
    }
    is_inside(pos_x, pos_y){
        if ((pos_x >= this.x * Application.ScaleX) && (pos_y >= this.y * Application.ScaleY) && (pos_x <= (this.x + this.width) * Application.ScaleX) && (pos_y <= (this.y + this.height) * Application.ScaleY))
            return true;
        return false
    }
    /*on_click(e) {
        if (this.is_inside(e.x, e.y)) {
			this.shiftY--;
		}
    }*/
}

class TTextField extends TControl {
    constructor(Canvas, text, x, y, width, height, rect_color='', font_size=8, font_color='#ffffff'){
        super();
        this.Canvas = Canvas;
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.font_size = font_size;
        this.font_color = font_color;
        this.rect_color = rect_color;
        this.border = 2
    }
    Show() {
        if (this.rect_color) {
            this.Canvas.fillStyle=this.rect_color;
	  	    this.Canvas.beginPath();
	  	    this.Canvas.rect(this.x * Application.ScaleX, this.y * Application.ScaleY, this.width * Application.ScaleX, this.height * Application.ScaleY);
            this.Canvas.fill();
        }
        
        this.Canvas.fillStyle = this.font_color;
	  	this.Canvas.font = (this.font_size * Application.ScaleY).toString() + 'px Arial';
	  	this.Canvas.textAlign = 'center';
	  	this.Canvas.textBaseline = 'middle';
	  	this.Canvas.fillText(this.text, (this.x + this.width / 2) * Application.ScaleX, (this.y + this.height / 2) * Application.ScaleY);
    }
    change_text(new_text) {
        this.text = new_text;
    }
}

class TErrorField extends TTextField {
    constructor(Canvas, text, x, y, width, height, rect_color='', font_size=8, font_color='#ff0000') {
        super(Canvas, text, x, y, width, height, rect_color, font_size, font_color);
    }
    Show() {
        super.Show()
    }
}