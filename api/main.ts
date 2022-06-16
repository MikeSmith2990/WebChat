import * as webSocket from 'ws'
import Message from '../lib/message'
import { uuidv4 } from './utils';

const wss = new webSocket.Server({ port: 7071 });
const clients = new Map();

wss.on('connection', (ws) => {
  const id = uuidv4();
  console.log("connection made: " + id)
  const color = Math.floor(Math.random() * 999999);
  const username = ''
  const metadata = { id, color, username };

  clients.set(ws, metadata);



  ws.on('message', (data) => {
    const request: Message = JSON.parse(data.toString());
    console.log(request);
    const client = clients.get(ws)
    console.log(client.username)

    switch (request.command) {
      case 'setUsername':
        client.username = request.params.username;
        const responseParams = {
          id: client.id,
          color: client.color,
          username: client.username,
        }
        const response = new Message();
        response.command = 'setUsername';
        response.params = JSON.stringify(responseParams);
        ws.send(JSON.stringify({ response }));
        break;
      case 'chatMessage':
        clients.forEach((client, ws) => {
          ws.send(JSON.stringify(request));
        });
        break;
    }
  });

  //join message
  clients.forEach((client, ws) => {
    ws.send(JSON.stringify({ text: 'Someone joined!' }));
  });
});

wss.on("close", (ws: any) => {
  console.log("connection closed: " + ws.metadata.id)
  clients.delete(ws);
});

console.log("Websocket server started on port 7071");