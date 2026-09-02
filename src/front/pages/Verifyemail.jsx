import React, { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"

export const VerifyEmail = () => {
    const { token } = useParams()
    const [status, setStatus] = useState("loading") // "loading" | "success" | "error"
    const [message, setMessage] = useState("")
    // Evita que React StrictMode (que monta los componentes dos veces en
    // desarrollo) dispare la verificación dos veces — el segundo intento
    // fallaría porque el token ya quedó marcado como usado en el primero.
    const alreadyCalled = useRef(false)

    useEffect(() => {
        if (alreadyCalled.current) return
        alreadyCalled.current = true

        const verifyToken = async () => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_BACKEND_URL + "/api/verify-email/" + token,
                    { method: "GET" }
                )
                const data = await response.json()

                if (response.ok) {
                    setStatus("success")
                    setMessage(data.message)
                } else {
                    setStatus("error")
                    setMessage(data.message)
                }
            } catch (err) {
                setStatus("error")
                setMessage("No se pudo conectar con el servidor")
            }
        }

        verifyToken()
    }, [token])

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow p-5 text-center" style={{ width: "420px", border: "none", borderRadius: "12px" }}>
                <h2 className="mb-4" style={{ fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
                    VERIFICACIÓN DE CORREO
                </h2>

                {status === "loading" && (
                    <p className="text-muted">Verificando tu correo...</p>
                )}

                {status === "success" && (
                    <>
                        <div className="alert alert-success" style={{ borderRadius: "8px" }}>
                            {message}
                        </div>
                        <Link
                            to="/login"
                            className="btn w-100 mt-2"
                            style={{ backgroundColor: "#C9A84C", color: "white", border: "none", borderRadius: "6px" }}
                        >
                            Iniciar sesión
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="alert alert-danger" style={{ borderRadius: "8px" }}>
                            {message}
                        </div>
                        <Link
                            to="/profile"
                            className="btn w-100 mt-2"
                            style={{ backgroundColor: "#1a1a1a", color: "white", border: "none", borderRadius: "6px" }}
                        >
                            Ir a mi perfil para reenviar el link
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}