import * as webSocket from 'ws'
import Message from '../../lib/message'

const wss = new webSocket.Server({ port: 7071 });
const clients = new Map();

wss.on('connection', (ws) => {
    const sessionID = uuidv4();
    console.log("connection made: " + sessionID)
    const color = Math.floor(Math.random() * 999999);
    const metadata = { sessionID, color, username : '', valid : false };

    clients.set(ws, metadata);

    ws.on('message', (data) => {
      const request: Message = JSON.parse(data.toString());

      console.log(request)
      const client = clients.get(ws);
      console.log(client.username)

      switch (request.command) {
        case 'validateUsername':
          // set the username server-side and reply to client with their sessionID to signal validity

          let responseParams = {};
          if(/^[A-Za-z0-9]*$/.test(request.params.username)){
            client.username = request.params.username
            client.valid = true;

            responseParams = {
              sessionID : client.sessionID,
              color: client.color,
              username: client.username,
            }
            console.log("username set to: " + client.username)

                //join message
            clients.forEach((client, ws) => {
              if(client.valid){
                const message = new Message()
                message.command = 'serverMessage'
                message.params = {text: "User Joined!"}
                ws.send(JSON.stringify(message));
              }
            });
          }
          else{
            client.username = '';

            responseParams = {
              sessionID : null,
              color: client.color,
              username: client.username,
            }
            console.log("Invalid username received")
          }

          const response = new Message()
          response.command = 'handleValidationMessage'
          response.params = responseParams
          ws.send(JSON.stringify({response}))
          

        case 'chatMessage':
          // relay chat message to all valid connected clients if client that sent was valid.
          if(!client.valid){
            return;
          }

          request.params.username = client.username
          request.params.color = client.color
          clients.forEach((client, ws) => {
            if(client.valid){
              ws.send(JSON.stringify(request));
            }
          });
      }

    });  

});

wss.on("close", (ws: any) => {
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