import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppProvider } from './AppContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import MsgList from './components/MsgList.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <MsgList />
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
