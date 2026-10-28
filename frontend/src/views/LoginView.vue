<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const activeAuthTab = ref(state.loginTargetTab || 'customer') // 'customer', 'admin', 'pos'
const isRegisterMode = ref(false)

watch(
  () => state.loginTargetTab,
  (newTab) => {
    if (newTab) activeAuthTab.value = newTab
  }
)

// Customer Login / Register Form
const customerForm = reactive({
  name: 'Ahmad Rizky',
  email: 'rizky.saputra@example.com',
  phone: '0812-3456-7890',
  password: 'password123'
})

// Admin Login Form
const adminForm = reactive({
  email: 'admin@cpazra.id',
  password: 'admin123'
})

function submitCustomerAuth() {
  if (isRegisterMode.value) {
    actions.registerCustomer({
      name: customerForm.name.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phone.trim(),
      password: customerForm.password
    })
  } else {
    actions.loginCustomer(customerForm.email.trim(), customerForm.password)
  }
}

function quickFillCustomer() {
  customerForm.email = 'rizky.saputra@example.com'
  customerForm.password = 'password123'
  isRegisterMode.value = false
}

function submitAdminAuth() {
  actions.loginAdmin(adminForm.email.trim(), adminForm.password.trim())
}

function quickFillAdmin() {
  adminForm.email = 'admin@cpazra.id'
  adminForm.password = 'admin123'
}

function chooseSubscription(planName, price) {
  actions.subscribePos(planName, price)
}
</script>

<template>
  <div class="py-5" style="background-color: #f4efe9; min-height: 85vh;">
    <div class="container max-w-4xl px-3 px-md-4">
      <!-- Portal Header -->
      <div class="text-center mb-4">
        <div class="d-inline-flex align-items-center justify-content-center bg-forest text-white rounded-3 px-3 py-2 fw-bold mb-2 shadow-sm" style="background-color: #1b3b2b;">
          <i class="bi bi-compass-fill text-warning me-2"></i> CPazra Portal Akses
        </div>
        <h2 class="fw-bold text-dark mb-1">Masuk ke Sistem CPazra</h2>
        <p class="text-muted small">Pilih peran login Anda di bawah ini:</p>
      </div>

      <!-- Segmented Auth Role Tabs -->
      <div class="card border-0 shadow-sm rounded-4 p-2 bg-white mb-4">
        <ul class="nav nav-pills nav-justified gap-2">
          <li class="nav-item">
            <button
              class="nav-link py-3 fw-bold rounded-3"
              :class="{ 'bg-forest text-white': activeAuthTab === 'customer', 'text-dark bg-light': activeAuthTab !== 'customer' }"
              @click="activeAuthTab = 'customer'"
            >
              <i class="bi bi-person-fill me-1"></i> Pelanggan (Pembeli)
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-3 fw-bold rounded-3"
              :class="{ 'bg-forest text-white': activeAuthTab === 'admin', 'text-dark bg-light': activeAuthTab !== 'admin' }"
              @click="activeAuthTab = 'admin'"
            >
              <i class="bi bi-shield-lock-fill me-1"></i> Admin & Owner Toko
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-3 fw-bold rounded-3"
              :class="{ 'bg-forest text-white': activeAuthTab === 'pos', 'text-dark bg-light': activeAuthTab !== 'pos' }"
              @click="activeAuthTab = 'pos'"
            >
              <i class="bi bi-calculator-fill me-1"></i> Kasir POS & Langganan
            </button>
          </li>
        </ul>
      </div>

      <!-- ============================================== -->
      <!-- TAB 1: CUSTOMER LOGIN & REGISTER -->
      <!-- ============================================== -->
      <div v-if="activeAuthTab === 'customer'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h4 class="fw-bold text-dark m-0">
              {{ isRegisterMode ? 'Daftar Akun Pelanggan CPazra' : 'Masuk ke Akun Pelanggan' }}
            </h4>
            <span class="text-muted small">
              {{ isRegisterMode ? 'Buat akun untuk melacak pesanan thrift dan menyimpan wishlist' : 'Gunakan akun Anda untuk berbelanja dan mengklaim kupon promo' }}
            </span>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="quickFillCustomer"
          >
            <i class="bi bi-lightning-charge text-warning"></i> Isi Akun Demo
          </button>
        </div>

        <form @submit.prevent="submitCustomerAuth" style="max-width: 520px; margin: 0 auto;">
          <div v-if="isRegisterMode" class="mb-3">
            <label class="form-label small fw-bold text-muted">Nama Lengkap</label>
            <input v-model="customerForm.name" type="text" class="form-control" placeholder="Contoh: Budi Santoso" required />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-muted">Alamat Email</label>
            <input v-model="customerForm.email" type="email" class="form-control" placeholder="nama@email.com" required />
          </div>

          <div v-if="isRegisterMode" class="mb-3">
            <label class="form-label small fw-bold text-muted">Nomor WhatsApp Aktif</label>
            <input v-model="customerForm.phone" type="tel" class="form-control" placeholder="0812-xxxx-xxxx" required />
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold text-muted">Password</label>
            <input v-model="customerForm.password" type="password" class="form-control" placeholder="••••••••" required />
          </div>

          <button type="submit" class="btn btn-forest w-100 py-3 fw-bold fs-6 shadow-sm mb-3">
            {{ isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Akun Pelanggan' }}
          </button>

          <div class="text-center small text-muted">
            <span v-if="!isRegisterMode">
              Belum punya akun CPazra?
              <a href="#" class="fw-bold text-forest text-decoration-none" @click.prevent="isRegisterMode = true">
                Daftar Akun Baru
              </a>
            </span>
            <span v-else>
              Sudah punya akun?
              <a href="#" class="fw-bold text-forest text-decoration-none" @click.prevent="isRegisterMode = false">
                Masuk di Sini
              </a>
            </span>
          </div>
        </form>
      </div>

      <!-- ============================================== -->
      <!-- TAB 2: ADMIN & OWNER LOGIN (Protected Gate) -->
      <!-- ============================================== -->
      <div v-else-if="activeAuthTab === 'admin'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="badge bg-danger">Khusus Pengelola</span>
              <h4 class="fw-bold text-dark m-0">Login Dashboard Admin</h4>
            </div>
            <span class="text-muted small">Akses back-office untuk manajemen produk, pesanan, dan keuangan toko</span>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-warning text-dark fw-bold"
            @click="quickFillAdmin"
          >
            <i class="bi bi-key-fill text-warning me-1"></i> Isi Akun Admin
          </button>
        </div>

        <div class="alert alert-warning border border-warning border-opacity-50 small mb-4">
          <i class="bi bi-info-circle-fill text-warning me-2"></i>
          <strong>Kredensial Demo Admin:</strong> Email: <code>admin@cpazra.id</code> · Password: <code>admin123</code>
        </div>

        <form @submit.prevent="submitAdminAuth" style="max-width: 480px; margin: 0 auto;">
          <div class="mb-3">
            <label class="form-label small fw-bold text-muted">Email Administrator</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="bi bi-person-badge"></i></span>
              <input v-model="adminForm.email" type="email" class="form-control" required />
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold text-muted">Password Administrator</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="bi bi-lock"></i></span>
              <input v-model="adminForm.password" type="password" class="form-control" required />
            </div>
          </div>

          <button type="submit" class="btn btn-warning text-dark w-100 py-3 fw-bold fs-6 shadow-sm mb-3">
            <i class="bi bi-box-arrow-in-right me-1"></i> Masuk ke Dashboard Admin
          </button>

          <div class="text-center text-muted small">
            <i class="bi bi-shield-check text-success me-1"></i> Dilengkapi otorisasi role-based access control.
          </div>
        </form>
      </div>

      <!-- ============================================== -->
      <!-- TAB 3: POS CASHIER & SUBSCRIPTION TIERS -->
      <!-- ============================================== -->
      <div v-else-if="activeAuthTab === 'pos'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <div class="text-center mb-4 border-bottom pb-3">
          <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 text-success fw-bold small mb-2">
            <i class="bi bi-calculator"></i> Add-on Point of Sale Retail
          </div>
          <h4 class="fw-bold text-dark mb-1">Sistem Kasir POS Toko Offline</h4>
          <p class="text-muted small m-0" style="max-width: 580px; margin: 0 auto;">
            Sistem kasir mandiri terintegrasi untuk toko fisik, bazar outdoor, atau showroom offline dengan cetak struk termal dan inventori real-time.
          </p>
        </div>

        <!-- Current Subscription Status -->
        <div class="p-3 bg-light rounded-3 border d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <div>
            <span class="text-muted small d-block">Status Langganan POS Anda:</span>
            <strong class="text-dark fs-6">{{ state.posSubscription.plan }}</strong>
            <span class="badge bg-success ms-2">Aktif s/d {{ state.posSubscription.expiresAt }}</span>
          </div>
          <button
            type="button"
            class="btn btn-forest fw-bold px-4"
            @click="actions.switchMode('pos')"
          >
            <i class="bi bi-display me-2"></i> Buka Terminal Kasir
          </button>
        </div>

        <!-- Pricing & Subscription Plans -->
        <h5 class="fw-bold text-dark mb-3">Pilihan Paket Berlangganan POS Kasir</h5>
        <div class="row g-3">
          <!-- Plan 1 -->
          <div class="col-md-6">
            <div class="card h-100 border rounded-3 p-4 bg-white cp-card-hover position-relative">
              <h5 class="fw-bold text-dark mb-1">Paket Toko Tunggal</h5>
              <p class="text-muted small mb-3">Cocok untuk 1 toko thrift outdoor offline</p>
              <div class="mb-3">
                <span class="fs-3 fw-bold text-success font-mono">Rp 99.000</span>
                <span class="text-muted small"> / bulan</span>
              </div>
              <ul class="list-unstyled small d-flex flex-column gap-2 text-secondary mb-4">
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> 1 Terminal Kasir POS</li>
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> Cetak Struk Bluetooth & USB</li>
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> Sinkronisasi Stok Toko Otomatis</li>
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> Laporan Transaksi Harian</li>
              </ul>
              <button
                type="button"
                class="btn btn-outline-forest fw-bold w-100 mt-auto"
                @click="chooseSubscription('Paket Toko Tunggal', 99000)"
              >
                Pilih Paket Ini
              </button>
            </div>
          </div>

          <!-- Plan 2 -->
          <div class="col-md-6">
            <div class="card h-100 border border-warning rounded-3 p-4 bg-white cp-card-hover position-relative shadow-sm">
              <span class="position-absolute top-0 end-0 badge bg-warning text-dark m-3">Rekomendasi</span>
              <h5 class="fw-bold text-dark mb-1">Paket Multi-Outlet Pro</h5>
              <p class="text-muted small mb-3">Untuk jaringan thrift store & event bazar</p>
              <div class="mb-3">
                <span class="fs-3 fw-bold text-success font-mono">Rp 199.000</span>
                <span class="text-muted small"> / bulan</span>
              </div>
              <ul class="list-unstyled small d-flex flex-column gap-2 text-secondary mb-4">
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> Unlimited Terminal Kasir</li>
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> Manajemen Shift & Karyawan Kasir</li>
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> Integrasi QRIS Dinamis & EDC</li>
                <li><i class="bi bi-check2 text-success fw-bold me-2"></i> Ekspor Laporan Excel/PDF Lengkap</li>
              </ul>
              <button
                type="button"
                class="btn btn-warning text-dark fw-bold w-100 mt-auto shadow-sm"
                @click="chooseSubscription('Paket Multi-Outlet Pro', 199000)"
              >
                Langganan Paket Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-forest {
  background-color: #1b3b2b !important;
}
.text-forest {
  color: #1b3b2b !important;
}
.btn-outline-forest {
  border-color: #1b3b2b;
  color: #1b3b2b;
}
.btn-outline-forest:hover {
  background-color: #1b3b2b;
  color: #ffffff;
}
</style>
