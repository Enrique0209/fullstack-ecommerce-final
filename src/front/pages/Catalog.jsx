import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Link } from "react-router-dom"

export const Catalog = () => {
    const { store, dispatch } = useGlobalReducer()

    const loadProducts = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product")
        const data = await response.json()
        if (response.ok) dispatch({ type: "set_products", payload: data })
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const addToCart = async (product_id) => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.token
            },
            body: JSON.stringify({ product_id: product_id, quantity: 1 })
        })
        if (response.ok) {
            alert("Producto agregado al carrito")
        }
        return response.ok
    }

    return (
    <div style={{backgroundColor: "#F7F5F0", minHeight: "100vh"}}>
        {/* Header */}
        <div style={{backgroundColor: "#1a1a1a", padding: "60px 0", textAlign: "center"}}>
            <p style={{color: "#C9A84C", letterSpacing: "4px", fontSize: "0.7rem", fontFamily: "sans-serif", marginBottom: "8px"}}>NUESTRA SELECCIÓN</p>
            <h1 style={{color: "white", fontFamily: "Georgia, serif", fontWeight: "300", letterSpacing: "6px", fontSize: "2.5rem"}}>CATÁLOGO</h1>
        </div>

        {/* Grid de productos */}
        <div className="container py-5">
            {store.products.length === 0 ? (
                <p style={{textAlign: "center", color: "#888", fontFamily: "sans-serif", padding: "60px 0"}}>
                    El catálogo estará disponible pronto.
                </p>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {store.products.map((product) => (
                        <div key={product.id} className="col">
                            <div style={{backgroundColor: "white", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", height: "100%", display: "flex", flexDirection: "column"}}>
                                <img
                                    src={product.image_url || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80"}
                                    style={{width: "100%", height: "220px", objectFit: "cover"}}
                                />
                                <div style={{padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1}}>
                                    <h5 style={{fontFamily: "Georgia, serif", fontWeight: "400", fontSize: "1rem", marginBottom: "8px"}}>
                                        {product.name}
                                    </h5>
                                    <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif", flexGrow: 1, marginBottom: "16px"}}>
                                        {product.description}
                                    </p>
                                    <p style={{color: "#C9A84C", fontWeight: "700", fontSize: "1.2rem", fontFamily: "sans-serif", marginBottom: "16px"}}>
                                        €{product.price}
                                    </p>
                                    <div style={{display: "flex", gap: "8px"}}>
                                        <Link to={`/product/${product.id}`} style={{
                                            flex: 1,
                                            textAlign: "center",
                                            padding: "10px",
                                            border: "1px solid #1a1a1a",
                                            color: "#1a1a1a",
                                            textDecoration: "none",
                                            fontSize: "0.7rem",
                                            letterSpacing: "1px",
                                            fontFamily: "sans-serif"
                                        }}>VER MÁS</Link>
                                        <button
                                            onClick={() => addToCart(product.id)}
                                            style={{
                                                flex: 1,
                                                padding: "10px",
                                                backgroundColor: "#C9A84C",
                                                color: "white",
                                                border: "none",
                                                fontSize: "0.7rem",
                                                letterSpacing: "1px",
                                                fontFamily: "sans-serif",
                                                cursor: "pointer"
                                            }}>+ CARRITO</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
)
}