import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import wsPromise from './components/websocket-handler/websocket-handler';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

async function startRendering () {
  const ws = await wsPromise;
  root.render(
  <React.StrictMode>
    <App ws = {ws}/>
  </React.StrictMode>
);
}

startRendering();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
