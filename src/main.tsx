import 'bootstrap/dist/css/bootstrap.min.css?v=1'
import './assets/css/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const key = location.pathname.split('/')[3]



  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
  )
  
