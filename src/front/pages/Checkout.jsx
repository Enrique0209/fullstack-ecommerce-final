import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PayPalButtons } from "@paypal/react-paypal-js"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { getCartHeaders } from "../cartAuth"

export const Checkout = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [processing, setProcessing] = useState(false)

    const [form, setForm] = useState({
        guest_name: "",
        guest_email: "",
        shipping_address: "",
        shipping_address2: "",
        shipping_postal_code: "",
        shipping_city: "",
        shipping_province: "",
        shipping_phone: "",
        billing_same_as_shipping: true,
        billing_address: "",
        billing_postal_code: "",
        billing_city: "",
        billing_province: "",
        billing_cif: "",
        billing_name: "",
    })

    useEffect(() => {
        if (store.cart.length === 0) navigate("/cart")
    }, [])

    const cartTotal = store.cart.reduce((sum, item) => {
        const product = store.products.find(p => p.id === item.product_id)
        return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    const handleChange = (field) => (e) => {
        const value = field === "billing_same_as_shipping" ? e.target.checked : e.target.value
        setForm({ ...form, [field]: value })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const isFormValid = () => {
        if (!store.user) {
            if (!form.guest_name.trim()) return false
            if (!emailRegex.test(form.guest_email)) return false
        }
        if (!form.shipping_address.trim()) return false
        if (!form.shipping_postal_code.trim()) return false
        if (!form.shipping_city.trim()) return false
        if (!form.shipping_province.trim()) return false
        if (!form.shipping_phone.trim()) return false

        if (!form.billing_same_as_shipping) {
            if (!form.billing_address.trim()) return false
            if (!form.billing_postal_code.trim()) return false
            if (!form.billing_city.trim()) return false
            if (!form.billing_province.trim()) return false
            if (!form.billing_name.trim()) return false
        }
        return true
    }

    const handleApprove = async (paypal_order_id) => {
        setProcessing(true)
        setError("")
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/order", {
                method: "POST",
                headers: getCartHeaders(store, { "Content-Type": "application/json" }),
                body: JSON.stringify({ ...form, paypal_order_id }),
            })
            const data = await response.json()

            if (response.ok) {
                dispatch({ type: "set_cart", payload: [] })
                navigate("/catalog", { state: { orderConfirmed: true, orderId: data.order.id } })
            } else {
                // El pago ya se capturó en PayPal en este punto — un error acá
                // significa que algo no cuadró en la verificación del backend
                // (stock, monto, o pago duplicado). No hay reembolso automático,
                // por eso el mensaje pide contactar soporte en vez de solo reintentar.
                setError(data.message || "No se pudo registrar el pedido. Contacta con soporte, tu pago ya fue procesado.")
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor. Contacta con soporte, tu pago ya fue procesado.")
        } finally {
            setProcessing(false)
        }
    }

    return (
    <div style={{backgroundColor: "#F7F5F0", minHeight: "100vh"}}>
        <div style={{backgroundColor: "#1a1a1a", padding: "14px 0"}}>
            <div className="container">
                <h1 style={{color: "white", fontFamily: "Georgia, serif", fontWeight: "400", fontSize: "1.1rem", margin: 0}}>
                    Finalizar compra
                </h1>
            </div>
        </div>

        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-7">
                    {error && <div className="alert alert-danger" style={{borderRadius: "8px"}}>{error}</div>}

                    {!store.user && (
                        <div style={{backgroundColor: "white", padding: "24px", borderRadius: "10px", marginBottom: "16px"}}>
                            <h5 style={{fontFamily: "Georgia, serif", marginBottom: "16px"}}>Tus datos</h5>
                            <input className="form-control app-input mb-2" placeholder="Nombre completo *"
                                value={form.guest_name} onChange={handleChange("guest_name")}
                                style={{borderRadius: "6px"}} />
                            <input className="form-control app-input" type="email" placeholder="Email *"
                                value={form.guest_email} onChange={handleChange("guest_email")}
                                style={{borderRadius: "6px"}} />
                        </div>
                    )}

                    <div style={{backgroundColor: "white", padding: "24px", borderRadius: "10px", marginBottom: "16px"}}>
                        <h5 style={{fontFamily: "Georgia, serif", marginBottom: "16px"}}>Dirección de entrega</h5>
                        <input className="form-control app-input mb-2" placeholder="Dirección *"
                            value={form.shipping_address} onChange={handleChange("shipping_address")}
                            style={{borderRadius: "6px"}} />
                        <input className="form-control app-input mb-2" placeholder="Piso, puerta (opcional)"
                            value={form.shipping_address2} onChange={handleChange("shipping_address2")}
                            style={{borderRadius: "6px"}} />
                        <div className="row g-2 mb-2">
                            <div className="col-6">
                                <input className="form-control app-input" placeholder="Código postal *"
                                    value={form.shipping_postal_code} onChange={handleChange("shipping_postal_code")}
                                    style={{borderRadius: "6px"}} />
                            </div>
                            <div className="col-6">
                                <input className="form-control app-input" placeholder="Ciudad *"
                                    value={form.shipping_city} onChange={handleChange("shipping_city")}
                                    style={{borderRadius: "6px"}} />
                            </div>
                        </div>
                        <input className="form-control app-input mb-2" placeholder="Provincia *"
                            value={form.shipping_province} onChange={handleChange("shipping_province")}
                            style={{borderRadius: "6px"}} />
                        <input className="form-control app-input" placeholder="Teléfono *"
                            value={form.shipping_phone} onChange={handleChange("shipping_phone")}
                            style={{borderRadius: "6px"}} />
                    </div>

                    <div style={{backgroundColor: "white", padding: "24px", borderRadius: "10px", marginBottom: "16px"}}>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" id="billingSame"
                                checked={form.billing_same_as_shipping}
                                onChange={handleChange("billing_same_as_shipping")} />
                            <label className="form-check-label" htmlFor="billingSame">
                                Facturación igual que la entrega
                            </label>
                        </div>

                        {!form.billing_same_as_shipping && (
                            <>
                                <input className="form-control app-input mb-2" placeholder="Nombre / Razón social *"
                                    value={form.billing_name} onChange={handleChange("billing_name")}
                                    style={{borderRadius: "6px"}} />
                                <input className="form-control app-input mb-2" placeholder="CIF (opcional)"
                                    value={form.billing_cif} onChange={handleChange("billing_cif")}
                                    style={{borderRadius: "6px"}} />
                                <input className="form-control app-input mb-2" placeholder="Dirección de facturación *"
                                    value={form.billing_address} onChange={handleChange("billing_address")}
                                    style={{borderRadius: "6px"}} />
                                <div className="row g-2">
                                    <div className="col-6">
                                        <input className="form-control app-input" placeholder="Código postal *"
                                            value={form.billing_postal_code} onChange={handleChange("billing_postal_code")}
                                            style={{borderRadius: "6px"}} />
                                    </div>
                                    <div className="col-6">
                                        <input className="form-control app-input" placeholder="Ciudad *"
                                            value={form.billing_city} onChange={handleChange("billing_city")}
                                            style={{borderRadius: "6px"}} />
                                    </div>
                                </div>
                                <input className="form-control app-input mt-2" placeholder="Provincia *"
                                    value={form.billing_province} onChange={handleChange("billing_province")}
                                    style={{borderRadius: "6px"}} />
                            </>
                        )}
                    </div>

                    <div style={{backgroundColor: "white", padding: "24px", borderRadius: "10px"}}>
                        <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                            <span style={{fontFamily: "Georgia, serif", fontSize: "1.1rem"}}>TOTAL</span>
                            <span style={{color: "#C9A84C", fontWeight: "700", fontSize: "1.4rem", fontFamily: "sans-serif"}}>
                                €{cartTotal.toFixed(2)}
                            </span>
                        </div>

                        {processing && (
                            <p style={{textAlign: "center", color: "#888", fontFamily: "sans-serif"}}>
                                Confirmando pedido...
                            </p>
                        )}

                        {!isFormValid() ? (
                            <p style={{textAlign: "center", color: "#999", fontFamily: "sans-serif", fontSize: "0.85rem"}}>
                                Completa los campos obligatorios (*) para poder pagar
                            </p>
                        ) : (
                            <PayPalButtons
                                key={JSON.stringify(form)}
                                disabled={processing}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{
                                            amount: { value: cartTotal.toFixed(2) }
                                        }]
                                    })
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        return handleApprove(details.id)
                                    })
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}