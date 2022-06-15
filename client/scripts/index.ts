import { WebSocketFactory } from "./websocket-handler";

const username = ''

const messanger = document.getElementById('messager') as HTMLElement
const userPrompt = document.getElementById('usernamePrompt') as HTMLElement

messanger.style.display = 'none';
userPrompt.style.display = 'block';

(document.getElementById('usernameBtn') as HTMLButtonElement).addEventListener('click', (evt) => {
    const username = (document.getElementById('usernameInput') as HTMLInputElement).value
    // allow for only alphanumeric names with spaces
    if(!/^[A-Za-z0-9]*$/.test(username))
    {
        console.log("Error in username!")
    }
    else
    {
        userPrompt.style.display = 'none'
        messanger.style.display = 'block'
        const conn = WebSocketFactory.start(username)
    }
})