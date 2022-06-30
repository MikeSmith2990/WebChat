import { useState } from 'react';
import { WebSocketHandler } from '../websocket-handler/websocket-handler';
import './styles.css';

export interface LoginProps {
    handleLogin: (u: string) => void;
    ws: WebSocketHandler;
}

const Login = (props: LoginProps) => {
    const [username, setUsername] = useState('')

    const handleChange = (e: any) => {
        setUsername(e.target.value)
    }

    const validateUsername = (event: React.FormEvent) => {
        event.preventDefault()

        // validate our username here
        props.ws.validateUsername(username);

        // if we get back session ID and username back, go ahead adn set username
        // else, set error message

        //validate username via websocket
        //either accept the username, respond with cookie, and show login page
        //or do not return username, 

        
        // const user = 'foo'
        props.handleLogin(username)
    }

    return (
        <form id="loginForm" onSubmit={validateUsername}>
            <label id="usernameLabel" htmlFor='username'>Username</label>
            <input
                type="text"
                name="username"
                id="usernameInput"
                onChange={handleChange}
            />
            <button id="usernameBtn">Connect</button>
        </form>
    )
}
export default Login