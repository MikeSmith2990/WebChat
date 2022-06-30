import {useState} from 'react'
import Login from './components/login';
import { WebSocketHandler } from './components/websocket-handler/websocket-handler';

export interface AppProps {
  ws: WebSocketHandler;
}

const App = (props: AppProps) => {
  const[username, setUsername] = useState('')
  
  const handleLogin = (u: string) => {
    setUsername(u)
    console.log(u)
  }
  
  // if username is not validated, render the login component
  if(username == '')
  {
    return (
      <Login handleLogin={handleLogin} ws={props.ws} />
    )
  }
  else{
    return(null); // chat render
  }
  
}

export default App