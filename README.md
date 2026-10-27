# Vue 3 + Vite

# TrailThrift

TrailThrift adalah website e-commerce yang menyediakan berbagai produk
outdoor dan produk thrift untuk kebutuhan hiking, camping, traveling,
dan aktivitas outdoor lainnya.

Project ini dibuat sebagai project pembelajaran sekaligus project
portfolio untuk mempelajari pengembangan website full-stack.

---

## 🚀 Teknologi yang Digunakan

### Frontend
- Vue.js
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- Vite

### Backend
- PHP
- Laravel

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Laragon

---

## 📁 Struktur Project

```text
trailthrift/
│
├── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── app/
    ├── database/
    ├── routes/
    ├── storage/
    ├── .env
    └── composer.json

⚙️ Setup Project
1. Membuat Folder Project

cd C:\Users\rizky\Desktop
mkdir trailthrift
cd trailthrift

2. Membuat Frontend
npm create vite@latest frontend

Pilih:

Framework: Vue
Variant: JavaScript

Kemudian masuk ke folder frontend:

cd frontend
npm install

Install Bootstrap dan Bootstrap Icons:
npm install bootstrap bootstrap-icons

Kembali ke folder utama:
cd ..

3. Membuat Backend

Buat project Laravel:
composer create-project laravel/laravel backend

▶️ Menjalankan Project
Frontend

Buka terminal:

cd C:\Users\rizky\Desktop\trailthrift\frontend
npm run dev

Frontend akan berjalan pada:

http://localhost:5173
Backend

Buka terminal baru:

cd C:\Users\rizky\Desktop\trailthrift\backend
php artisan serve

Backend akan berjalan pada:

http://127.0.0.1:8000

🛍️ Rencana Fitur
 Customer
 Homepage
 Daftar produk
 Detail produk
 Pencarian produk
 Filter produk
 Keranjang belanja
 Wishlist
 Checkout
 Login
 Register
 Riwayat pesanan
 Admin
 Dashboard admin
 Tambah produk
 Edit produk
 Hapus produk
 Upload gambar produk
 Manajemen kategori
 Manajemen stok
 Manajemen pesanan

============================================

🏕️ Kategori Produk

TrailThrift akan memiliki beberapa kategori produk seperti:

Hiking
Camping
Outdoor Gear
Jaket
Celana
Sepatu
Tas
Aksesoris
Produk Thrift
Dll

Produk thrift juga akan memiliki informasi kondisi barang,
ukuran, brand, stok, dan detail kekurangan apabila ada.

============================================

🗄️ Rencana Database

Database direncanakan memiliki beberapa tabel:

users
categories
products
product_images
carts
cart_items
orders
order_items
payments
addresses

Struktur database akan dikembangkan secara bertahap
sesuai kebutuhan aplikasi.

============================================

🔌 Rencana API

Beberapa endpoint yang akan dibuat:

GET    /api/products
GET    /api/products/{id}

POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}

POST   /api/login
POST   /api/register

GET    /api/cart
POST   /api/cart

POST   /api/orders
GET    /api/orders

API akan dibuat menggunakan Laravel dan digunakan oleh
frontend Vue.js untuk berkomunikasi dengan backend.

📊 Progress Development
Project Setup
[x] Membuat repository GitHub
[x] Membuat folder project
[x] Membuat frontend Vue.js
[x] Install dependencies frontend
[x] Install Bootstrap
[x] Membuat backend Laravel
[] Konfigurasi database
[] Membuat struktur frontend
[] Membuat desain homepage
[] Membuat API backend
[] Menghubungkan frontend dengan backend
[] Membuat sistem authentication
[] Membuat shopping cart
[] Membuat checkout
[] Membuat admin dashboard

============================================
📌 Status Project

Development

Project masih dalam tahap pengembangan dan akan dikembangkan
secara bertahap dari frontend, backend, database, hingga integrasi
seluruh sistem.

👨‍💻 Developer

Ahmad Rizky Saputra

Project pembelajaran dan portfolio
Teknik Informatika.



This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
