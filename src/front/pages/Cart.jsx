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
    <div className="container py-5">
        <h1 className="text-center mb-5" style={{fontFamily: "Georgia, serif", letterSpacing: "3px"}}>
            MI CARRITO
        </h1>
        {store.cart.length === 0 ? (
            <p className="text-center text-muted">Tu carrito está vacío</p>
        ) : (
            <div className="row justify-content-center">
                <div className="col-md-8">
                    {store.cart.map((item) => {
                        const product = store.products.find(p => p.id === item.product_id)
                        return (
                            <div key={item.id} className="card shadow mb-3" style={{border: "none"}}>
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 style={{fontFamily: "Georgia, serif"}}>{product ? product.name : "Producto"}</h5>
                                        <p className="text-muted mb-0">Cantidad: {item.quantity}</p>
                                        <p className="fw-bold mb-0" style={{color: "#C9A84C"}}>
                                            €{product ? product.price : ""}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="btn btn-outline-danger btn-sm">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )}
        {store.cart.length > 0 && (
    <div className="row justify-content-center mt-4">
        <div className="col-md-8">
            <div className="card shadow p-4" style={{border: "none"}}>
                <h4 style={{fontFamily: "Georgia, serif"}}>
                    Total: €{store.cart.reduce((sum, item) => {
                        const product = store.products.find(p => p.id === item.product_id)
                        return sum + (product ? product.price * item.quantity : 0)
                    }, 0).toFixed(2)}
                </h4>
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
)
}