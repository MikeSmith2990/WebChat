import { useState } from 'react';
import './styles.css';

export interface LoginProps {
    handleLogin: (u: string) => void;
}

const Login = (props: LoginProps) => {
    const [username, setUsername] = useState('')

    const handleChange = (e: any) => {
        setUsername(e.target.value)
    }

    const validateUsername = (event: React.FormEvent) => {
        event.preventDefault()
        //validate username via api
        //either accept the username, respond with cookie, and show login page
        //or display error, allow form resubmit

        
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