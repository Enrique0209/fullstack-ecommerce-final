import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { PayPalButtons } from "@paypal/react-paypal-js"

export const Cart = () => {
    const { store, dispatch } = useGlobalReducer()

    const loadCart = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
            headers: { "Authorization": "Bearer " + store.token }
        })
        if (response.ok) {
            const data = await response.json()
            dispatch({ type: "set_cart", payload: data })
        }
    }

    const loadProducts = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product")
        if (response.ok) {
            const data = await response.json()
            dispatch({ type: "set_products", payload: data })
        }
    }

    const removeFromCart = async (item_id) => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart/" + item_id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + store.token }
        })
        if (response.ok) loadCart()
    }

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(item.id)
            return
        }
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart/" + item.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.token
            },
            body: JSON.stringify({ quantity: newQuantity })
        })
        if (response.ok) loadCart()
    }

    const clearCartAfterPayment = async () => {
        for (const item of store.cart) {
            await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart/" + item.id, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + store.token }
            })
        }
        dispatch({ type: "set_cart", payload: [] })
    }

    useEffect(() => {
        loadCart()
        if (store.products.length === 0) loadProducts()
    }, [])

    return (
    <div style={{backgroundColor: "#F7F5F0", minHeight: "100vh"}}>
        <div style={{backgroundColor: "#1a1a1a", padding: "14px 0"}}>
    <div className="container d-flex justify-content-between align-items-center">
        <div style={{display: "flex", alignItems: "baseline", gap: "10px"}}>
            <h1 style={{color: "white", fontFamily: "Georgia, serif", fontWeight: "400", letterSpacing: "0.5px", fontSize: "1.1rem", margin: 0}}>Mi Carrito</h1>
            <span style={{color: "#C9A84C", letterSpacing: "2px", fontSize: "0.6rem", fontFamily: "sans-serif"}}>TU SELECCIÓN</span>
        </div>
        <p style={{color: "#666", fontFamily: "sans-serif", fontSize: "0.7rem", margin: 0}}>
            {store.cart.length} producto{store.cart.length !== 1 ? "s" : ""}
        </p>
    </div>
</div>

        <div className="container py-5">
            {store.cart.length === 0 ? (
                <div style={{textAlign: "center", padding: "80px 0"}}>
                    <p style={{color: "#888", fontFamily: "sans-serif", marginBottom: "24px"}}>Tu carrito está vacío</p>
                    <a href="/catalog" style={{
                        backgroundColor: "#C9A84C",
                        color: "white",
                        padding: "12px 36px",
                        textDecoration: "none",
                        fontSize: "0.75rem",
                        letterSpacing: "2px",
                        fontFamily: "sans-serif",
                        borderRadius: "6px"
                    }}>VER CATÁLOGO</a>
                </div>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {store.cart.map((item) => {
                            const product = store.products.find(p => p.id === item.product_id)
                            return (
                                <div key={item.id} className="cart-item-row" style={{
    backgroundColor: "white",
    boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    padding: "20px 24px",
    gap: "20px",
    borderRadius: "10px"
}}>
                                    <img
                                        src={product?.image_url || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200&q=80"}
                                        style={{width: "80px", height: "80px", objectFit: "contain", backgroundColor: "#F7F5F0", borderRadius: "8px", padding: "6px"}}
                                    />
                                    <div style={{flexGrow: 1}}>
                                        <h5 style={{fontFamily: "Georgia, serif", fontWeight: "400", fontSize: "1rem", marginBottom: "8px"}}>
                                            {product ? product.name : "Producto"}
                                        </h5>
                                        <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px"}}>
                                            <div style={{display: "flex", alignItems: "center", border: "1px solid #EDE9E0", borderRadius: "20px"}}>
                                                <button
                                                    onClick={() => updateQuantity(item, item.quantity - 1)}
                                                    style={{
                                                        width: "26px",
                                                        height: "26px",
                                                        border: "none",
                                                        backgroundColor: "transparent",
                                                        color: "#1a1a1a",
                                                        fontFamily: "sans-serif",
                                                        fontSize: "0.9rem",
                                                        cursor: "pointer"
                                                    }}>−</button>
                                                <span style={{
                                                    minWidth: "24px",
                                                    textAlign: "center",
                                                    fontFamily: "sans-serif",
                                                    fontSize: "0.85rem"
                                                }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item, item.quantity + 1)}
                                                    style={{
                                                        width: "26px",
                                                        height: "26px",
                                                        border: "none",
                                                        backgroundColor: "transparent",
                                                        color: "#1a1a1a",
                                                        fontFamily: "sans-serif",
                                                        fontSize: "0.9rem",
                                                        cursor: "pointer"
                                                    }}>+</button>
                                            </div>
                                        </div>
                                        <p style={{color: "#C9A84C", fontWeight: "700", fontFamily: "sans-serif", margin: 0}}>
                                            €{product ? (product.price * item.quantity).toFixed(2) : "0.00"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "1px solid #ddd",
                                            borderRadius: "20px",
                                            color: "#888",
                                            padding: "6px 14px",
                                            fontSize: "0.75rem",
                                            fontFamily: "sans-serif",
                                            cursor: "pointer"
                                        }}>✕ ELIMINAR</button>
                                </div>
                            )
                        })}

                        <div style={{
                            backgroundColor: "white",
                            boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
                            padding: "28px 24px",
                            marginTop: "8px",
                            borderRadius: "10px"
                        }}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"}}>
                                <span style={{fontFamily: "Georgia, serif", fontSize: "1.1rem"}}>TOTAL</span>
                                <span style={{color: "#C9A84C", fontWeight: "700", fontSize: "1.4rem", fontFamily: "sans-serif"}}>
                                    €{store.cart.reduce((sum, item) => {
                                        const product = store.products.find(p => p.id === item.product_id)
                                        return sum + (product ? product.price * item.quantity : 0)
                                    }, 0).toFixed(2)}
                                </span>
                            </div>
                            <PayPalButtons
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{
                                            amount: {
                                                value: store.cart.reduce((sum, item) => {
                                                    const product = store.products.find(p => p.id === item.product_id)
                                                    return sum + (product ? product.price * item.quantity : 0)
                                                }, 0).toFixed(2)
                                            }
                                        }]
                                    })
                                }}
                                        onApprove={(data, actions) => {
                                            return actions.order.capture().then(() => {
                                                alert("¡Pago completado con éxito! Revisa la consola (F12) para ver el order_id.")
                                                clearCartAfterPayment()
                                            })
                                        }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
)
}