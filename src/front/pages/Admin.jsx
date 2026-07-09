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
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [products, setProducts] = useState([])
    const [editingProductId, setEditingProductId] = useState(null)

    useEffect(() => {
        if (store.token === null || !store.user?.is_admin) navigate("/login")
        else {
            loadCategories()
            loadSubcategories()
            loadProducts()
        }
    }, [store.token])

    const loadCategories = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/category")
        const data = await response.json()
        if (response.ok) setCategories(data)
    }

    const loadSubcategories = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/subcategory")
        const data = await response.json()
        if (response.ok) setSubcategories(data)
    }

    const loadProducts = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product")
        const data = await response.json()
        if (response.ok) setProducts(data)
    }

    const handleCreateCategory = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin/category", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + store.token },
            body: JSON.stringify({ name: categoryName })
        })
        if (response.ok) { setMessage("Categoría creada ✓"); setCategoryName(""); loadCategories() }
    }

    const handleCreateSubcategory = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin/subcategory", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + store.token },
            body: JSON.stringify({ name: subcategoryName, category_id: parseInt(categoryId) })
        })
        if (response.ok) { setMessage("Subcategoría creada ✓"); setSubcategoryName(""); setCategoryId(""); loadSubcategories() }
    }

    const resetProductForm = () => {
        setEditingProductId(null)
        setProductName("")
        setPrice("")
        setPriceHoreca("")
        setDescription("")
        setStock("")
        setSubcategoryId("")
        setImageUrl("")
    }

    const handleEditClick = (product) => {
        setEditingProductId(product.id)
        setProductName(product.name || "")
        setPrice(product.price ?? "")
        setPriceHoreca(product.price_horeca ?? "")
        setDescription(product.description || "")
        setStock(product.stock ?? "")
        setSubcategoryId(product.subcategory_id ?? "")
        setImageUrl(product.image_url || "")
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleCreateProduct = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/admin/product", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + store.token },
            body: JSON.stringify({
                name: productName,
                price: parseFloat(price),
                price_horeca: parseFloat(priceHoreca),
                description: description,
                stock: parseInt(stock),
                subcategory_id: parseInt(subcategoryId),
                image_url: imageUrl
            })
        })
        if (response.ok) { setMessage("Producto creado ✓"); resetProductForm(); loadProducts() }
    }

    const handleUpdateProduct = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product/" + editingProductId, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + store.token },
            body: JSON.stringify({
                name: productName,
                price: parseFloat(price),
                price_horeca: parseFloat(priceHoreca),
                description: description,
                stock: parseInt(stock),
                subcategory_id: parseInt(subcategoryId),
                image_url: imageUrl
            })
        })
        if (response.ok) { setMessage("Producto actualizado ✓"); resetProductForm(); loadProducts() }
        else { setMessage("Error al actualizar el producto") }
    }

    const handleDeleteProduct = async (product_id) => {
        const confirmed = window.confirm("¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.")
        if (!confirmed) return

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product/" + product_id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + store.token }
        })
        if (response.ok) {
            setMessage("Producto eliminado ✓")
            loadProducts()
        } else {
            setMessage("Error al eliminar el producto")
        }
    }

    return (
        <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh" }}>
            <div style={{ backgroundColor: "#1a1a1a", padding: "60px 0", textAlign: "center" }}>
                <p style={{ color: "#C9A84C", letterSpacing: "4px", fontSize: "0.7rem", fontFamily: "sans-serif", marginBottom: "8px" }}>GESTIÓN</p>
                <h1 style={{ color: "white", fontFamily: "Georgia, serif", fontWeight: "300", letterSpacing: "6px", fontSize: "2.5rem" }}>PANEL ADMIN</h1>
            </div>

            <div className="container py-5">
                {message && <div style={{ backgroundColor: "#C9A84C", color: "white", padding: "12px 24px", marginBottom: "24px", fontFamily: "sans-serif", fontSize: "0.85rem" }}>{message}</div>}

                <div className="row g-4">
                    {/* Categorías */}
                    <div className="col-md-4">
                        <div style={{ backgroundColor: "white", padding: "32px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
                            <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", marginBottom: "24px" }}>Nueva Categoría</h4>
                            <input style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", marginBottom: "20px", fontFamily: "sans-serif", outline: "none", backgroundColor: "transparent" }}
                                placeholder="Nombre" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                            <button onClick={handleCreateCategory} style={{ width: "100%", padding: "12px", backgroundColor: "#C9A84C", color: "white", border: "none", fontFamily: "sans-serif", fontSize: "0.75rem", letterSpacing: "2px", cursor: "pointer" }}>
                                CREAR
                            </button>
                            {categories.length > 0 && (
                                <div style={{ marginTop: "24px" }}>
                                    <p style={{ fontSize: "0.7rem", letterSpacing: "2px", color: "#888", fontFamily: "sans-serif", marginBottom: "12px" }}>CATEGORÍAS EXISTENTES</p>
                                    {categories.map(c => (
                                        <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontFamily: "sans-serif", fontSize: "0.85rem" }}>
                                            <span style={{ color: "#C9A84C", marginRight: "8px" }}>#{c.id}</span>{c.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subcategorías */}
                    <div className="col-md-4">
                        <div style={{ backgroundColor: "white", padding: "32px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
                            <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", marginBottom: "24px" }}>Nueva Subcategoría</h4>
                            <input style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", marginBottom: "16px", fontFamily: "sans-serif", outline: "none", backgroundColor: "transparent" }}
                                placeholder="Nombre" value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} />
                            <select style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", marginBottom: "20px", fontFamily: "sans-serif", outline: "none", backgroundColor: "transparent" }}
                                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                <option value="">Selecciona categoría</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button onClick={handleCreateSubcategory} style={{ width: "100%", padding: "12px", backgroundColor: "#C9A84C", color: "white", border: "none", fontFamily: "sans-serif", fontSize: "0.75rem", letterSpacing: "2px", cursor: "pointer" }}>
                                CREAR
                            </button>
                            {subcategories.length > 0 && (
                                <div style={{ marginTop: "24px" }}>
                                    <p style={{ fontSize: "0.7rem", letterSpacing: "2px", color: "#888", fontFamily: "sans-serif", marginBottom: "12px" }}>SUBCATEGORÍAS EXISTENTES</p>
                                    {subcategories.map(s => (
                                        <div key={s.id} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontFamily: "sans-serif", fontSize: "0.85rem" }}>
                                            <span style={{ color: "#C9A84C", marginRight: "8px" }}>#{s.id}</span>{s.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="col-md-4">
                        <div style={{ backgroundColor: "white", padding: "32px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
                            <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", marginBottom: "8px" }}>
                                {editingProductId ? "Editar Producto" : "Nuevo Producto"}
                            </h4>
                            {editingProductId && (
                                <p style={{ fontSize: "0.75rem", color: "#C9A84C", fontFamily: "sans-serif", marginBottom: "16px" }}>
                                    Editando #{editingProductId} — <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={resetProductForm}>cancelar</span>
                                </p>
                            )}
                            {[
                                { placeholder: "Nombre", value: productName, setter: setProductName },
                                { placeholder: "Descripción", value: description, setter: setDescription },
                                { placeholder: "Precio €", value: price, setter: setPrice },
                                { placeholder: "Precio HORECA €", value: priceHoreca, setter: setPriceHoreca },
                                { placeholder: "Stock", value: stock, setter: setStock },
                                { placeholder: "URL imagen", value: imageUrl, setter: setImageUrl },
                            ].map((field, i) => (
                                <input key={i} style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", marginBottom: "12px", fontFamily: "sans-serif", outline: "none", backgroundColor: "transparent" }}
                                    placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} />
                            ))}
                            <select style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: "1px solid #ddd", marginBottom: "20px", fontFamily: "sans-serif", outline: "none", backgroundColor: "transparent" }}
                                value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                                <option value="">Selecciona subcategoría</option>
                                {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <button
                                onClick={editingProductId ? handleUpdateProduct : handleCreateProduct}
                                style={{ width: "100%", padding: "12px", backgroundColor: "#1a1a1a", color: "white", border: "none", fontFamily: "sans-serif", fontSize: "0.75rem", letterSpacing: "2px", cursor: "pointer" }}>
                                {editingProductId ? "GUARDAR CAMBIOS" : "CREAR PRODUCTO"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista productos */}
                {products.length > 0 && (
                    <div style={{ marginTop: "40px", backgroundColor: "white", padding: "32px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)" }}>
                        <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", marginBottom: "24px" }}>Productos en catálogo ({products.length})</h4>
                        <div className="row g-3">
                            {products.map(p => (
                                <div key={p.id} className="col-md-3">
                                    <div style={{ border: "1px solid #f0f0f0", padding: "16px" }}>
                                        <img src={p.image_url || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200"} style={{ width: "100%", height: "100px", objectFit: "cover", marginBottom: "12px" }} />
                                        <p style={{ fontFamily: "Georgia, serif", fontSize: "0.9rem", marginBottom: "4px" }}>{p.name}</p>
                                        <p style={{ color: "#C9A84C", fontFamily: "sans-serif", fontSize: "0.85rem", margin: "0 0 12px 0" }}>€{p.price}</p>
                                        <button onClick={() => handleEditClick(p)} style={{ width: "100%", padding: "8px", backgroundColor: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", fontFamily: "sans-serif", fontSize: "0.7rem", letterSpacing: "1px", cursor: "pointer", marginBottom: "6px" }}>
                                            EDITAR
                                        </button>
                                        <button onClick={() => handleDeleteProduct(p.id)} style={{ width: "100%", padding: "8px", backgroundColor: "transparent", color: "#cc0000", border: "1px solid #cc0000", fontFamily: "sans-serif", fontSize: "0.7rem", letterSpacing: "1px", cursor: "pointer" }}>
                                            ELIMINAR
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}