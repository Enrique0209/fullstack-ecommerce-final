import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const loadCart = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
            headers: { "Authorization": "Bearer " + store.token }
        })
        if (response.ok) {
            const data = await response.json()
            dispatch({ type: "set_cart", payload: data })
        }
    }

    useEffect(() => {
        if (store.token) loadCart()
    }, [store.token])

    const cartCount = store.cart.reduce((sum, item) => sum + item.quantity, 0)

    const handleLogout = () => {
        setMenuOpen(false)
        dispatch({ type: "logout" })
        navigate("/login")
    }

    const closeMenu = () => setMenuOpen(false)

    return (
        <nav style={{
            backgroundColor: "#1a1a1a",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "65px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
        }}>
            <Link to="/" onClick={closeMenu} className="navbar-brand-text" style={{
                color: "white",
                textDecoration: "none",
                fontFamily: "Georgia, serif",
                letterSpacing: "3px",
                fontSize: "1rem",
                fontWeight: "400",
                whiteSpace: "nowrap"
            }}>
                Spirits Shop
            </Link>

            <button
                className="navbar-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "4px 8px"
                }}
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <div className={`navbar-links ${menuOpen ? "open" : ""}`} style={{display: "flex", alignItems: "center", gap: "32px"}}>
                <Link to="/catalog" onClick={closeMenu} style={{color: "white", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "2px", fontFamily: "sans-serif"}}>CATÁLOGO</Link>

                <Link to="/cart" onClick={closeMenu} style={{color: "white", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "2px", fontFamily: "sans-serif", position: "relative"}}>
                    🛒 CARRITO
                    {cartCount > 0 && (
                        <span style={{
                            backgroundColor: "#C9A84C",
                            color: "white",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.65rem",
                            marginLeft: "6px",
                            position: "relative",
                            top: "-1px"
                        }}>{cartCount}</span>
                    )}
                </Link>

                {store.token && (
                    <Link to="/profile" onClick={closeMenu} style={{color: "white", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "2px", fontFamily: "sans-serif"}}>PERFIL</Link>
                )}

                {store.token && store.user?.is_admin && (
                    <Link to="/admin" onClick={closeMenu} style={{
                        backgroundColor: "#8B0000",
                        color: "white",
                        textDecoration: "none",
                        padding: "7px 20px",
                        fontSize: "0.7rem",
                        letterSpacing: "2px",
                        fontFamily: "sans-serif",
                        borderRadius: "20px"
                    }}>ADMIN</Link>
                )}

                {store.token ? (
                    <>
                        <span style={{color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "1px", fontFamily: "sans-serif"}}>
                            HOLA, {store.user?.name?.toUpperCase()}
                        </span>
                        <button onClick={handleLogout} style={{
                            backgroundColor: "transparent",
                            color: "white",
                            border: "1px solid white",
                            padding: "7px 20px",
                            fontSize: "0.7rem",
                            letterSpacing: "2px",
                            fontFamily: "sans-serif",
                            cursor: "pointer",
                            borderRadius: "20px"
                        }}>CERRAR SESIÓN</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMenu} style={{
                            color: "#C9A84C",
                            textDecoration: "none",
                            border: "1px solid #C9A84C",
                            padding: "7px 20px",
                            fontSize: "0.7rem",
                            letterSpacing: "2px",
                            fontFamily: "sans-serif",
                            borderRadius: "20px"
                        }}>LOGIN</Link>
                        <Link to="/register" onClick={closeMenu} style={{
                            backgroundColor: "#C9A84C",
                            color: "white",
                            textDecoration: "none",
                            padding: "7px 20px",
                            fontSize: "0.7rem",
                            letterSpacing: "2px",
                            fontFamily: "sans-serif",
                            borderRadius: "20px"
                        }}>REGISTRO</Link>
                    </>
                )}
            </div>
        </nav>
    );
};