import {EventEmitter} from 'eventemitter3'
import Canvas from './engine/canvas'
import DrawQueue from "./engine/draw-queue";
import Camera from "./engine/camera";
import Keystates from "./engine/keystates";
import Debug from './engine/debug'
import Level from './engine/level'
import Player from './engine/player'


import { WebSocketFactory } from "./websocket-handler";


export const emitter = new EventEmitter()
export const drawQueue = new DrawQueue()
export const canvas = new Canvas()
export const camera = new Camera()
export const keystates = new Keystates()
export const debug = new Debug()
export const level = new Level(100,25)
export const player1 = new Player(level.playerStartX, level.playerStartY)


function initGame(){
	//register key listeners
	document.addEventListener("keydown", function(evt) {
		keystates.setKey(evt.keyCode, true)
	})
	document.addEventListener("keyup", function(evt) {
		keystates.setKey(evt.keyCode, false)
	})

	emitter.emit('updatePhysics')
	emitter.emit('renderObjects')

	//calc physics at 60fps
	var phyicsLoop = setInterval(function(){
		emitter.emit('updatePhysics')
	}, 16)

	//draw at 60 fps as well
	var renderLoop = setInterval(function(){
		emitter.emit('renderObjects')
	}, 16)
}

window.onload = function(){
	initGame()
    const conn = WebSocketFactory.start()
}


