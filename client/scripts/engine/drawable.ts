import GameEngine from "./game-engine"

export default class Drawable{
    public zIndex = 0
    constructor(public gm: GameEngine){
        this.gm.drawQueue.drawables.push(this)
        this.gm.emitter.on('updatePhysics', this.update.bind(this))
    }
    public draw(){}
    public update(){}
}