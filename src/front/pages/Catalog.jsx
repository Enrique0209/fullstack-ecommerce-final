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
        <div>
            <h1>Catálogo</h1>
            {store.products.map((product) => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>€{product.price}</p>
                    <Link to={`/product/${product.id}`}>Ver detalles</Link>
                    <button onClick={() => addToCart(product.id)}>Agregar al carrito</button>
                </div>
            ))}
        </div>
    )
}