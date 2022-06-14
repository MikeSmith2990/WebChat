export default class Canvas { 
    public readonly el = document.getElementById('game-canvas') as HTMLCanvasElement
    public readonly ctx = this.el.getContext('2d') as CanvasRenderingContext2D
    public readonly height = this.el.height
    public readonly width = this.el.width
}