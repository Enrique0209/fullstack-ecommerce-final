import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const ProductDetail = () => {
    const { id } = useParams()
    const { store } = useGlobalReducer()
    const product = store.products.find(p => p.id === parseInt(id))

    const addToCart = async (product_id) => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.token
            },
            body: JSON.stringify({ product_id: product_id, quantity: 1 })
        })
        if (response.ok) alert("Producto agregado al carrito")
    }

    return (
        <div>
            {product ? (
                <>
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p>€{product.price}</p>
                    <button onClick={() => addToCart(product.id)}>Agregar al carrito</button>
                </>
            ) : (
                <p>Producto no encontrado</p>
            )}
        </div>
    )
}