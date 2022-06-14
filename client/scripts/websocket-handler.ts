const websocketAddress = 'ws://127.0.0.1:7071/ws'

export default class WebSocketHandler{

    public ws: WebSocket
    private username: string

    constructor () {
    }

    public async init(username){
        console.log('Initializing websocket...')
        this.username = username
        this.ws = await this.connectToServer()
        this.initHandlers(this.ws)

        //send username
        const messageBody = { username: this.username, command: "setUsername"}
        this.ws.send(JSON.stringify(messageBody));

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
            const messageBody = JSON.parse(webSocketMessage.data)

            //add message to chat log
            const messageBox = document.getElementById('messages') as HTMLElement
            const message = document.createElement('DIV')
            message.className = 'message'
            message.style.color = '#' + messageBody.color
            message.innerText = new Date().toLocaleString().split(',')[1].trim() + " " + messageBody.username + ": " + messageBody.text
            messageBox.append(message)
        }

        console.log('adding listener...')
        //button click
        document.getElementById('btn').addEventListener('click', (evt) => {
            this.appendMessage()
        })
        //enter key
        document.addEventListener('keyup', (evt) => {
            if(evt.keyCode == 13){
                this.appendMessage()
            }
        })
        console.log('listener added!')
    }
    
    //send message
    private appendMessage(): void{
        const messageBody = { text: (document.getElementById('textInput') as HTMLInputElement).value }
        this.ws.send(JSON.stringify(messageBody));
        (document.getElementById('textInput') as HTMLInputElement).value = '';
        document.getElementById('textInput').focus();
    }
}

export class WebSocketFactory{
    public static async start(username){
        const webSocketHandler = new WebSocketHandler();
        webSocketHandler.init(username);
        return webSocketHandler;
    }
}