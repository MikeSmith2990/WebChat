import { WebSocketFactory, WebSocketHandler } from "./websocket-handler";
import { LoginForm } from "./login";

const conn: Promise<WebSocketHandler> | null = null

//handle login
const loginForm = new LoginForm()
loginForm.initLogin(conn)