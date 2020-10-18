class TFormLoginPage extends TControl {
    constructor(Canvas) {
        super();
        this.Canvas = Canvas;
        this.table_bg = document.getElementById("table_bgimg");
        this.create_room_btn = this.add_child(new TButton(Canvas, 5, 85, 90, 10, "#CA6505", 'Login'));
        this.login_field = this.add_child(new TTextField(Canvas, 5, 30, 90, 15, "#CA6505", '#A64500'));
    }
    Show() {
        this.Canvas.drawImage(this.table_bg, 0, 0, CanvasElement.width, CanvasElement.height);
        super.Show();
    }
}