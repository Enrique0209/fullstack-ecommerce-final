import React from "react"
import { Link } from "react-router-dom"

export const Home = () => {
    return (
        <div style={{fontFamily: "Georgia, serif"}}>

            {/* Hero */}
            <div style={{
                background: "linear-gradient(rgba(10,10,10,0.55), rgba(10,10,10,0.65)), url('https://images.unsplash.com/photo-1706888135824-20ec9010b7bc?fm=jpg&q=70&w=1800&auto=format&fit=crop') center/cover no-repeat",
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "white",
                padding: "0 20px"
            }}>
                <p style={{color: "#C9A84C", letterSpacing: "5px", fontSize: "0.75rem", marginBottom: "16px", textTransform: "uppercase", fontFamily: "sans-serif"}}>
                    Distribuidores de destilados mexicanos · Madrid
                </p>
                <h1 style={{fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: "300", letterSpacing: "6px", marginBottom: "20px", lineHeight: 1.1}}>
                    SPIRITS SHOP
                </h1>
                <p style={{fontSize: "1rem", opacity: "0.85", maxWidth: "480px", marginBottom: "40px", fontFamily: "sans-serif", fontWeight: "300", lineHeight: 1.8}}>
                    Tequilas, mezcales y destilados de agave seleccionados para los paladares más exigentes de España
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
                    fontFamily: "sans-serif",
                    borderRadius: "6px"
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

            {/* Bienvenida */}
            <div style={{backgroundColor: "#fff", padding: "80px 0"}}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 text-center">
                            <p style={{letterSpacing: "4px", fontSize: "0.7rem", color: "#C9A84C", marginBottom: "8px", fontFamily: "sans-serif"}}>BIENVENIDOS</p>
                            <h2 style={{letterSpacing: "1px", fontSize: "1.7rem", fontWeight: "400", marginBottom: "24px"}}>Una selección con raíz</h2>
                            <p style={{color: "#666", fontFamily: "sans-serif", fontSize: "0.95rem", lineHeight: "1.9", fontWeight: "300"}}>
                                Somos una distribuidora especializada en destilados mexicanos, con foco en el agave y sus expresiones más auténticas. Desde 2012 llevamos a España tequilas, mezcales y otros destilados de agricultores y maestros destiladores, cuidando cada botella desde el origen hasta tu mesa.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info tienda */}
            <div style={{backgroundColor: "#F7F5F0", padding: "80px 0"}}>
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-4">
                            <p style={{fontSize: "1.5rem", marginBottom: "12px"}}>🚚</p>
                            <h6 style={{letterSpacing: "2px", fontSize: "0.8rem", marginBottom: "8px"}}>ENVÍO RÁPIDO</h6>
                            <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif"}}>Entrega 24-48h en Península</p>
                        </div>
                        <div className="col-md-4">
                            <p style={{fontSize: "1.5rem", marginBottom: "12px"}}>🌵</p>
                            <h6 style={{letterSpacing: "2px", fontSize: "0.8rem", marginBottom: "8px"}}>SELECCIÓN DE AUTOR</h6>
                            <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif"}}>Destilados mexicanos</p>
                        </div>
                        <div className="col-md-4">
                            <p style={{fontSize: "1.5rem", marginBottom: "12px"}}>📍</p>
                            <h6 style={{letterSpacing: "2px", fontSize: "0.8rem", marginBottom: "8px"}}>TIENDA EN MADRID</h6>
                            <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif"}}>Calle Medinaceli 12 · Barrio de las Letras · Mar-Sáb 12-21h</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA final */}
            <div style={{backgroundColor: "#fff", padding: "70px 0", textAlign: "center", borderTop: "1px solid #eee"}}>
                <Link to="/catalog" style={{
                    backgroundColor: "#C9A84C",
                    color: "white",
                    padding: "14px 48px",
                    textDecoration: "none",
                    fontSize: "0.75rem",
                    letterSpacing: "3px",
                    fontFamily: "sans-serif",
                    borderRadius: "6px"
                }}>VER CATÁLOGO COMPLETO</Link>
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