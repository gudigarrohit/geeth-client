import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";  // ✅ important
import { SongProvider } from "./context/SongContext";
import { UserProvider } from './context/UserContext.jsx';
import "flowbite";


import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <SongProvider>      {/* 👈 wraps WHOLE app ONCE */}
          <App />
        </SongProvider>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)
