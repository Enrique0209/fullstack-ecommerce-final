import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Main = () => {
    if(!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
            <BackendURL/>
        </React.StrictMode>
    );
    return (
        <React.StrictMode>
            <PayPalScriptProvider options={{ clientId: "AcAI8VsHwh2jDr99dlmdoe7AovOro5oQZZOt2auJjexyB2ViBBLfFNmyQevh0nNMavTw9HwXzmuHzq4S", currency: "EUR" }}>
                <StoreProvider>
                    <RouterProvider router={router}>
                    </RouterProvider>
                </StoreProvider>
            </PayPalScriptProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
