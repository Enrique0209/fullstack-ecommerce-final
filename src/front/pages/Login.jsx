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
    <div className="container d-flex justify-content-center align-items-center" style={{minHeight: "80vh"}}>
        <div className="card shadow p-5" style={{width: "400px", border: "none"}}>
            <h2 className="text-center mb-4" style={{fontFamily: "Georgia, serif", letterSpacing: "2px"}}>
                INICIAR SESIÓN
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
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
                onClick={handleLogin} 
                className="btn w-100 mb-3"
                style={{backgroundColor: "#C9A84C", color: "white", border: "none"}}>
                Iniciar sesión
            </button>
            <p className="text-center text-muted">
                ¿No tienes cuenta? <a href="/register" style={{color: "#C9A84C"}}>Regístrate</a>
            </p>
        </div>
    </div>
)
}