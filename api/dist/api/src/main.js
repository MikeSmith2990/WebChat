"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webSocket = __importStar(require("ws"));
const message_1 = __importDefault(require("../../lib/message"));
const wss = new webSocket.Server({ port: 7071 });
const clients = new Map();
wss.on('connection', (ws) => {
    const sessionID = uuidv4();
    console.log("connection made: " + sessionID);
    const color = Math.floor(Math.random() * 999999);
    const metadata = { sessionID, color, username: '', valid: false };
    clients.set(ws, metadata);
    ws.on('message', (data) => {
        const request = JSON.parse(data.toString());
        console.log(request);
        const client = clients.get(ws);
        console.log(client.username);
        switch (request.command) {
            case 'validateUsername':
                // set the username server-side and reply to client with their sessionID to signal validity
                let responseParams = {};
                if (/^[A-Za-z0-9]*$/.test(request.params.username)) {
                    client.username = request.params.username;
                    client.valid = true;
                    responseParams = {
                        sessionID: client.sessionID,
                        color: client.color,
                        username: client.username,
                    };
                    console.log("username set to: " + client.username);
                    //join message
                    clients.forEach((client, ws) => {
                        if (client.valid) {
                            const message = new message_1.default();
                            message.command = 'serverMessage';
                            message.params = { text: "User Joined!" };
                            ws.send(JSON.stringify(message));
                        }
                    });
                }
                else {
                    client.username = '';
                    responseParams = {
                        sessionID: null,
                        color: client.color,
                        username: client.username,
                    };
                    console.log("Invalid username received");
                }
                const response = new message_1.default();
                response.command = 'handleValidationMessage';
                response.params = responseParams;
                ws.send(JSON.stringify({ response }));
            case 'chatMessage':
                // relay chat message to all valid connected clients if client that sent was valid.
                if (!client.valid) {
                    return;
                }
                request.params.username = client.username;
                request.params.color = client.color;
                clients.forEach((client, ws) => {
                    if (client.valid) {
                        ws.send(JSON.stringify(request));
                    }
                });
        }
    });
});
wss.on("close", (ws) => {
    console.log("connection closed: " + ws.metadata.id);
    clients.delete(ws);
});
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
console.log("wss up");
