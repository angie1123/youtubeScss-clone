import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import "./_base.scss"
// import { Provider } from 'react-redux'
// import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <App />
  </StrictMode>,
)
