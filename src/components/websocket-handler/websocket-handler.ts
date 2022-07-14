import Message from "../../../lib/message"

const websocketAddress = 'ws://127.0.0.1:7071/ws'

export class WebSocketHandler{

    public ws: WebSocket | null = null
    private username: string = ''

    constructor () {
    }

    public async init(){
        console.log('Initializing websocket...')
        
        this.ws = await this.connectToServer()
        this.initHandlers(this.ws)

        console.log('init complete!')
    }

    private async connectToServer(): Promise<WebSocket> {
        console.log(`Attempting to connect to websocket via ${websocketAddress}...`)
        const ws = new WebSocket(websocketAddress)
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                if (ws.readyState === 1) {
                    clearInterval(timer)
                    resolve(ws)
                    console.log("Connected to websocket!")
                }
            }, 10)
        })
    }

    private initHandlers(ws: WebSocket): void{
        ws.onmessage = (webSocketMessage) => {
            console.log('message received')
            const message: Message = JSON.parse(webSocketMessage.data)
            const params = message.params

            switch (message.command) {
                case 'chatMessage':
                case 'serverMessage':
                    console.log('chat/server message received')
                    //add message to chat log
                    this.appendMessage(message)
                    break;
                case 'handleValidationMessage':
                    this.loginValidationReceived = true;
                    this.sessionID = params.sessionID;
                    break;
                default:
                    console.log('unknown command')
                    break;
            }
        }

        console.log('adding listener...');
        //button click
        (document.getElementById('btn') as HTMLButtonElement).addEventListener('click', (evt) => {
            this.sendMessage()
        })
        //enter key
        document.addEventListener('keyup', (evt) => {
            if(evt.keyCode == 13){
                this.sendMessage()
            }
        })
        console.log('listener added!')
    }

    private loginValidationReceived = false;
    private sessionID: string | null = null;
    // need to figure out what this returns. some kinda message? with the session ID?

    public async validateUsername(username: string): Promise<string | null>{
        // send username to server, await return message
        const param = { username };
        const message = {command: 'validateUsername', params: param}
        this.ws?.send(JSON.stringify(message));

        return new Promise((resolve) => {
            const timer = setInterval(() => {
                if (this.loginValidationReceived) {
                    clearInterval(timer);
                    resolve(this.sessionID)
                }
            }, 100)
        })
    }
    
    // Append incoming message to the chat window
    private appendMessage(message: Message): void{
        const messageBox = document.getElementById('messages') as HTMLElement
        const messageHTML = document.createElement('DIV')
        messageHTML.className = 'message'
        var username = ''
        if(message.params.color) {
            messageHTML.style.color = '#' + message.params.color    
        }
        else {
            messageHTML.style.color = '#000000' // server message is always black
        }
        if(message.params.username){
            username = message.params.username
        }
        else {
            username = 'SERVER'
        }
        messageHTML.innerText =
            `${new Date().toLocaleString().split(',')[1].trim()} ${username}: ${message.params.text}`
        messageBox.append(messageHTML)
    }

    //send message
    private sendMessage(): void{
        const param = { text: (document.getElementById('textInput') as HTMLInputElement).value, username: this.username }
        const message = {command: 'chatMessage', params: param}
        this.ws?.send(JSON.stringify(message));
        (document.getElementById('textInput') as HTMLInputElement).value = '';
        (document.getElementById('textInput') as HTMLInputElement).focus();
    }
}

export class WebSocketFactory{
    public async start(){
        const webSocketHandler = new WebSocketHandler();
        await webSocketHandler.init();
        return webSocketHandler;
    }
}



async function startedWebsocket() {
    const wsf = new WebSocketFactory();
    const ws = await wsf.start();
    return ws;
  }

export default startedWebsocket();