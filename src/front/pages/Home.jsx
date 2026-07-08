import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"

export const Home = () => {
    const { store, dispatch } = useGlobalReducer()

    const loadProducts = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product")
        const data = await response.json()
        if (response.ok) dispatch({ type: "set_products", payload: data })
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (
        <div style={{fontFamily: "Georgia, serif"}}>

            {/* Hero */}
            <div style={{
                background: "linear-gradient(rgba(10,10,10,0.65), rgba(10,10,10,0.65)), url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80') center/cover no-repeat",
                minHeight: "88vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "white",
                padding: "0 20px"
            }}>
                <p style={{color: "#C9A84C", letterSpacing: "5px", fontSize: "0.75rem", marginBottom: "16px", textTransform: "uppercase"}}>
                    Distribuidores de destilados mexicanos · Madrid
                </p>
                <h1 style={{fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: "300", letterSpacing: "6px", marginBottom: "20px", lineHeight: 1.1}}>
                    IN VINO VERITAS
                </h1>
                <p style={{fontSize: "1rem", opacity: "0.8", maxWidth: "480px", marginBottom: "40px", fontFamily: "sans-serif", fontWeight: "300", lineHeight: 1.8}}>
                    Mezcales, tequilas y destilados de autor seleccionados para los paladares más exigentes de España
                </p>
                <Link to="/catalog" style={{
                    backgroundColor: "transparent",
                    color: "#C9A84C",
                    border: "1px solid #C9A84C",
                    padding: "14px 48px",
                    letterSpacing: "3px",
                    fontSize: "0.75rem",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    transition: "all 0.3s"
                }}>
                    VER CATÁLOGO
                </Link>
            </div>

            {/* Franja dorada */}
            <div style={{backgroundColor: "#C9A84C", padding: "12px 0", textAlign: "center"}}>
                <p style={{margin: 0, fontSize: "0.8rem", letterSpacing: "3px", color: "#1a1a1a", fontFamily: "sans-serif"}}>
                    ENTREGA 24-48H EN PENÍNSULA IBÉRICA · ENVÍO GRATUITO +50€
                </p>
            </div>

            {/* Categorías */}
            <div style={{backgroundColor: "#fff", padding: "80px 0"}}>
                <div className="container">
                    <p style={{textAlign: "center", letterSpacing: "4px", fontSize: "0.7rem", color: "#C9A84C", marginBottom: "8px", fontFamily: "sans-serif"}}>EXPLORA</p>
                    <h2 style={{textAlign: "center", letterSpacing: "4px", fontSize: "1.6rem", fontWeight: "400", marginBottom: "50px"}}>NUESTRAS CATEGORÍAS</h2>
                    <div className="row g-3">
                        <div className="col-md-8">
                            <div style={{
                                background: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80') center/cover",
                                height: "420px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.3s"
                            }}>
                                <Link to="/catalog" style={{textDecoration: "none", textAlign: "center"}}>
                                    <p style={{color: "#C9A84C", letterSpacing: "3px", fontSize: "0.7rem", marginBottom: "10px", fontFamily: "sans-serif"}}>TEQUILAS · MEZCALES · SOTOLES</p>
                                    <h3 style={{color: "white", letterSpacing: "5px", fontSize: "2rem", fontWeight: "300"}}>BEBIDAS</h3>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div style={{
                                background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80') center/cover",
                                height: "420px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}>
                                <Link to="/catalog" style={{textDecoration: "none", textAlign: "center"}}>
                                    <p style={{color: "#C9A84C", letterSpacing: "3px", fontSize: "0.7rem", marginBottom: "10px", fontFamily: "sans-serif"}}>GORRAS · CAMISETAS · PINS</p>
                                    <h3 style={{color: "white", letterSpacing: "5px", fontSize: "2rem", fontWeight: "300"}}>MERCH</h3>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos destacados */}
            {store.products.length > 0 && (
                <div style={{backgroundColor: "#F7F5F0", padding: "80px 0"}}>
                    <div className="container">
                        <p style={{textAlign: "center", letterSpacing: "4px", fontSize: "0.7rem", color: "#C9A84C", marginBottom: "8px", fontFamily: "sans-serif"}}>SELECCIÓN</p>
                        <h2 style={{textAlign: "center", letterSpacing: "4px", fontSize: "1.6rem", fontWeight: "400", marginBottom: "50px"}}>PRODUCTOS DESTACADOS</h2>
                        <div className="row g-4">
                            {store.products.slice(0, 3).map((product) => (
                                <div key={product.id} className="col-md-4">
                                    <div style={{backgroundColor: "white", boxShadow: "0 2px 20px rgba(0,0,0,0.06)"}}>
                                        <img
                                            src={product.image_url || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80"}
                                            style={{width: "100%", height: "280px", objectFit: "cover"}}
                                        />
                                        <div style={{padding: "24px", textAlign: "center"}}>
                                            <h5 style={{fontWeight: "400", letterSpacing: "1px", marginBottom: "8px", fontSize: "1rem"}}>{product.name}</h5>
                                            <p style={{color: "#C9A84C", fontWeight: "600", marginBottom: "16px", fontFamily: "sans-serif"}}>€{product.price}</p>
                                            <Link to={`/product/${product.id}`} style={{
                                                backgroundColor: "#1a1a1a",
                                                color: "white",
                                                padding: "10px 28px",
                                                textDecoration: "none",
                                                fontSize: "0.75rem",
                                                letterSpacing: "2px",
                                                fontFamily: "sans-serif"
                                            }}>VER MÁS</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{textAlign: "center", marginTop: "48px"}}>
                            <Link to="/catalog" style={{
                                backgroundColor: "#C9A84C",
                                color: "white",
                                padding: "14px 48px",
                                textDecoration: "none",
                                fontSize: "0.75rem",
                                letterSpacing: "3px",
                                fontFamily: "sans-serif"
                            }}>VER TODO EL CATÁLOGO</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Info tienda */}
            <div style={{backgroundColor: "#fff", padding: "80px 0", borderTop: "1px solid #eee"}}>
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-4">
                            <p style={{fontSize: "1.5rem", marginBottom: "12px"}}>🚚</p>
                            <h6 style={{letterSpacing: "2px", fontSize: "0.8rem", marginBottom: "8px"}}>ENVÍO RÁPIDO</h6>
                            <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif"}}>Entrega 24-48h en Península</p>
                        </div>
                        <div className="col-md-4">
                            <p style={{fontSize: "1.5rem", marginBottom: "12px"}}>🍹</p>
                            <h6 style={{letterSpacing: "2px", fontSize: "0.8rem", marginBottom: "8px"}}>SELECCIÓN DE AUTOR</h6>
                            <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif"}}>Destilados mexicanos curados</p>
                        </div>
                        <div className="col-md-4">
                            <p style={{fontSize: "1.5rem", marginBottom: "12px"}}>📍</p>
                            <h6 style={{letterSpacing: "2px", fontSize: "0.8rem", marginBottom: "8px"}}>TIENDA EN MADRID</h6>
                            <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif"}}>Calle Medinaceli 12 · Mar-Sáb 12-21h</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{backgroundColor: "#1a1a1a", color: "white", padding: "48px 0"}}>
                <div className="container text-center">
                    <h5 style={{color: "#C9A84C", letterSpacing: "4px", fontWeight: "300", marginBottom: "16px"}}>IN VINO VERITAS</h5>
                    <p style={{opacity: "0.5", fontSize: "0.8rem", fontFamily: "sans-serif", marginBottom: "16px"}}>Distribuidores de destilados mexicanos · Madrid</p>
                    <p style={{opacity: "0.3", fontSize: "0.75rem", fontFamily: "sans-serif"}}>© 2026 In Vino Veritas · Todos los derechos reservados</p>
                </div>
            </div>

        </div>
    )
}