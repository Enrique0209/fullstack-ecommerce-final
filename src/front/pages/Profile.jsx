import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Profile = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        if (!store.token) {
            navigate("/login")
        } else {
            loadProfile()
        }
    }, [store.token])

    const loadProfile = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
            headers: { "Authorization": "Bearer " + store.token }
        })
        if (response.ok) {
            const data = await response.json()
            setName(data.name)
            setEmail(data.email)
        }
    }

    const handleUpdateProfile = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.token
            },
            body: JSON.stringify({ name, email })
        })
        if (response.ok) alert("Perfil actualizado")
    }

    const handleDeleteProfile = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + store.token }
        })
        if (response.ok) {
            dispatch({ type: "set_user", payload: { user: null, token: null } })
            navigate("/login")
        }
    }

    return (
    <div className="container d-flex justify-content-center align-items-center" style={{minHeight: "80vh"}}>
        <div className="card shadow p-5" style={{width: "450px", border: "none"}}>
            <h2 className="text-center mb-4" style={{fontFamily: "Georgia, serif", letterSpacing: "2px"}}>
                MI PERFIL
            </h2>
            <div className="mb-3">
                <label className="form-label text-muted">Nombre</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="form-label text-muted">Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button 
                onClick={handleUpdateProfile}
                className="btn w-100 mb-3"
                style={{backgroundColor: "#C9A84C", color: "white", border: "none"}}>
                Guardar cambios
            </button>
            <hr/>
            <button 
                onClick={handleDeleteProfile}
                className="btn btn-outline-danger w-100">
                Eliminar cuenta
            </button>
        </div>
    </div>
)
}