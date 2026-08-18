[Versión en español aquí](./README.md)

# In Vino Veritas — Full Stack E-commerce

Online wine and spirits store, built as the final project for 4Geeks Academy's Full Stack bootcamp and evolving into a real production application for an active business.

What started as an academic project is becoming the real online store for [Invino Veritas / Entrecompas](https://fullstack-ecommerce-final.onrender.com), incorporating features driven by real business needs: differentiated pricing for professional (HORECA) clients, server-side payment verification, and catalog management designed for a non-technical administrator to operate.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + React Router (Vite) |
| Backend | Flask + SQLAlchemy + Flask-Migrate |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Payments | PayPal, with server-side verification |
| Deployment | Render |

## Features

- **Public catalog** with categories and subcategories, manageable from an admin panel with no code required
- **Unique SKU per product**, assigned by the admin when adding items to the catalog
- **Differentiated pricing**: HORECA (hospitality) clients access separate B2B rates from public pricing
- **Cart and PayPal checkout**, with payment verification against the official PayPal API from the backend — the total is never trusted from the browser, it's always recalculated server-side from real database prices
- **Stock control**: orders are blocked if there isn't enough inventory, preventing overselling
- **Shipping and billing address** per order, including tax ID (CIF) for clients who require an invoice
- **Admin panel** for full catalog management (categories, subcategories, products)
- **Modular backend architecture**: routes organized by domain (auth, products, categories, cart, profile, admin, orders) using Flask blueprints

## Roadmap

This project is under active development. Upcoming additions:

- Transactional email system (order confirmation, password recovery, registration verification)
- Custom image uploads via Cloudinary
- PDF order confirmation attached to emails
- Visitor and conversion analytics
- SEO optimization

## Author

**Alain Enrique González Jaimes**
Full Stack Developer certified by 4Geeks Academy · Madrid, Spain

[LinkedIn](https://www.linkedin.com/in/alainenriquegonzalezjaimes/) · [GitHub](https://github.com/Enrique0209)
