// Helper centralizado para identificar al dueño del carrito en cada
// request: usuario logueado (Authorization) o invitado (X-Guest-Token).
// Todo el frontend que toque /cart o /login pasa por aquí para no
// repetir esta lógica en cada componente.

const GUEST_TOKEN_KEY = "guest_token"

// Devuelve el guest_token existente en localStorage, o crea uno nuevo
// si no hay ninguno. Solo se llama cuando NO hay usuario logueado.
export function getOrCreateGuestToken() {
    let token = localStorage.getItem(GUEST_TOKEN_KEY)
    if (!token) {
        token = crypto.randomUUID()
        localStorage.setItem(GUEST_TOKEN_KEY, token)
    }
    return token
}

export function clearGuestToken() {
    localStorage.removeItem(GUEST_TOKEN_KEY)
}

// Arma los headers de identidad para /cart (y /login, para el merge).
// Si hay token de usuario -> Authorization. Si no -> X-Guest-Token.
// extraHeaders permite agregar Content-Type u otros sin pisar estos.
export function getCartHeaders(store, extraHeaders = {}) {
    if (store.token) {
        return { ...extraHeaders, "Authorization": "Bearer " + store.token }
    }
    return { ...extraHeaders, "X-Guest-Token": getOrCreateGuestToken() }
}

// Trae el carrito actual (de usuario o invitado) y lo mete al store.
// Centralizado aquí porque tanto Cart.jsx como Login.jsx (tras loguear)
// necesitan la misma llamada — evita mantener el fetch duplicado en dos
// componentes y que se desincronicen si el endpoint cambia.
export async function fetchCart(store, dispatch) {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
        headers: getCartHeaders(store)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch({ type: "set_cart", payload: data })
    }
    return response.ok
}