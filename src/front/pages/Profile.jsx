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
        const confirmed = window.confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")
        if (!confirmed) return

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + store.token }
        })
        if (response.ok) {
            dispatch({ type: "logout" })
            navigate("/login")
        }
    }

    return (
    <div style={{backgroundColor: "#F7F5F0", minHeight: "100vh"}}>
        {/* Membrete compacto */}
        <div style={{backgroundColor: "#1a1a1a", padding: "14px 0"}}>
            <div className="container d-flex justify-content-between align-items-center">
                <div style={{display: "flex", alignItems: "baseline", gap: "10px"}}>
                    <h1 style={{color: "white", fontFamily: "Georgia, serif", fontWeight: "400", letterSpacing: "0.5px", fontSize: "1.1rem", margin: 0}}>Mi Perfil</h1>
                    <span style={{color: "#C9A84C", letterSpacing: "2px", fontSize: "0.6rem", fontFamily: "sans-serif"}}>TU CUENTA</span>
                </div>
            </div>
        </div>

        <div style={{display: "flex", justifyContent: "center", padding: "60px 20px"}}>
            <div style={{
                backgroundColor: "white",
                boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
                padding: "48px",
                width: "100%",
                maxWidth: "480px",
                borderRadius: "12px"
            }}>
                <div style={{marginBottom: "24px"}}>
                    <label style={{display: "block", fontSize: "0.7rem", letterSpacing: "2px", fontFamily: "sans-serif", color: "#888", marginBottom: "8px"}}>NOMBRE</label>
                    <input
                        type="text"
                        className="app-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 0",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                            outline: "none",
                            fontFamily: "Georgia, serif",
                            fontSize: "1rem",
                            backgroundColor: "transparent"
                        }}
                    />
                </div>
                <div style={{marginBottom: "40px"}}>
                    <label style={{display: "block", fontSize: "0.7rem", letterSpacing: "2px", fontFamily: "sans-serif", color: "#888", marginBottom: "8px"}}>EMAIL</label>
                    <input
                        type="email"
                        className="app-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 0",
                            border: "none",
                            borderBottom: "1px solid #ddd",
                            outline: "none",
                            fontFamily: "Georgia, serif",
                            fontSize: "1rem",
                            backgroundColor: "transparent"
                        }}
                    />
                </div>
                <button
                    onClick={handleUpdateProfile}
                    style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "#C9A84C",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        letterSpacing: "3px",
                        fontFamily: "sans-serif",
                        cursor: "pointer",
                        marginBottom: "16px"
                    }}>GUARDAR CAMBIOS</button>

                <div style={{borderTop: "1px solid #eee", paddingTop: "24px", marginTop: "8px"}}>
                    <button
                        onClick={handleDeleteProfile}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "transparent",
                            color: "#cc0000",
                            border: "1px solid #cc0000",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            letterSpacing: "2px",
                            fontFamily: "sans-serif",
                            cursor: "pointer"
                        }}>ELIMINAR CUENTA</button>
                </div>
            </div>
        </div>
    </div>
)
}