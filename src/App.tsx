import {useState} from 'react'
import Login from './compontents/login';

const App = () => {
  const[username, setUsername] = useState('')
  
  const handleLogin = (u: string) => {
    setUsername(u)
    console.log(u)
  }
  
  return (
    <Login handleLogin={handleLogin} />
  )
}

export default App