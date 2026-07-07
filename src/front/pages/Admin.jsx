import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Admin = () => {
    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const [categoryName, setCategoryName] = useState("")
    const [subcategoryName, setSubcategoryName] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [productName, setProductName] = useState("")
    const [price, setPrice] = useState("")
    const [priceHoreca, setPriceHoreca] = useState("")
    const [description, setDescription] = useState("")
    const [stock, setStock] = useState("")
    const [subcategoryId, setSubcategoryId] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!store.token || !store.user?.is_admin) {
            navigate("/login")
        }
    }, [store.token])


    const handleCreateCategory = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin/category", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.token
            },
            body: JSON.stringify({ name: categoryName })
        })
        if (response.ok) setMessage("Categoría creada ✓")
    }

    const handleCreateSubcategory = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin/subcategory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.token
            },
            body: JSON.stringify({ name: subcategoryName, category_id: parseInt(categoryId) })
        })
        if (response.ok) setMessage("Subcategoría creada ✓")
    }

    const handleCreateProduct = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin/product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + store.token
            },
            body: JSON.stringify({
                name: productName,
                price: parseFloat(price),
                price_horeca: parseFloat(priceHoreca),
                description,
                stock: parseInt(stock),
                subcategory_id: parseInt(subcategoryId),
                image_url: imageUrl
            })
        })
        if (response.ok) setMessage("Producto creado ✓")


        return (
            <div className="container py-5">
                <h1 className="text-center mb-5" style={{ fontFamily: "Georgia, serif" }}>PANEL ADMIN</h1>

                {message && <div className="alert alert-success">{message}</div>}

                {/* Crear Categoría */}
                <div className="card shadow p-4 mb-4" style={{ border: "none" }}>
                    <h4>Nueva Categoría</h4>
                    <input className="form-control mb-3" placeholder="Nombre de categoría"
                        value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    <button className="btn" style={{ backgroundColor: "#C9A84C", color: "white" }}
                        onClick={handleCreateCategory}>Crear Categoría</button>
                </div>

                {/* Crear Subcategoría */}
                <div className="card shadow p-4 mb-4" style={{ border: "none" }}>
                    <h4>Nueva Subcategoría</h4>
                    <input className="form-control mb-3" placeholder="Nombre de subcategoría"
                        value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} />
                    <input className="form-control mb-3" placeholder="ID de categoría"
                        value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
                    <button className="btn" style={{ backgroundColor: "#C9A84C", color: "white" }}
                        onClick={handleCreateSubcategory}>Crear Subcategoría</button>
                </div>

                {/* Crear Producto */}
                <div className="card shadow p-4 mb-4" style={{ border: "none" }}>
                    <h4>Nuevo Producto</h4>
                    <input className="form-control mb-3" placeholder="Nombre" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <input className="form-control mb-3" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input className="form-control mb-3" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input className="form-control mb-3" placeholder="Precio HORECA" value={priceHoreca} onChange={(e) => setPriceHoreca(e.target.value)} />
                    <input className="form-control mb-3" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                    <input className="form-control mb-3" placeholder="ID Subcategoría" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} />
                    <input className="form-control mb-3" placeholder="URL imagen" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    <button className="btn" style={{ backgroundColor: "#C9A84C", color: "white" }}
                        onClick={handleCreateProduct}>Crear Producto</button>
                </div>
            </div>
        )
    }
}