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
    <div className="container py-5">
        <h1 className="text-center mb-5" style={{fontFamily: "Georgia, serif", letterSpacing: "3px"}}>
            CATÁLOGO
        </h1>
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {store.products.map((product) => (
                <div key={product.id} className="col">
                    <div className="card h-100 shadow" style={{border: "none"}}>
                        <img 
    src={product.image_url || "https://placehold.co/300x200?text=Sin+imagen"} 
    className="card-img-top"
    style={{height: "200px", objectFit: "cover"}}
/>
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title" style={{fontFamily: "Georgia, serif"}}>
                                {product.name}
                            </h5>
                            <p className="card-text text-muted">{product.description}</p>
                            <p className="fw-bold mt-auto" style={{color: "#C9A84C", fontSize: "1.2rem"}}>
                                €{product.price}
                            </p>
                            <div className="d-flex gap-2 mt-2">
                                <Link to={`/product/${product.id}`} className="btn btn-outline-dark btn-sm flex-grow-1">
                                    Ver detalles
                                </Link>
                                <button 
                                    onClick={() => addToCart(product.id)} 
                                    className="btn btn-sm flex-grow-1"
                                    style={{backgroundColor: "#C9A84C", color: "white", border: "none"}}>
                                    + Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)
}