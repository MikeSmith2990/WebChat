import Drawable from './drawable'
import GameEngine from './game-engine'

const tileSize = 25

class Player extends Drawable{
	public id = 1
	public height = 40
	public width = 15
	public fallSpeed = 0
	public jumpSpeed = 0
	public canJump = true
	public xForCamera = 0
	public yForCamera = 0
	public direction = 'right'
	public moveSpeed: number = 7

	constructor(
		public gm: GameEngine,
		public x: number,
		public y: number
	) {
		super(gm)
		this.zIndex = 2
		this.gm.camera.originX = x - this.gm.canvas.width / 2
		this.gm.camera.originY = y - this.gm.canvas.height / 2
	}

	draw() {
		//draw player
		this.gm.canvas.ctx.fillStyle = '#000000'
		this.gm.canvas.ctx.fillRect(this.xForCamera, this.y, this.width, this.height)
	}

	update() {
		//pre movement y
		var currentY = this.y
		//it is inescapable
		this.applyGravity()
		//if our y hasn't changed after applying gravity,
		//we are standing on ground and can jump
		this.canJump = currentY === this.y;

		//distance to move
		let delta = 0
		//move player based on input
		if (this.gm.keystates.RightArrowIsActive) {
			this.direction = 'right'
			delta = this.moveSpeed
		}
		if (this.gm.keystates.LeftArrowIsActive) {
			this.direction = 'left'
			delta = this.moveSpeed * -1
		}
		//move player
		if (delta) this.moveHorizontal(delta)

		//jump
		if (this.gm.keystates.SpaceIsActive && this.canJump) this.jump()

		//prevent the player from moving past the halfway point of the screen
		if (this.gm.level.offsetX === 0) {
			this.xForCamera = this.x
		}

		//log player stats to debugger
		this.gm.debug.playerXPosition = this.x
		this.gm.debug.playerYPosition = this.y
		this.gm.debug.direction = this.direction
	}

	moveHorizontal(delta: number) {
		//move right
		if (delta > 0) {
			for (let i = 1; i <= delta; i++) {
				this.x++
				if (!this.validatePosition(i)) {
					this.x--
					break
				}
				//set level offset to keep player centered on canvas
				if (this.x + (this.width / 2) > this.gm.canvas.width / 2) {
					this.gm.level.offsetX++
				}
			}
			//move left
		} else {
			for (let i = -1; i >= delta; i--) {
				this.x--
				if (!this.validatePosition(i)) {
					this.x++
					break
				}
				//set level offset to keep player centered on canvas
				if (this.gm.level.offsetX > 0) {
					this.gm.level.offsetX--
				}
			}
		}
	}

	jump() {
		if (this.jumpSpeed === 0) {
			this.jumpSpeed = 16;
		}
	}

	validatePosition(delta: number) {
		const player = this
		let positionIsValid = true
		//get all tiles player is occupying, check for collisions
		//col the player's left side is in
		const playerLeftAlignment = Math.floor(player.x / tileSize);
		//col the player's right side is in
		const playerRightAlignment = Math.floor((player.x + player.width) / tileSize);
		//row the player's top is in
		const playerTopAlignment = Math.floor(player.y / tileSize);
		//row the player's bottom is in
		//-1 prevents floor from stopping movement
		const playerBottomAlignment = Math.floor((player.y + player.height - 1) / tileSize);

		//iterate level data and see if any of the intersected tiles are solid
		positionIsValid = this.gm.level.tiles.filter(t =>
			(t.col === playerRightAlignment || t.col === playerLeftAlignment) &&
			(t.row === playerTopAlignment || t.row === playerBottomAlignment) &&
			t.isSolid
		).length === 0 &&
			player.x >= 0 && player.x <= this.gm.level.width * this.gm.level.tiles[0].w - player.width - 1

		//return validity of position
		return positionIsValid;
	}

	applyGravity() {
		//this will change as we fall
		//we need to know what it is at the start of the fall
		var floor = this.getFloor();
		var ceiling = this.getCeiling();
		//check if we need to fall
		if (this.jumpSpeed !== 0) {
			if ((this.y - this.jumpSpeed) <= ceiling) {
				this.jumpSpeed = 0;
				this.y = ceiling;
			} else {
				this.y -= this.jumpSpeed;
				//slow jump by 3 with min of 0
				this.jumpSpeed = (this.jumpSpeed - 3) > 0 ? this.jumpSpeed - 1 : 0;
			}
		} else if (this.y + this.height < floor) {
			//increase fall by 10 each frame up to 30 max
			this.fallSpeed = this.fallSpeed > 20 ? 20 : this.fallSpeed + 2;
			//fall with fallSpeed
			this.y += this.fallSpeed;
			//see if we will land on the floor next frame
			if (this.y + this.height + this.fallSpeed + 2 > floor) {
				this.y = floor - this.height;
				this.fallSpeed = 0;
			}
		} else {
			this.fallSpeed = 0;
		}
	}

	getFloor() {
		const player = this;
		let floorRow = this.gm.level.height;

		//tile the player's left side is in
		const playerLeftTileLocation = Math.floor(player.x / tileSize);
		//tile the player's right side is in
		const playerRightTileLocation = Math.floor((player.x + player.width) / tileSize);
		//tile the bottom of the player is in
		const playerYAlignment = Math.ceil((player.y + player.height) / tileSize);

		//get tiles under player
		const underTiles = this.gm.level.tiles.filter(t =>
			(t.col === playerRightTileLocation || t.col === playerLeftTileLocation)
			&& t.row === playerYAlignment
		)

		//find floor in tiles
		underTiles.forEach(t => {
			if (t.isSolid) {
				floorRow = t.row
			}
		})
		//convert floor row to px
		return ((floorRow) * tileSize);
	}

	getCeiling() {
		const player = this;
		let ceilingRow = 0;

		//tile the player's left side is in
		const playerLeftTileLocation = Math.floor(player.x / tileSize);
		//tile the player's right side is in
		const playerRightTileLocation = Math.floor((player.x + player.width) / tileSize);
		//tile the top of the player is in
		const playerYAlignment = Math.ceil((player.y) / tileSize);

		//get tiles above player
		const overTiles = this.gm.level.tiles.filter(t =>
			(t.col === playerRightTileLocation || t.col === playerLeftTileLocation)
			&& t.row < playerYAlignment - 1
		)

		//find floor in tiles
		overTiles.forEach(t => {
			if (t.isSolid) {
				ceilingRow = t.row
			}
		})
		//convert floor row to px
		return ((ceilingRow + 1) * tileSize);
	}
}

export default Player