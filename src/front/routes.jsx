import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Catalog } from "./pages/Catalog";
import { Register } from "./pages/Register";
import { Cart } from "./pages/Cart";
import { ProductDetail } from "./pages/ProductDetail";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter(
    createRoutesFromElements(
      // Ruta principal - contiene el navbar y footer en todas las páginas
      <Route path="/" element={<Layout />} errorElement={<h1>Página no encontrada</h1>} >

        {/* Página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Catálogo de productos */}
        <Route path="/catalog" element={<Catalog />} />

        {/* Detalle de un producto específico */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Carrito de compras */}
        <Route path="/cart" element={<Cart />} />

        {/* Perfil del usuario */}
        <Route path="/profile" element={<Profile />} />

        {/* Registro de nuevo usuario */}
        <Route path="/register" element={<Register />} />

        {/* Inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Rutas del template que no usamos pero dejamos */}
        <Route path="/single/:theId" element={<Single />} />
        <Route path="/demo" element={<Demo />} />
      </Route>
    )
);