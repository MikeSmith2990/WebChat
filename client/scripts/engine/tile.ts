import Drawable from './drawable'
import GameEngine from './game-engine'

class Tile extends Drawable {
	public readonly w = 25
	public readonly h = 25
  
	public x = this.col * this.w
	public y = this.row * this.h
  
	constructor(
		public gm: GameEngine,
		public col: number,
		public row: number,
		public isSolid: boolean
	) {  
		super(gm)
		this.zIndex = 1
		this.x = this.col * this.w
		this.y = this.row * this.h
	}

	update(){
	}

	draw(){
		//determine where to draw the tile
		const fallsShort = ((this.col + 1) * this.w) - this.gm.level.offsetX < 0
		if(!fallsShort){
			var thickness = 1
			this.gm.canvas.ctx.fillStyle = '#DDD'
			this.gm.canvas.ctx.fillRect(this.x - this.gm.level.offsetX - (thickness), this.y - (thickness), this.w + (thickness * 2), this.h + (thickness * 2))
			this.gm.canvas.ctx.fillStyle = this.isSolid ? '#aaa' : '#FFF'
			this.gm.canvas.ctx.fillRect(this.x - this.gm.level.offsetX, this.y, this.w, this.h)
		}
	}
}

export default Tile