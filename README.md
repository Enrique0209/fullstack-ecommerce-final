[English version here](./README.en.md)

# In Vino Veritas — E-commerce Full Stack

Tienda en línea de vinos y destilados, construida como proyecto final del bootcamp Full Stack de 4Geeks Academy y evolucionada hacia una aplicación de producción real para un negocio activo.

Lo que empezó como un proyecto académico se está convirtiendo en la tienda en línea real de [Invino Veritas / Entrecompas](https://fullstack-ecommerce-final.onrender.com), incorporando funcionalidades que responden a necesidades reales de negocio: precios diferenciados para clientes profesionales (HORECA), verificación de pagos del lado del servidor, y gestión de catálogo pensada para que un administrador sin conocimientos técnicos pueda operarla.

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React + React Router (Vite) |
| Backend | Flask + SQLAlchemy + Flask-Migrate |
| Base de datos | PostgreSQL |
| Autenticación | JWT + bcrypt |
| Pagos | PayPal, con verificación server-side |
| Despliegue | Render |

## Funcionalidades

- **Catálogo público** con categorías y subcategorías, gestionado desde un panel de administración sin necesidad de tocar código
- **SKU único por producto**, asignado por el administrador al momento de dar de alta el catálogo
- **Precios diferenciados**: clientes HORECA (hostelería/restauración) acceden a tarifas B2B distintas del precio público
- **Carrito y checkout con PayPal**, con verificación del pago contra la API oficial de PayPal desde el backend — el total nunca se confía desde el navegador, siempre se recalcula en el servidor a partir de los precios reales en base de datos
- **Control de stock**: los pedidos se bloquean si no hay inventario suficiente, evitando sobreventa
- **Dirección de entrega y facturación** por pedido, incluyendo datos fiscales (CIF) para clientes que requieren factura
- **Panel de administración** para gestión completa del catálogo (categorías, subcategorías, productos)
- **Arquitectura modular** en el backend: rutas organizadas por dominio (auth, productos, categorías, carrito, perfil, admin, pedidos) con blueprints de Flask

## Roadmap

Este proyecto sigue en desarrollo activo. Próximas incorporaciones:

- Sistema de correo transaccional (confirmación de pedidos, recuperación de contraseña, verificación de registro)
- Subida de imágenes propias vía Cloudinary
- Confirmación de pedido en PDF adjunto al correo
- Analítica de visitantes y conversión
- Optimización SEO

## Autor

**Alain Enrique González Jaimes**
Full Stack Developer certificado por 4Geeks Academy · Madrid, España

[LinkedIn](https://www.linkedin.com/in/alainenriquegonzalezjaimes/) · [GitHub](https://github.com/Enrique0209)
