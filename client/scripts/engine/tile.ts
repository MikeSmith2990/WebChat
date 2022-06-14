import {emitter, canvas, level} from '../index' 
import Drawable from './drawable'

class Tile extends Drawable {
	public readonly w = 25
	public readonly h = 25
  
	public x = this.col * this.w
	public y = this.row * this.h
  
	constructor(
		public col: number,
		public row: number,
		public isSolid: boolean
	) {  
		super()
		this.zIndex = 1
		this.x = this.col * this.w
		this.y = this.row * this.h
	}

	update(){
	}

	draw(){
		//determine where to draw the tile
		const fallsShort = ((this.col + 1) * this.w) - level.offsetX < 0
		if(!fallsShort){
			var thickness = 1
			canvas.ctx.fillStyle = '#DDD'
			canvas.ctx.fillRect(this.x - level.offsetX - (thickness), this.y - (thickness), this.w + (thickness * 2), this.h + (thickness * 2))
			canvas.ctx.fillStyle = this.isSolid ? '#aaa' : '#FFF'
			canvas.ctx.fillRect(this.x - level.offsetX, this.y, this.w, this.h)
		}
	}
}

export default Tile