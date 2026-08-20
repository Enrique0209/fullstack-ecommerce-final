# In Vino Veritas — Documento de alcance por fases

Última actualización: sesión de scope, agosto 2026

---

## Fase 1 — Ya construido (base estable, no se toca)

- SKU único por producto, asignado manualmente por el admin
- Catálogo público con categorías y subcategorías
- Carrito por usuario autenticado
- Modelo `Order` / `OrderItem` con dirección de entrega y facturación (incluye CIF opcional)
- Endpoint `POST /api/order`: verifica el pago contra la API real de PayPal, recalcula el total desde la base de datos (nunca confía en el frontend), bloquea pedidos si no hay stock suficiente, descuenta stock, previene reprocesar el mismo pago dos veces
- Precio diferenciado simple: `price` vs `price_horeca` según `user.is_horeca`
- Panel de admin: gestión de categorías, subcategorías y productos

---

## Fase 2 — Checkout robusto (siguiente bloque de trabajo)

Objetivo: que cualquier persona (con cuenta o sin ella) pueda completar una compra real de principio a fin, con envío calculado correctamente.

1. **Carrito por sesión para invitados**
   - Invitados identificados por un ID temporal (cookie o localStorage), sin necesidad de cuenta
   - El carrito de invitado convive con el carrito de usuario autenticado (arquitecturas distintas, incluso si comparten el mismo endpoint conceptualmente)

2. **Registro con verificación de email real**
   - Registro simple: nombre, email, password
   - Verificación por link enviado por correo (Resend) antes de poder comprar con cuenta
   - Teléfono NO se pide en el registro, se pide en el checkout

3. **Formulario de checkout** (mismo para invitado y usuario registrado)
   - Campos: nombre, email, teléfono, dirección de entrega, dirección de facturación (opcional, checkbox "misma que entrega")
   - Si el usuario tiene cuenta: la dirección se guarda en su perfil tras la primera compra, para reutilizar en la siguiente
   - Si es invitado: los datos solo viven en ese pedido

4. **Cálculo de envío diferenciado**
   - Cliente público: pedido < 50€ → 5,50€ de envío. Pedido ≥ 50€ → envío gratis
   - Cliente HORECA: sin tarifa de envío plana — aplica pedido mínimo por zona (ver nota abajo, pendiente de definir con exactitud)
   - Nota pendiente: mínimos HORECA mencionados — 80€ (Madrid dentro de M30) / 100€ (fuera de Madrid, ej. Barcelona, Valencia). Falta definir cómo se captura la zona del cliente para aplicar la regla correcta

5. **Seguimiento de pedido para invitados (sin cuenta)**
   - Cada pedido de invitado genera un token único (UUID) no adivinable
   - Email de confirmación incluye link público: `tutienda.com/pedido/estado/{token}`
   - Esa página no requiere login, solo busca el pedido por el token y muestra su estado

6. **Alta manual de clientes HORECA desde el panel admin**
   - Nueva pantalla en el panel admin: "Crear cliente HORECA"
   - Campos: nombre, email, código de cliente (replicando la lógica de códigos de ClassicGes, ej. 1201, 1202...), genera password temporal automático
   - Se marca `is_horeca = True` al crearlo
   - El cliente puede cambiar su contraseña temporal cuando quiera
   - Flujo de negocio: el comercial habla con el cliente potencial fuera del sistema (como ya hacen hoy), y una vez validado, se le da de alta aquí — no es autoservicio ni solicitud pública

---

## Fase 3 — Integración de catálogo y sistema de gestión (después de Fase 2)

Objetivo: reflejar en la tienda online la escala real del catálogo de la distribuidora, y explorar la conexión con ClassicGes (sistema de gestión ya en uso).

7. **Catálogo HORECA ampliado**
   - El catálogo de la distribuidora es mucho más grande que el catálogo público (cientos de referencias por familia: mezcal, tequila, whisky, ginebra, ron, vino, licores, etc. — ver lista de precios de referencia)
   - Campo nuevo en `Product`: `is_horeca_only` (booleano) — productos exclusivos para clientes HORECA, no visibles en el catálogo público
   - Usuarios `is_horeca` ven catálogo público + catálogo exclusivo combinados
   - **Decisión de diseño ya tomada**: el catálogo HORECA no necesita presentación visual tipo tienda (sin fotos grandes, sin tarjetas de producto). Es una vista de tabla/listado con filtros por familia y buscador por nombre o código — más parecido a una hoja de tarifa navegable que a un catálogo de e-commerce. Coincide con cómo el cliente HORECA ya usa el PDF de tarifas actual.

8. **Sincronización con ClassicGes**
   - Explorar cómo enlazar el stock y precios reales del sistema de gestión (ClassicGes / ClassicAIR) con la tienda online
   - No es necesario para operar el negocio en ClassicGes (eso ya funciona independientemente), pero sería valioso para que la web muestre disponibilidad real, sobre todo a clientes HORECA
   - Pendiente de definir: si ClassicGes ofrece alguna forma de exportación/API, con qué frecuencia sincronizar, qué campos mapear (código de producto, familia, precio, stock)
   - Este punto es una integración de sistemas en sí misma — se diseña con su propio scope cuando llegue el momento, no se mezcla con el checkout

---

## Fase 4 — Fuera de alcance por ahora (no se diseña todavía)

- Agente de IA para resolver dudas de clientes
- App móvil
- Cualquier otra idea que surja mientras se construyen las fases anteriores — se anota aquí, no se evalúa contra "reiniciar el proyecto"

---

## Principio guía

Cuando surja una idea nueva a mitad de una sesión de código: se anota en la fase correspondiente de este documento, no se decide en caliente si "cabe" en lo que se está construyendo ese día. Cada fase se diseña con su propia sesión de scope antes de escribir código, como se hizo con Order y como se hizo con este documento.
