import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    const handleLogin = async () => {
        // aquí va la lógica
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            const data = await response.json()
            dispatch({
                type: "set_user",
                payload: { user: data.user, token: data.token },
            })
            navigate("/catalog")
        } else {
            // Manejar error de inicio de sesión
            console.error("Error al iniciar sesión")
        }

    }

    return (
        // aquí va el JSX
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
            />
            <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
    )
}