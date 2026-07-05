import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const handleRegister = async () => {
        if (!name) { setError("El nombre es obligatorio"); return }
        if (!email.includes("@")) { setError("Email no tiene un formato válido"); return }
        if (password.length < 6) { setError("La contraseña debe tener mínimo 6 caracteres"); return }
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })

        if (response.ok) {
            navigate("/login")
        } else {
            console.error("Error al registrarse")
        }
    }



    return (
    <div>
        {error && <p style={{color: "red"}}>{error}</p>}
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
        />
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
        <button onClick={handleRegister}>Registrarse</button>
    </div>
)
}