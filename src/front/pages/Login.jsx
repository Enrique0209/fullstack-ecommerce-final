import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [error, setError] = useState("")


    const handleLogin = async () => {
        // aquí va la lógica
        if (!email.includes("@")) { setError("Email no tiene un formato válido"); return }
        if (password.length < 6) { setError("La contraseña debe tener mínimo 6 caracteres"); return }
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
    const data = await response.json()
    dispatch({ type: "set_user", payload: { user: data.user, token: data.token } })
    navigate("/catalog")
} else {
    setError("Email o contraseña incorrectos")
}

    }

    return (
        // aquí va el JSX
        <div>
            {error && <p style={{color: "red"}}>{error}</p>}
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