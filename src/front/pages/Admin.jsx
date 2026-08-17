import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Admin = () => {
    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const [categoryName, setCategoryName] = useState("")
    const [subcategoryName, setSubcategoryName] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [sku, setSku] = useState("")
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
        setSku("")
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
        setSku(product.sku || "")
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
                sku: sku,
                name: productName,
                price: parseFloat(price),
                price_horeca: parseFloat(priceHoreca),
                description: description,
                stock: parseInt(stock),
                subcategory_id: parseInt(subcategoryId),
                image_url: imageUrl
            })
        })
        const data = await response.json()
        if (response.ok) { setMessage("Producto creado ✓"); resetProductForm(); loadProducts() }
        else { setMessage(data.message || "Error al crear el producto") }
    }

    const handleUpdateProduct = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product/" + editingProductId, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + store.token },
            body: JSON.stringify({
                sku: sku,
                name: productName,
                price: parseFloat(price),
                price_horeca: parseFloat(priceHoreca),
                description: description,
                stock: parseInt(stock),
                subcategory_id: parseInt(subcategoryId),
                image_url: imageUrl
            })
        })
        const data = await response.json()
        if (response.ok) { setMessage("Producto actualizado ✓"); resetProductForm(); loadProducts() }
        else { setMessage(data.message || "Error al actualizar el producto") }
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

    const boxedInputStyle = {
        width: "100%",
        padding: "9px 12px",
        border: "1px solid #EDE9E0",
        borderRadius: "8px",
        marginBottom: "12px",
        fontFamily: "sans-serif",
        fontSize: "0.85rem",
        outline: "none",
        backgroundColor: "#FAFAF7"
    }

    return (
        <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh" }}>
            {/* Membrete compacto */}
            <div style={{backgroundColor: "#1a1a1a", padding: "14px 0"}}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div style={{display: "flex", alignItems: "baseline", gap: "10px"}}>
                        <h1 style={{color: "white", fontFamily: "Georgia, serif", fontWeight: "400", letterSpacing: "0.5px", fontSize: "1.1rem", margin: 0}}>Panel Admin</h1>
                        <span style={{color: "#C9A84C", letterSpacing: "2px", fontSize: "0.6rem", fontFamily: "sans-serif"}}>GESTIÓN</span>
                    </div>
                    <p style={{color: "#666", fontFamily: "sans-serif", fontSize: "0.7rem", margin: 0}}>
                        {products.length} productos · {categories.length} categorías
                    </p>
                </div>
            </div>

            <div className="container py-5">
                {message && <div style={{ backgroundColor: "#C9A84C", color: "white", padding: "12px 24px", marginBottom: "24px", fontFamily: "sans-serif", fontSize: "0.85rem", borderRadius: "8px" }}>{message}</div>}

                <div className="row g-4">
                    {/* Categorías */}
                    <div className="col-md-4">
                        <div style={{ backgroundColor: "white", padding: "28px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", borderRadius: "12px", border: "1px solid #EDE9E0" }}>
                            <p style={{ color: "#C9A84C", letterSpacing: "1.5px", fontSize: "0.62rem", fontFamily: "sans-serif", marginBottom: "4px" }}>CREAR</p>
                            <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", marginBottom: "18px", fontSize: "1.05rem" }}>Categoría</h4>
                            <input className="app-input" style={boxedInputStyle}
                                placeholder="Ej. Tequilas" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                            <button onClick={handleCreateCategory} style={{ width: "100%", padding: "11px", backgroundColor: "#C9A84C", color: "white", border: "none", borderRadius: "8px", fontFamily: "sans-serif", fontSize: "0.72rem", letterSpacing: "1.5px", cursor: "pointer" }}>
                                + AGREGAR
                            </button>
                            {categories.length > 0 && (
                                <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #F0EDE6" }}>
                                    <p style={{ fontSize: "0.62rem", letterSpacing: "1.5px", color: "#aaa", fontFamily: "sans-serif", marginBottom: "10px" }}>EXISTENTES</p>
                                    <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
                                        {categories.map(c => (
                                            <span key={c.id} style={{
                                                backgroundColor: "#F7F5F0",
                                                border: "1px solid #EDE9E0",
                                                borderRadius: "20px",
                                                padding: "4px 12px",
                                                fontFamily: "sans-serif",
                                                fontSize: "0.75rem",
                                                color: "#555"
                                            }}>
                                                {c.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subcategorías */}
                    <div className="col-md-4">
                        <div style={{ backgroundColor: "white", padding: "28px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", borderRadius: "12px", border: "1px solid #EDE9E0" }}>
                            <p style={{ color: "#C9A84C", letterSpacing: "1.5px", fontSize: "0.62rem", fontFamily: "sans-serif", marginBottom: "4px" }}>CREAR</p>
                            <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", marginBottom: "18px", fontSize: "1.05rem" }}>Subcategoría</h4>
                            <input className="app-input" style={boxedInputStyle}
                                placeholder="Ej. Blanco" value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} />
                            <select className="app-input" style={boxedInputStyle}
                                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                <option value="">Selecciona categoría</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button onClick={handleCreateSubcategory} style={{ width: "100%", padding: "11px", backgroundColor: "#C9A84C", color: "white", border: "none", borderRadius: "8px", fontFamily: "sans-serif", fontSize: "0.72rem", letterSpacing: "1.5px", cursor: "pointer" }}>
                                + AGREGAR
                            </button>
                            {subcategories.length > 0 && (
                                <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1px solid #F0EDE6" }}>
                                    <p style={{ fontSize: "0.62rem", letterSpacing: "1.5px", color: "#aaa", fontFamily: "sans-serif", marginBottom: "10px" }}>EXISTENTES</p>
                                    <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
                                        {subcategories.map(s => (
                                            <span key={s.id} style={{
                                                backgroundColor: "#F7F5F0",
                                                border: "1px solid #EDE9E0",
                                                borderRadius: "20px",
                                                padding: "4px 12px",
                                                fontFamily: "sans-serif",
                                                fontSize: "0.75rem",
                                                color: "#555"
                                            }}>
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="col-md-4">
                        <div style={{ backgroundColor: "white", padding: "28px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", borderRadius: "12px", border: editingProductId ? "1px solid #C9A84C" : "1px solid #EDE9E0" }}>
                            <p style={{ color: "#C9A84C", letterSpacing: "1.5px", fontSize: "0.62rem", fontFamily: "sans-serif", marginBottom: "4px" }}>
                                {editingProductId ? "EDITANDO" : "CREAR"}
                            </p>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "18px"}}>
                                <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", fontSize: "1.05rem", margin: 0 }}>
                                    {editingProductId ? `Producto #${editingProductId}` : "Producto"}
                                </h4>
                                {editingProductId && (
                                    <span style={{ fontSize: "0.7rem", color: "#999", fontFamily: "sans-serif", textDecoration: "underline", cursor: "pointer" }} onClick={resetProductForm}>
                                        cancelar
                                    </span>
                                )}
                            </div>
                            <input className="app-input" style={boxedInputStyle}
                                placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
                            {[
                                { placeholder: "Nombre", value: productName, setter: setProductName },
                                { placeholder: "Descripción", value: description, setter: setDescription },
                                { placeholder: "Precio €", value: price, setter: setPrice },
                                { placeholder: "Precio HORECA €", value: priceHoreca, setter: setPriceHoreca },
                                { placeholder: "Stock", value: stock, setter: setStock },
                                { placeholder: "URL imagen", value: imageUrl, setter: setImageUrl },
                            ].map((field, i) => (
                                <input key={i} className="app-input" style={boxedInputStyle}
                                    placeholder={field.placeholder} value={field.value} onChange={(e) => field.setter(e.target.value)} />
                            ))}
                            <select className="app-input" style={boxedInputStyle}
                                value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                                <option value="">Selecciona subcategoría</option>
                                {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <button
                                onClick={editingProductId ? handleUpdateProduct : handleCreateProduct}
                                style={{ width: "100%", padding: "11px", backgroundColor: "#1a1a1a", color: "white", border: "none", borderRadius: "8px", fontFamily: "sans-serif", fontSize: "0.72rem", letterSpacing: "1.5px", cursor: "pointer" }}>
                                {editingProductId ? "GUARDAR CAMBIOS" : "+ CREAR PRODUCTO"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista productos */}
                {products.length > 0 && (
                    <div style={{ marginTop: "32px" }}>
                        <p style={{ color: "#C9A84C", letterSpacing: "1.5px", fontSize: "0.62rem", fontFamily: "sans-serif", marginBottom: "4px" }}>CATÁLOGO ACTUAL</p>
                        <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "400", marginBottom: "20px", fontSize: "1.1rem" }}>{products.length} productos</h4>
                        <div className="row g-3">
                            {products.map(p => {
                                const outOfStock = p.stock <= 0
                                const isEditingThis = editingProductId === p.id
                                return (
                                    <div key={p.id} className="col-md-3">
                                        <div style={{
                                            backgroundColor: "white",
                                            border: isEditingThis ? "1px solid #C9A84C" : "1px solid #EDE9E0",
                                            borderRadius: "10px",
                                            overflow: "hidden"
                                        }}>
                                            <div style={{
                                                width: "100%",
                                                height: "120px",
                                                backgroundColor: "#FFFFFF",
                                                borderBottom: "1px solid #EDE9E0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                position: "relative",
                                                padding: "12px"
                                            }}>
                                                {outOfStock && (
                                                    <span style={{
                                                        position: "absolute",
                                                        top: "8px",
                                                        right: "8px",
                                                        backgroundColor: "#1a1a1a",
                                                        color: "white",
                                                        fontSize: "0.55rem",
                                                        letterSpacing: "0.5px",
                                                        fontFamily: "sans-serif",
                                                        padding: "3px 8px",
                                                        borderRadius: "20px"
                                                    }}>AGOTADO</span>
                                                )}
                                                <img src={p.image_url || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200"} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                                            </div>
                                            <div style={{padding: "14px"}}>
                                                <p style={{ color: "#999", fontFamily: "sans-serif", fontSize: "0.62rem", letterSpacing: "0.5px", marginBottom: "2px" }}>SKU: {p.sku}</p>
                                                <p style={{ fontFamily: "Georgia, serif", fontSize: "0.85rem", marginBottom: "2px" }}>{p.name}</p>
                                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
                                                    <span style={{ color: "#C9A84C", fontFamily: "sans-serif", fontSize: "0.8rem", fontWeight: "700" }}>€{p.price}</span>
                                                    <span style={{ color: "#999", fontFamily: "sans-serif", fontSize: "0.68rem" }}>Stock: {p.stock}</span>
                                                </div>
                                                <div style={{display: "flex", gap: "6px"}}>
                                                    <button onClick={() => handleEditClick(p)} style={{ flex: 1, padding: "7px", backgroundColor: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: "6px", fontFamily: "sans-serif", fontSize: "0.62rem", letterSpacing: "0.5px", cursor: "pointer" }}>
                                                        EDITAR
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(p.id)} style={{ flex: 1, padding: "7px", backgroundColor: "transparent", color: "#cc0000", border: "1px solid #cc0000", borderRadius: "6px", fontFamily: "sans-serif", fontSize: "0.62rem", letterSpacing: "0.5px", cursor: "pointer" }}>
                                                        BORRAR
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}