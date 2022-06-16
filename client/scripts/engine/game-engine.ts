import { EventEmitter } from 'eventemitter3'
import Canvas from './canvas'
import DrawQueue from "./draw-queue";
import Camera from "./camera";
import Keystates from "./keystates";
import Debug from './debug'
import Level from './level'
import Player from './player'

export default class GameEngine {
    public emitter: any
    public drawQueue: DrawQueue
    public canvas: Canvas
    public camera: Camera
    public keystates: Keystates
    public debug: Debug
    public level: Level
    public player1: Player
    constructor() {
        this.canvas = new Canvas()
        this.camera = new Camera()
        this.keystates = new Keystates()
        this.emitter = new EventEmitter()
        this.drawQueue = new DrawQueue(this)
        this.debug = new Debug(this)
        this.level = new Level(this, 300, 100)
        this.player1 = new Player(this, 300, 300)

    }
    public init() {
        //register key listeners 
        const gm = this
        document.addEventListener("keydown", function (evt) {
            gm.keystates.setKey(evt.keyCode, true)
        })
        document.addEventListener("keyup", function (evt) {
            gm.keystates.setKey(evt.keyCode, false)
        })

        this.emitter.emit('updatePhysics')
        this.emitter.emit('renderObjects')

        //calc physics at 60fps
        const phyicsLoop = setInterval(function () {
            this.emitter.emit('updatePhysics')
        }, 16)

        //draw at 60 fps as well
        const renderLoop = setInterval(function () {
            this.emitter.emit('renderObjects')
        }, 16)
    }
}


