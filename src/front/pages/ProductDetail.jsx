import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const ProductDetail = () => {
    const { id } = useParams()
    const { store, dispatch } = useGlobalReducer()
    const product = store.products.find(p => p.id === parseInt(id))
    const [toastMessage, setToastMessage] = useState(null)

    useEffect(() => {
        if (toastMessage === null) return

        const timer = setTimeout(() => {
            setToastMessage(null)
        }, 2500)

        return () => clearTimeout(timer)
    }, [toastMessage])

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
            const cartResponse = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
                headers: { "Authorization": "Bearer " + store.token }
            })
            if (cartResponse.ok) {
                const cartData = await cartResponse.json()
                dispatch({ type: "set_cart", payload: cartData })
            }
            setToastMessage("✓ Producto agregado al carrito")
        } else {
            setToastMessage("Debes iniciar sesión para agregar productos")
        }
    }

    return (
    <div className="container py-5" style={{position: "relative"}}>
        {toastMessage && (
            <div style={{
                position: "fixed",
                top: "80px",
                right: "24px",
                backgroundColor: "#1a1a1a",
                color: "white",
                padding: "14px 24px",
                fontFamily: "sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                zIndex: 2000,
                borderLeft: "3px solid #C9A84C",
                animation: "fadeInOut 2.5s ease forwards"
            }}>
                {toastMessage}
            </div>
        )}

        {product ? (
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow" style={{border: "none"}}>
                        <img 
                            src={product.image_url || "https://placehold.co/800x400?text=Sin+imagen"}
                            className="card-img-top"
                            style={{height: "150px", objectFit: "cover"}}
                        />
                        <div className="card-body p-5">
                            <h1 style={{fontFamily: "Georgia, serif"}}>{product.name}</h1>
                            <p className="text-muted lead">{product.description}</p>
                            <hr/>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <p className="mb-0 text-muted">Precio</p>
                                    <h3 style={{color: "#C9A84C"}}>€{product.price}</h3>
                                </div>
                                <div>
                                    <p className="mb-0 text-muted">Stock disponible</p>
                                    <h5>{product.stock} unidades</h5>
                                </div>
                            </div>
                            <button 
                                onClick={() => addToCart(product.id)}
                                className="btn w-100 btn-lg"
                                style={{backgroundColor: "#C9A84C", color: "white", border: "none"}}>
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <p className="text-center text-muted">Producto no encontrado</p>
        )}
    </div>
)
}