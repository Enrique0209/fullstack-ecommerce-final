import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Cart = () => {
    const { store, dispatch } = useGlobalReducer()

    const loadCart = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
            headers: {
                "Authorization": "Bearer " + store.token
            }
        })
        if (response.ok) {
            const data = await response.json()
            dispatch({ type: "set_cart", payload: data })
        }
    }

    const removeFromCart = async (item_id) => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart/" + item_id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + store.token
            }
        })
        if (response.ok) loadCart()
    }

    useEffect(() => {
        loadCart()
    }, [])

    return (
        <div>
            <h1>Mi Carrito</h1>
            {store.cart.map((item) => {
                const product = store.products.find(p => p.id === item.product_id)
                return (
                    <div key={item.id}>
                        <p>{product ? product.name : "Producto"}</p>
                        <p>Cantidad: {item.quantity}</p>
                        <p>€{product ? product.price : ""}</p>
                        <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                    </div>
                )
            })}
        </div>
    )
}