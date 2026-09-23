# Nimoura — Handcrafted Jewellery Website

## Setup & Run

```bash
npm install
npm start
```

Opens at http://localhost:3000

---

## Pages & Routes

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/shop` | Shop (all products) |
| `/shop?category=Rings` | Filtered by category |
| `/product/:id` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with form validation |
| `/login` | Login / Register |
| `/admin` | Admin panel (admin only) |
| `/about` | About Nimoura |
| `/care` | Jewellery care guide |

---

## Categories (12)
All Products · SALE · Earrings · Bangles · Rings · Bracelets · Anklets · Ear/Nose Pin · Necklace Set · Neckpiece · Hipchain · Gifts

---

## Admin Panel
- Login with: `admin@nimoura.com` (any password)
- Add new products with image upload
- Delete existing products
- View all products with prices

---

## What's Working
- ✅ All navbar links navigate correctly
- ✅ Category filter tabs (all 12)
- ✅ Add to Cart from shop & product pages
- ✅ Cart badge updates live
- ✅ Cart page — increase/decrease qty, remove items
- ✅ Free shipping threshold (₹999)
- ✅ Checkout with form validation
- ✅ Order success confirmation
- ✅ Login / Register
- ✅ Admin: add product with image upload
- ✅ Admin: delete product
- ✅ Product detail with related products
- ✅ Newsletter subscribe
- ✅ Wishlist toggle on shop cards
- ✅ Responsive (mobile-friendly)

---

## Replace Images
Once you have your real photos, update `/src/data/products.js` — replace the Unsplash URLs with:
- Local: `import img from '../assets/your-image.jpg'` 
- Or just paste the URL if hosted online

## Connect Backend (Next Phase)
Replace dummy data in `products.js` with API calls to your Spring Boot backend.
Replace auth in `AuthContext.jsx` with JWT API calls.
