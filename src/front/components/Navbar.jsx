import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch({ type: "logout" })
        navigate("/login")
    }

    return (
        <nav style={{
            backgroundColor: "#1a1a1a",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "65px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
        }}>
            <Link to="/" style={{
                color: "white",
                textDecoration: "none",
                fontFamily: "Georgia, serif",
                letterSpacing: "3px",
                fontSize: "1rem",
                fontWeight: "400"
            }}>
                Spirits Shop
            </Link>

            <div style={{display: "flex", alignItems: "center", gap: "32px"}}>
                <Link to="/catalog" style={{color: "white", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "2px", fontFamily: "sans-serif"}}>CATÁLOGO</Link>
                <Link to="/cart" style={{color: "white", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "2px", fontFamily: "sans-serif"}}>🛒 CARRITO</Link>

                {store.token && (
                    <Link to="/profile" style={{color: "white", textDecoration: "none", fontSize: "0.75rem", letterSpacing: "2px", fontFamily: "sans-serif"}}>PERFIL</Link>
                )}

                {store.token && store.user?.is_admin && (
                    <Link to="/admin" style={{
                        backgroundColor: "#8B0000",
                        color: "white",
                        textDecoration: "none",
                        padding: "7px 20px",
                        fontSize: "0.7rem",
                        letterSpacing: "2px",
                        fontFamily: "sans-serif"
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
                            cursor: "pointer"
                        }}>CERRAR SESIÓN</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{
                            color: "#C9A84C",
                            textDecoration: "none",
                            border: "1px solid #C9A84C",
                            padding: "7px 20px",
                            fontSize: "0.7rem",
                            letterSpacing: "2px",
                            fontFamily: "sans-serif"
                        }}>LOGIN</Link>
                        <Link to="/register" style={{
                            backgroundColor: "#C9A84C",
                            color: "white",
                            textDecoration: "none",
                            padding: "7px 20px",
                            fontSize: "0.7rem",
                            letterSpacing: "2px",
                            fontFamily: "sans-serif"
                        }}>REGISTRO</Link>
                    </>
                )}
            </div>
        </nav>
    );
};