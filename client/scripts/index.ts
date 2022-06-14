import Settings from "./engine/settings";
import {EventEmitter} from 'eventemitter3'
import { WebSocketFactory } from "./websocket-handler";
import DrawQueue from "./engine/draw-queue";
import Camera from "./engine/camera";
import Keystates from "./engine/keystates";
import Canvas from './engine/canvas';

// export const settings = new Settings()
// export const emitter = new EventEmitter()
// export const drawQueue = new DrawQueue()
// export const canvas = new Canvas()
// export const camera = new Camera()
// export const keystates = new Keystates()


const conn = WebSocketFactory.start()

