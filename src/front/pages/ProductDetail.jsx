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
    <div className="container py-5">
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