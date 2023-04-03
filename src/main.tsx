import 'bootstrap/dist/css/bootstrap.min.css?v=1'
import './assets/css/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const key = location.pathname.split('/')[3]



if(key !== 'APOIOCE986ZE7PVE5DAT01Z589FYRI'){
  location.href = '/unauthorized.'
} else {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
  )
  
}
