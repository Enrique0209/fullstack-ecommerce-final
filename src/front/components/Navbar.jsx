import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">In Vino Veritas</span>
				</Link>
				<Link to="/catalog">Catálogo</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Registro</Link>
				<Link to="/cart">Carrito</Link>
				<Link to="/profile">Perfil</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};