import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

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

    return (
        <div>
            <h1>Catálogo</h1>
            {store.products.map((product) => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>€{product.price}</p>
                </div>
            ))}
        </div>
    )
}