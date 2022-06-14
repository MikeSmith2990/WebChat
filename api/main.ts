import * as webSocket from 'ws'
import Message from './message'

const wss = new webSocket.Server({ port: 7071 });
const clients = new Map();

wss.on('connection', (ws) => {
    const id = uuidv4();
    console.log("connection made: " + id)
    const color = Math.floor(Math.random() * 999999);
    const metadata = { id, color };

    clients.set(ws, metadata);

    ws.on('message', (messageAsString) => {
      const message: Message = JSON.parse(messageAsString);
      const metadata = clients.get(ws);
      
      message.sender = metadata.id;
      message.color = metadata.color;

      console.log(message);
      
      //echo user messages
      [...clients.keys()].forEach((client) => {
        client.send(JSON.stringify(message));
      });
    });  

    //join message
    [...clients.keys()].forEach((client) => {
      client.send(JSON.stringify({text: 'Someone joined!'}));
    });
});

wss.on("close", (ws) => {
  console.log("connection closed: " + ws.metadata.id)
  clients.delete(ws);
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log("wss up");