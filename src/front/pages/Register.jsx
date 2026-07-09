import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/

    const handleRegister = async () => {
        setError("")

        if (!name.trim()) { setError("El nombre es obligatorio"); return }
        if (!emailRegex.test(email)) { setError("Ingresa un email válido (ej: nombre@dominio.com)"); return }
        if (!passwordRegex.test(password)) {
            setError("La contraseña debe tener mínimo 6 caracteres, con al menos una letra y un número")
            return
        }
        if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return }

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            if (response.ok) {
                navigate("/login")
            } else {
                const data = await response.json()
                setError(data.message || "Error al registrarse")
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor")
        }
    }

    return (
    <div className="container d-flex justify-content-center align-items-center" style={{minHeight: "80vh"}}>
        <div className="card shadow p-5" style={{width: "400px", border: "none", borderRadius: "12px"}}>
            <h2 className="text-center mb-4" style={{fontFamily: "Georgia, serif", letterSpacing: "2px"}}>
                REGISTRO
            </h2>
            {error && <div className="alert alert-danger" style={{borderRadius: "8px"}}>{error}</div>}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control app-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    style={{borderRadius: "6px"}}
                />
            </div>
            <div className="mb-3">
                <input
                    type="email"
                    className="form-control app-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email"
                    style={{borderRadius: "6px"}}
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control app-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    style={{borderRadius: "6px"}}
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control app-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    style={{borderRadius: "6px"}}
                />
            </div>
            <button 
                onClick={handleRegister} 
                className="btn w-100 mb-3"
                style={{backgroundColor: "#C9A84C", color: "white", border: "none", borderRadius: "6px"}}>
                Registrarse
            </button>
            <p className="text-center text-muted">
                ¿Ya tienes cuenta? <a href="/login" style={{color: "#C9A84C"}}>Inicia sesión</a>
            </p>
        </div>
    </div>
)
}