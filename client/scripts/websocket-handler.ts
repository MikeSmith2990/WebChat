import Message from "../../lib/message"
import User from "../../lib/user"

const websocketAddress = 'ws://127.0.0.1:7071/ws'

export class WebSocketHandler {

    public ws: WebSocket
    public user: User = new User()

    constructor() {
    }

    public async init(username) {

        console.log('Initializing websocket...')
        this.ws = await this.connectToServer()

        //handle incoming messages
        this.initHandlers()

        //send username, get id
        this.initProfile(username)

        console.log('Init complete!')
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

    private initHandlers(): void {
        this.ws.onmessage = (webSocketMessage) => {
            console.log('message received')
            return
            const message: Message = JSON.parse(webSocketMessage.data)
            const params = JSON.parse(message.params)

            switch (message.command) {
                case 'chatMessage':
                    console.log('chat message received')
                    //add message to chat log
                    const messageBox = document.getElementById('messages') as HTMLElement
                    const messageHTML = document.createElement('DIV')
                    messageHTML.className = 'message'
                    messageHTML.style.color = '#' + params.color
                    messageHTML.innerText =
                        `${new Date().toLocaleString().split(',')[1].trim()}
                         ${params.username}: ${params.text}`
                    messageBox.append(messageHTML)
                    break;
                case 'setUsername':
                    console.log('username set')
                    //set username
                    this.user.username = params.username
                    this.user.color = params.color
                    this.user.id = params.id
                    break;
                default:
                    console.log('unknown command')
                    break;
            }
        }

        console.log('Adding key and button listener...');
        //button click
        (document.getElementById('btn') as HTMLButtonElement).addEventListener('click', (evt) => {
            this.appendMessage()
        })
        //enter key
        document.addEventListener('keyup', (evt) => {
            if (evt.keyCode == 13) {
                this.appendMessage()
            }
        })
        console.log('Listeners added!')
    }

    private initProfile(username: string): void {
        const messageBody = { params: {username}, command: "setUsername" }
        this.ws.send(JSON.stringify(messageBody));
    }

    //send message
    private appendMessage(): void {
        const messageBody = { text: (document.getElementById('textInput') as HTMLInputElement).value }
        this.ws.send(JSON.stringify(messageBody));
        (document.getElementById('textInput') as HTMLInputElement).value = '';
        (document.getElementById('textInput') as HTMLInputElement).focus();
    }
}

export class WebSocketFactory {
    public static async start(username) {
        const webSocketHandler = new WebSocketHandler();
        webSocketHandler.init(username);
        return webSocketHandler;
    }
}