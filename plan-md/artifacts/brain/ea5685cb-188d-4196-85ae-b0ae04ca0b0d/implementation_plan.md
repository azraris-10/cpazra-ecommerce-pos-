# CPazra Outdoor & Thrifting E-Commerce & POS System

Complete full-stack frontend application for CPazra, an outdoor gear and thrift e-commerce platform with an integrated Point-of-Sale (POS) cashier interface and a comprehensive administrative management back-office, powered by a persistent reactive `localStorage` database.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during Phase 1 clarification:
> - **Navigation Architecture**: Top navigation bar switcher paired with dedicated login portals to seamlessly toggle between the Customer Storefront, POS Cashier console, and Admin Dashboard.
> - **Visual Identity & Theme**: Earthy outdoor aesthetic featuring deep forest green (`#1E3A2B`), rich amber gold (`#D97706` / `#F59E0B`), warm stone neutrals (`#F8F7F4` and `#EFECE6`), and rugged slate accents.
> - **Data Persistence Strategy**: Initialized on first visit with rich curated outdoor thrift items (including the featured Osprey Aether 65 Pack, North Face Gore-Tex jackets, Patagonia fleeces, and camping tents) complete with thrift condition grading, flaw descriptions, and inventory counters.

---

## 1. Overview & Core Concept

- **What It Does**: CPazra delivers a 3-in-1 unified web experience:
  1. **Customer Storefront**: Interactive product discovery with category tabs, condition grade filters (Grade A/B/C), detailed product pages with thrifting flaw breakdowns, cart calculation, wishlist, checkout flow with receipt generation, and customer reviews.
  2. **Point of Sale (POS) Cashier Interface**: A fast, touch-friendly cash register interface with SKU/name search, instant cart tally, cash/QRIS payment calculator with real-time change calculation, receipt printing, and daily shift cash tracking.
  3. **Admin Management Suite**: Full management dashboard for adding and editing thrifting items (with photos, condition notes, dimensions, and categories), managing orders, updating order fulfillment statuses, issuing discount vouchers, moderating customer reviews, and analyzing sales reports.
- **Target Audience / Persona**: Outdoor adventurers, hikers, campers, and eco-conscious thrift enthusiasts looking for authentic secondhand gear, along with store owners and retail cashiers managing inventory and walk-in sales.
- **Key Value**: Delivers an end-to-end e-commerce and retail POS workflow without requiring an active external backend, guaranteeing 100% functionality and persistence across page reloads.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Customer Shopping & Checkout**:
   - Landing on Beranda $\to$ explore interactive categories (Hiking, Camping, Outdoor Gear, Jaket, Tas, Sepatu) $\to$ filter catalog by grade/condition $\to$ open detail view (e.g. Osprey Aether 65 Pack) to inspect detailed condition photos and minus notes $\to$ Add to Cart $\to$ apply voucher code in cart drawer/page $\to$ proceed to multi-step Checkout $\to$ submit order and view formatted receipt with Order ID (`#CPZ-9825`).
2. **Admin Product Inventory Management**:
   - Access Admin Portal $\to$ navigate to Kelola Produk $\to$ click Tambah Produk $\to$ fill in product name, brand, retail vs thrift price, condition grade, detailed minus/flaws, size, stock, category, and photo URL $\to$ submit form $\to$ instantly updates `localStorage` and reflects in customer catalog and POS.
3. **POS Cashier Flow**:
   - Switch to POS mode $\to$ quick-search items or click category pills $\to$ adjust quantities $\to$ select payment method (Tunai / QRIS / Transfer) $\to$ enter nominal cash received $\to$ view change calculation $\to$ complete sale $\to$ auto-deducts stock and logs order to sales history.

### Visual Identity & Theme Tokens

- **Dominant Neutral Field (60%)**: Warm off-white canvas (`#F8F7F4`), clean white cards (`#FFFFFF`), with slate text (`#1F2937`) and muted metadata (`#6B7280`).
- **Structural Surfaces (30%)**: Deep alpine forest green (`#1E3A2B`) for top navigation headers, primary banners, and POS command bars; warm paper dividers (`#E5E2DC`).
- **Accent Budget (10%)**: Outdoor trail amber (`#D97706` / `#F59E0B`) and trail signal red (`#DC2626`) reserved strictly for action buttons, thrift badges, and checkout totals.
- **Typography**: Clean Plus Jakarta Sans / Inter font hierarchy with high-contrast display headings and tabular numerals (`tabular-nums`) for currency (IDR `Rp xxx.xxx`), inventory stock, and checkout calculations.
- **Anti-Slop Restraint**: Zero AI pill capsules on static metadata (clean `·` separators); no decorative pulsing green dots; no code comment headers (`//`); authentic human titles and real Indonesian e-commerce terminology.

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side Reactive Store (`localStorage` + Vue 3 Reactivity)**:
  - *Chosen Approach*: Centralized reactive state store (`src/services/store.js` using Vue 3 `reactive` / `ref` synchronized with `localStorage`).
  - *Why*: Provides instant reactivity between components (adding a product in Admin immediately updates the Store catalog and POS without page refresh) and survives browser reloads.
  - *Trade-off*: Local to the browser session, ideal for demo, evaluation, and standalone GitHub repos.
- **Single-Page Application Router Architecture**:
  - *Chosen Approach*: Lightweight client-side hash / state router with dedicated routes for Storefront (`home`, `catalog`, `product-detail`, `cart`, `checkout`, `wishlist`, `login`, `register`, `info-pages`), POS Cashier (`pos`), and Admin (`admin-dashboard`, `admin-products`, `admin-add-product`, `admin-edit-product`, `admin-orders`, `admin-vouchers`, `admin-reviews`, `admin-sales`, `admin-users`).
  - *Why*: Guarantees zero 404s on static hosting (GitHub Pages, Vercel, Netlify) and instant transitions.
- **Thrifting-Specific Data Schema**:
  - Every product contains specific thrifting attributes: `conditionGrade` (Grade S/A/B/C), `conditionNotes` ("Minus sablon retak halus", "Zipper original normal"), `originalRetailPrice` vs `thriftPrice`, `isThrift` (true/false), `size`, and `authenticityVerified` (true/false).

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CPazra Web App                                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │   Unified Global Top Bar & Mode Switcher                       │   │
│   │   [CPazra Outdoor] ── [Store | POS Kasir | Admin] ── [Cart/Auth│   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                │                                       │
│          ┌─────────────────────┼─────────────────────┐                 │
│          ▼                     ▼                     ▼                 │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐         │
│   │  Customer    │      │  Kasir (POS) │      │  Admin Suite │         │
│   │  Storefront  │      │  Interface   │      │  Dashboard   │         │
│   │              │      │              │      │              │         │
│   │ · Home       │      │ · Grid View  │      │ · Metrics    │         │
│   │ · Catalog    │      │ · Fast Tally │      │ · Products   │         │
│   │ · Detail PDP │      │ · Cash Calc  │      │ · Orders     │         │
│   │ · Cart/Order │      │ · Receipt    │      │ · Vouchers   │         │
│   │ · Wishlist   │      │ · Daily Log  │      │ · Reviews    │         │
│   └──────────────┘      └──────────────┘      └──────────────┘         │
│          │                     │                     │                 │
│          └─────────────────────┼─────────────────────┘                 │
│                                ▼                                       │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │            Centralized Reactive Repository                     │   │
│   │  · Products Collection (Thrift condition, prices, stock)       │   │
│   │  · Cart & Wishlist State (Active items, quantity counters)     │   │
│   │  · Orders & Transactions Ledger (Status, customer details)     │   │
│   │  · Promo Vouchers & Discount Engine                            │   │
│   │  · Customer Reviews & Ratings                                  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                │                                       │
│                                ▼                                       │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │        Browser `localStorage` Persistence Engine               │   │
│   │  `cpazra_products`, `cpazra_cart`, `cpazra_orders`, etc.       │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & State

- **Product**: `id`, `name`, `brand`, `category`, `price`, `originalPrice`, `stock`, `size`, `conditionGrade` ('A - Like New', 'B - Minor Flaw', etc.), `flawDetails`, `image`, `description`, `isFeatured`.
- **Order**: `id` (`CPZ-9825`), `items`, `customerName`, `customerPhone`, `address`, `paymentMethod`, `subtotal`, `discount`, `shippingFee`, `total`, `status` ('Pending', 'Diproses', 'Dikirim', 'Selesai'), `createdAt`.
- **CartItem**: `productId`, `name`, `price`, `image`, `size`, `quantity`.
- **Voucher**: `code` ('OUTDOOR20', 'THRIFT10'), `discountType` ('percent' | 'fixed'), `discountValue`, `minSpend`.
- **Review**: `id`, `productId`, `userName`, `rating` (1-5), `comment`, `date`.
