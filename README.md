# ABOUT YOU Clone

A fashion e-commerce web app inspired by [aboutyou.com](https://www.aboutyou.com), with a storefront and an admin panel.

## Stack

- **Frontend** (`client/`): React 19, Tailwind CSS 4, React Router 7, Vite
- **Backend** (`server/`): Node.js, Express, JWT auth (jsonwebtoken + bcryptjs), JSON file persistence

## Features

**Storefront**
- Home page with category tiles, Top 100 and SALE sections
- Women / Men / Kids category pages with subcategory, brand and price-sort filters
- Search, SALE, New Arrivals and Top 100 pages
- Product detail with image gallery, size selection, wishlist and basket
- Basket, checkout (order placement), wishlist, account with order history
- Login / registration with JWT

**Admin panel** (`/admin`)
- Dashboard with revenue / orders / products / users stats and recent orders
- Product management (create, edit, delete)
- Order management (status updates)
- User overview

## Getting started

```bash
# Backend (port 4000)
cd server
npm install
npm run dev

# Frontend (port 5173, proxies /api to :4000)
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Demo accounts

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@aboutyou.com     | admin123    |
| Customer | customer@example.com   | customer123 |

The database is seeded automatically on first server start (`server/data/db.json`).
