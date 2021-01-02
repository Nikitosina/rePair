class TAnimations {
    constructor() {
        this.in_progress = true;

    }
}


class TBGAnimation extends TAnimations {
    constructor(Canvas, n_circles, r) {
        super();
        this.Canvas = Canvas;
        this.n_circles = n_circles;
        this.r = r;
    }
    Show() {
        this.Canvas.fillStyle = STYLES.cn_circle
        this.Canvas.fillRect(0, 0, 100 * Application.ScaleX, 100 * Application.ScaleY)
    }
}
