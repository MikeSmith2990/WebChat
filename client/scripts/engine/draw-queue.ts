import Drawable from "./drawable"
import GameEngine from "./game-engine"
export default class DrawQueue{
    public drawables: Drawable[] = []
    constructor(gm: GameEngine){
		gm.emitter.on('renderObjects', this.processQueue.bind(this))
    }

    public processQueue(){
        this.drawables.sort((a, b) => a.zIndex - b.zIndex).forEach((d) => {
            d.draw()
        })
    }
}