import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initCrazySdk } from '@/components/game/crazySdk'

// Initialise the CrazyGames SDK (no-op outside crazygames.com).
initCrazySdk()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)