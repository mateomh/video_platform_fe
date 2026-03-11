import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import { MessagesProvider } from "./components/context/MessagesContext";
import AppRoutes from './routes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessagesProvider>
          <AppRoutes />
        </MessagesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
