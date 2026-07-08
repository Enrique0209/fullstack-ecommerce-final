import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store } = useGlobalReducer()
    
    return (
        <nav className="navbar navbar-dark bg-dark px-4">
            <Link to="/" className="navbar-brand fw-bold">🍹 In Vino Veritas</Link>
            <div className="d-flex gap-3">
                <Link to="/catalog" className="nav-link text-white">Catálogo</Link>
                <Link to="/cart" className="nav-link text-white">🛒 Carrito</Link>
                <Link to="/profile" className="nav-link text-white">Perfil</Link>
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/register" className="btn btn-warning btn-sm">Registro</Link>
                {store.user?.is_admin && (
                    <Link to="/admin" className="btn btn-danger btn-sm">Admin</Link>
                )}
            </div>
        </nav>
    );
};