(async function () {
    console.log('init running...')
    const ws = await connectToServer()

    ws.onmessage = (webSocketMessage) => {
        console.log('message received')
        const messageBody = JSON.parse(webSocketMessage.data)
        //add message to chat log
        document.getElementById('messages').innerHTML = 
        document.getElementById('messages').innerHTML + 
        (`<div class='message' style="color: #${messageBody.color}">
            ${new Date().toLocaleString().split(',')[1].trim()}: ${messageBody.text}
        </div>`)
    }

    console.log('adding listener...')
    //button click
    document.getElementById('btn').addEventListener('click', (evt) => {
        appendMessage(messageBody)
    })
    //enter key
    document.addEventListener('keyup', (evt) => {
        if(evt.keyCode == 13){
            appendMessage(messageBody)
        }
    })
    console.log('listener added!')
    
    //send message
    function appendMessage(messageBody){
        messageBody = { text: document.getElementById('textInput').value }
        ws.send(JSON.stringify(messageBody))
        document.getElementById('textInput').value = ''
        document.getElementById('textInput').focus()
    }

    async function connectToServer() {
        console.log("attempting to connect to ws...")
        const ws = new WebSocket('ws://127.0.0.1:7071/ws')
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if (ws.readyState === 1) {
                    clearInterval(timer)
                    resolve(ws)
                    console.log("connected to ws!")
                }
            }, 10)
        })
    }
    console.log('init complete!')
})();