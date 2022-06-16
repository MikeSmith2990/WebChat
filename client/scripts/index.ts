import { WebSocketHandler, WebSocketFactory } from "./websocket-handler";
import gameEngine from "./engine/game-engine";


let conn: Promise<WebSocketHandler> | null = null;

//login event
async function init (){
	(document.getElementById('usernameBtn') as HTMLButtonElement).addEventListener('click', (evt) => {
		const username = (document.getElementById('usernameInput') as HTMLInputElement).value
		// allow for only alphanumeric names with spaces
		if (!/^[A-Za-z0-9]*$/.test(username)) {
			console.log("Error in username!")
		}
		else {
			(document.getElementById('main-area') as HTMLElement).style.display = 'block';
			(document.getElementById('usernamePrompt') as HTMLElement).style.display = 'none';
			conn = WebSocketFactory.start(username)
		}
	})
}