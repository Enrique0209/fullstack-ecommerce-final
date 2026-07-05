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
    <div className="container d-flex justify-content-center align-items-center" style={{minHeight: "80vh"}}>
        <div className="card shadow p-5" style={{width: "400px", border: "none"}}>
            <h2 className="text-center mb-4" style={{fontFamily: "Georgia, serif", letterSpacing: "2px"}}>
                REGISTRO
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                />
            </div>
            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email"
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                />
            </div>
            <button 
                onClick={handleRegister} 
                className="btn w-100 mb-3"
                style={{backgroundColor: "#C9A84C", color: "white", border: "none"}}>
                Registrarse
            </button>
            <p className="text-center text-muted">
                ¿Ya tienes cuenta? <a href="/login" style={{color: "#C9A84C"}}>Inicia sesión</a>
            </p>
        </div>
    </div>
)
}