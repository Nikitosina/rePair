function default_map(n) {
	maps = [[
           	   [0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0],
               [0,2,2,0,1,1,2,2,2,2,1,1,0,2,2,0],
               [0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
               [0,2,0,0,0,0,1,0,0,1,0,0,0,0,2,0],
               [0,0,0,1,0,1,1,1,1,1,1,0,1,0,0,0],
               [0,2,0,0,0,0,1,0,0,1,0,0,0,0,2,0],
               [0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0],
               [0,2,2,0,1,1,2,2,2,2,1,1,0,2,2,0],
               [0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0]],

			   [
           	   [0,0,0,0,0,2,2,0,0,0,0,0,2,0,0,0],
               [0,0,0,0,0,0,2,0,0,2,0,0,2,2,0,0],
               [0,0,0,2,0,0,0,0,2,2,0,0,0,0,0,0],
               [0,0,2,2,0,0,0,0,0,0,0,2,2,0,0,0],
               [0,0,0,0,0,0,2,0,0,2,0,2,0,0,0,0],
               [0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0],
               [0,0,2,0,0,0,0,2,0,0,2,2,0,2,2,0],
               [0,2,2,0,0,0,0,2,2,0,0,0,0,2,0,0]],

               [
           	   [0,0,0,2,0,0,0,3,3,0,0,0,2,0,0,0],
               [0,2,2,2,0,0,0,3,3,0,0,0,2,2,2,0],
               [0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0],
               [0,0,0,2,0,0,3,0,0,3,0,0,2,0,0,0],
               [0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0],
               [0,0,0,2,0,0,3,0,0,3,0,0,2,0,0,0],
               [0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0],
               [0,2,2,2,0,0,0,3,3,0,0,0,2,2,2,0],
           	   [0,0,0,2,0,0,0,3,3,0,0,0,2,0,0,0]]
              ];

	return maps[n]
}

class TMap {
	constructor(Canvas, map_num, spawnpoints) {
		this.Canvas = Canvas;
		this.map_num = map_num;
		this.imgs = [roadimg, wall1img, wall2img, wall3img];
		this.spawnpoints = spawnpoints;
		this.restart();
	}
	Show(x, y, BlockSize) {
		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				this.Canvas.drawImage(this.imgs[this.map[i][j][0]], j*BlockSize+x, i*BlockSize+y, BlockSize, BlockSize)
			}
		}
	}
	hit(x, y) {
		if (this.map[y][x][0] > 0) this.map[y][x][0]--;
	}
	restart() {
		this.map = default_map(this.map_num);
		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				this.map[i][j] = [this.map[i][j]];
			}
		}
	}
}

window.Maps = [];
Maps.push(new TMap(Canvas, 0, [[0, 4, 'R', 'RED'], [15, 4, 'L', 'BLUE']]));
Maps.push(new TMap(Canvas, 1, [[0, 4, 'R', 'RED'], [15, 4, 'L', 'BLUE'], [7, 0, 'D', 'GREEN']]));
Maps.push(new TMap(Canvas, 2, [[0, 4, 'R', 'RED'], [15, 4, 'L', 'BLUE']]));
