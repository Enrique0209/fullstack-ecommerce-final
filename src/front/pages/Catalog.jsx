import React, { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Link } from "react-router-dom"
import { getCartHeaders } from "../cartAuth"

export const Catalog = () => {
    const { store, dispatch } = useGlobalReducer()
    const [toastMessage, setToastMessage] = useState(null)
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("")

    const loadProducts = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/product")
        const data = await response.json()
        if (response.ok) dispatch({ type: "set_products", payload: data })
    }

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

    useEffect(() => {
        loadProducts()
        loadCategories()
        loadSubcategories()
    }, [])

    useEffect(() => {
        if (toastMessage === null) return
        const timer = setTimeout(() => setToastMessage(null), 2500)
        return () => clearTimeout(timer)
    }, [toastMessage])

    const addToCart = async (product_id) => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
            method: "POST",
            headers: getCartHeaders(store, { "Content-Type": "application/json" }),
            body: JSON.stringify({ product_id: product_id, quantity: 1 })
        })

        if (response.ok) {
            const cartResponse = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
                headers: getCartHeaders(store)
            })
            if (cartResponse.ok) {
                const cartData = await cartResponse.json()
                dispatch({ type: "set_cart", payload: cartData })
            }
            setToastMessage("✓ Producto agregado al carrito")
        } else {
            setToastMessage("No se pudo agregar el producto")
        }
        return response.ok
    }

    const visibleSubcategories = selectedCategoryId
        ? subcategories.filter(s => s.category_id === parseInt(selectedCategoryId))
        : subcategories

    useEffect(() => {
        if (selectedSubcategoryId) {
            const stillValid = visibleSubcategories.some(s => s.id === parseInt(selectedSubcategoryId))
            if (!stillValid) setSelectedSubcategoryId("")
        }
    }, [selectedCategoryId])

    const filteredProducts = store.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        if (!matchesSearch) return false

        if (selectedSubcategoryId) {
            return product.subcategory_id === parseInt(selectedSubcategoryId)
        }

        if (selectedCategoryId) {
            const subIdsInCategory = subcategories
                .filter(s => s.category_id === parseInt(selectedCategoryId))
                .map(s => s.id)
            return subIdsInCategory.includes(product.subcategory_id)
        }

        return true
    })

    const getSubcategoryName = (subcategory_id) => {
        const sub = subcategories.find(s => s.id === subcategory_id)
        return sub ? sub.name : null
    }

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedCategoryId("")
        setSelectedSubcategoryId("")
    }

    const hasActiveFilters = searchTerm || selectedCategoryId || selectedSubcategoryId

    return (
    <div style={{backgroundColor: "#F7F5F0", minHeight: "100vh", position: "relative"}}>
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
                borderRadius: "4px",
                animation: "fadeInOut 2.5s ease forwards"
            }}>
                {toastMessage}
            </div>
        )}

        {/* Membrete compacto, más bajo que el navbar (65px) */}
        <div style={{backgroundColor: "#1a1a1a", padding: "14px 0"}}>
            <div className="container d-flex justify-content-between align-items-center">
                <div style={{display: "flex", alignItems: "baseline", gap: "10px"}}>
                    <h1 style={{color: "white", fontFamily: "Georgia, serif", fontWeight: "400", letterSpacing: "0.5px", fontSize: "1.1rem", margin: 0}}>Catálogo</h1>
                    <span style={{color: "#C9A84C", letterSpacing: "2px", fontSize: "0.6rem", fontFamily: "sans-serif"}}>NUESTRA SELECCIÓN</span>
                </div>
                <p style={{color: "#666", fontFamily: "sans-serif", fontSize: "0.7rem", margin: 0}}>
                    {store.products.length} referencias
                </p>
            </div>
        </div>

        {/* Barra de filtros */}
<div style={{backgroundColor: "white", borderBottom: "1px solid #eee", position: "sticky", top: "65px", zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.04)"}}>
    <div className="container py-2">
        <div className="row g-2 align-items-center">
            <div className="col-md-4">
                <div style={{position: "relative"}}>
                    <span style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#bbb",
                        fontSize: "0.75rem",
                        pointerEvents: "none"
                    }}>⚲</span>
                    <input
                        type="text"
                        className="app-input"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "6px 12px 6px 30px",
                            border: "1px solid #EDE9E0",
                            borderRadius: "16px",
                            fontFamily: "sans-serif",
                            fontSize: "0.78rem",
                            outline: "none"
                        }}
                    />
                </div>
            </div>
            <div className="col-md-3">
                <select
                    className="app-input"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "6px 12px",
                        border: "1px solid #EDE9E0",
                        borderRadius: "16px",
                        fontFamily: "sans-serif",
                        fontSize: "0.78rem",
                        outline: "none",
                        backgroundColor: "white",
                        color: selectedCategoryId ? "#1a1a1a" : "#999"
                    }}
                >
                    <option value="">Categoría</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div className="col-md-3">
                <select
                    className="app-input"
                    value={selectedSubcategoryId}
                    onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "6px 12px",
                        border: "1px solid #EDE9E0",
                        borderRadius: "16px",
                        fontFamily: "sans-serif",
                        fontSize: "0.78rem",
                        outline: "none",
                        backgroundColor: "white",
                        color: selectedSubcategoryId ? "#1a1a1a" : "#999"
                    }}
                >
                    <option value="">Subcategoría</option>
                    {visibleSubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div className="col-md-2">
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        style={{
                            width: "100%",
                            padding: "6px",
                            backgroundColor: "transparent",
                            color: "#999",
                            border: "1px solid #EDE9E0",
                            borderRadius: "16px",
                            fontFamily: "sans-serif",
                            fontSize: "0.68rem",
                            letterSpacing: "1px",
                            cursor: "pointer"
                        }}
                    >
                        ✕ LIMPIAR
                    </button>
                )}
            </div>
        </div>
    </div>
</div>

        {/* Grid de productos */}
        <div className="container py-5">
            {store.products.length === 0 ? (
                <p style={{textAlign: "center", color: "#888", fontFamily: "sans-serif", padding: "60px 0"}}>
                    El catálogo estará disponible pronto.
                </p>
            ) : filteredProducts.length === 0 ? (
                <div style={{textAlign: "center", padding: "60px 0"}}>
                    <p style={{color: "#888", fontFamily: "sans-serif", marginBottom: "16px"}}>
                        No encontramos productos con esos filtros.
                    </p>
                    <span
                        onClick={clearFilters}
                        style={{color: "#C9A84C", fontFamily: "sans-serif", fontSize: "0.85rem", textDecoration: "underline", cursor: "pointer"}}
                    >
                        Limpiar filtros
                    </span>
                </div>
            ) : (
                <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
                    {filteredProducts.map((product) => {
                        const subcategoryName = getSubcategoryName(product.subcategory_id)
                        const outOfStock = product.stock <= 0
                        return (
                            <div key={product.id} className="col">
                                <div className="product-card" style={{backgroundColor: "white", border: "1px solid #EDE9E0", borderRadius: "10px", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column"}}>
                                    <div style={{
                                        width: "100%",
                                        height: "190px",
                                        backgroundColor: "#FFFFFF",
                                        borderBottom: "1px solid #EDE9E0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                        padding: "20px"
                                    }}>
                                        {subcategoryName && (
                                            <span style={{
                                                position: "absolute",
                                                top: "14px",
                                                left: "14px",
                                                backgroundColor: "#F7F5F0",
                                                color: "#1a1a1a",
                                                fontSize: "0.62rem",
                                                letterSpacing: "1px",
                                                fontFamily: "sans-serif",
                                                padding: "4px 10px",
                                                borderRadius: "20px",
                                                border: "1px solid #EDE9E0"
                                            }}>
                                                {subcategoryName.toUpperCase()}
                                            </span>
                                        )}
                                        {outOfStock && (
                                            <span style={{
                                                position: "absolute",
                                                top: "14px",
                                                right: "14px",
                                                backgroundColor: "#1a1a1a",
                                                color: "white",
                                                fontSize: "0.62rem",
                                                letterSpacing: "1px",
                                                fontFamily: "sans-serif",
                                                padding: "4px 10px",
                                                borderRadius: "20px"
                                            }}>
                                                AGOTADO
                                            </span>
                                        )}
                                        <img
                                            src={product.image_url || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80"}
                                            style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}}
                                        />
                                    </div>
                                    <div style={{padding: "16px 18px 18px", display: "flex", flexDirection: "column", flexGrow: 1}}>
                                        <h5 style={{fontFamily: "Georgia, serif", fontWeight: "400", fontSize: "0.9rem", marginBottom: "6px"}}>
                                            {product.name}
                                        </h5>
                                        <p style={{color: "#999", fontSize: "0.8rem", fontFamily: "sans-serif", flexGrow: 1, marginBottom: "16px", lineHeight: "1.5"}}>
                                            {product.description}
                                        </p>
                                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px"}}>
                                            <span style={{color: "#C9A84C", fontWeight: "700", fontSize: "1.15rem", fontFamily: "sans-serif"}}>
                                                €{product.price}
                                            </span>
                                        </div>
                                        <div style={{display: "flex", gap: "6px"}}>
    <Link to={`/product/${product.id}`} style={{
        flex: 1,
        textAlign: "center",
        padding: "7px 4px",
        border: "1px solid #1a1a1a",
        borderRadius: "6px",
        color: "#1a1a1a",
        textDecoration: "none",
        fontSize: "0.6rem",
        letterSpacing: "0.5px",
        fontFamily: "sans-serif"
    }}>VER MÁS</Link>
    <button
        onClick={() => addToCart(product.id)}
        disabled={outOfStock}
        style={{
            flex: 1,
            padding: "7px 4px",
            backgroundColor: outOfStock ? "#ddd" : "#C9A84C",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "0.6rem",
            letterSpacing: "0.5px",
            fontFamily: "sans-serif",
            cursor: outOfStock ? "not-allowed" : "pointer"
        }}>{outOfStock ? "SIN STOCK" : "+ CARRITO"}</button>
</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
)
}
