import { WebSocketFactory, WebSocketHandler } from "./websocket-handler"

export class LoginForm{
    public MessangerEl: HTMLElement
    public UserNameBtnEl: HTMLButtonElement
    public LoginFormEl: HTMLFormElement
    public initLogin(conn: Promise<WebSocketHandler> | null){
        //get elements
         this.MessangerEl = document.getElementById('messager') as HTMLElement
         this.UserNameBtnEl = document.getElementById('usernameBtn') as HTMLButtonElement
         this.LoginFormEl = document.getElementById('loginForm') as HTMLFormElement
        if(!this.UserNameBtnEl) return

        //hide messages, show form
        this.MessangerEl.style.display = 'none'
        this.LoginFormEl.style.display = 'block'

        //bind to events
        this.UserNameBtnEl.addEventListener('click', (evt) => this.submitForm(evt, conn))
        this.LoginFormEl.addEventListener('submit', (evt) => this.submitForm(evt, conn))
    }

    private submitForm(evt: MouseEvent | SubmitEvent, conn: Promise<WebSocketHandler> | null){
        evt.preventDefault()
        const username = (document.getElementById('usernameInput') as HTMLInputElement).value


        // allow for only alphanumeric names with spaces
        if(!/^[A-Za-z0-9]*$/.test(username))
        {
            console.log("Error in username!")
        }
        else
        {
            this.LoginFormEl.style.display = 'none'
            this.MessangerEl.style.display = 'block'
            conn = WebSocketFactory.start(username)
        }
    }
}