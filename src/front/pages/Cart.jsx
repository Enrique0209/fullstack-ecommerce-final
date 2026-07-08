import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { PayPalButtons } from "@paypal/react-paypal-js"

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
    <div style={{backgroundColor: "#F7F5F0", minHeight: "100vh"}}>
        {/* Header */}
        <div style={{backgroundColor: "#1a1a1a", padding: "60px 0", textAlign: "center"}}>
            <p style={{color: "#C9A84C", letterSpacing: "4px", fontSize: "0.7rem", fontFamily: "sans-serif", marginBottom: "8px"}}>TU SELECCIÓN</p>
            <h1 style={{color: "white", fontFamily: "Georgia, serif", fontWeight: "300", letterSpacing: "6px", fontSize: "2.5rem"}}>MI CARRITO</h1>
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
                        fontFamily: "sans-serif"
                    }}>VER CATÁLOGO</a>
                </div>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {store.cart.map((item) => {
                            const product = store.products.find(p => p.id === item.product_id)
                            return (
                                <div key={item.id} style={{
                                    backgroundColor: "white",
                                    boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
                                    marginBottom: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "20px 24px",
                                    gap: "20px"
                                }}>
                                    <img
                                        src={product?.image_url || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200&q=80"}
                                        style={{width: "80px", height: "80px", objectFit: "cover"}}
                                    />
                                    <div style={{flexGrow: 1}}>
                                        <h5 style={{fontFamily: "Georgia, serif", fontWeight: "400", fontSize: "1rem", marginBottom: "4px"}}>
                                            {product ? product.name : "Producto"}
                                        </h5>
                                        <p style={{color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif", marginBottom: "4px"}}>
                                            Cantidad: {item.quantity}
                                        </p>
                                        <p style={{color: "#C9A84C", fontWeight: "700", fontFamily: "sans-serif", margin: 0}}>
                                            €{product ? (product.price * item.quantity).toFixed(2) : ""}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "1px solid #ddd",
                                            color: "#888",
                                            padding: "6px 14px",
                                            fontSize: "0.75rem",
                                            fontFamily: "sans-serif",
                                            cursor: "pointer"
                                        }}>✕ ELIMINAR</button>
                                </div>
                            )
                        })}

                        {/* Total y PayPal */}
                        <div style={{
                            backgroundColor: "white",
                            boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
                            padding: "28px 24px",
                            marginTop: "8px"
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
                                        alert("¡Pago completado con éxito!")
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