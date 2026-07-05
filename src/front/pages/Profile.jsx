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
        <div>
            <h1>Mi Perfil</h1>
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
            <button onClick={handleUpdateProfile}>Actualizar Perfil</button>
            <button onClick={handleDeleteProfile}>Eliminar cuenta</button>
        </div>
    )
}