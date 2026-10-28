<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const activeTab = ref(
  state.currentView.startsWith('admin-')
    ? state.currentView.replace('admin-', '')
    : 'dashboard'
)

watch(
  () => state.currentView,
  (newView) => {
    if (newView.startsWith('admin-')) {
      activeTab.value = newView.replace('admin-', '')
    } else if (newView === 'admin') {
      activeTab.value = 'dashboard'
    }
  }
)

function setTab(tab) {
  activeTab.value = tab
  if (tab === 'dashboard') actions.navigate('admin')
  else actions.navigate(`admin-${tab}`)
}

// ------------------------------------
// TAB 1: Dashboard Metrics
// ------------------------------------
const totalRevenue = computed(() => {
  return state.orders.reduce((sum, o) => sum + (o.total || 0), 0)
})

const totalOrdersCount = computed(() => state.orders.length)
const totalProductsCount = computed(() => state.products.length)
const lowStockCount = computed(() => state.products.filter((p) => p.stock <= 1).length)

// ------------------------------------
// TAB 2: Tambah Produk (Requirement #1)
// ------------------------------------
const newProductForm = reactive({
  name: '',
  brand: 'The North Face',
  category: 'Jaket',
  price: '',
  originalPrice: '',
  stock: 1,
  size: 'L (P: 70cm x L: 58cm)',
  conditionGrade: 'Grade A',
  flawDetails: 'Minus pemakaian wajar, zipper dan sablon aman.',
  image: '/images/product_northface_jacket.jpg',
  description: 'Jaket thrift outdoor original terkurasi siap pakai mendaki.'
})

const imagePreview = ref('/images/product_northface_jacket.jpg')

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newProductForm.image = e.target.result
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function handleAddProductSubmit() {
  if (!newProductForm.name.trim() || !newProductForm.price) {
    actions.showToast('Harap isi nama produk dan harga thrift!', 'warning')
    return
  }

  const added = actions.addProduct({
    name: newProductForm.name,
    brand: newProductForm.brand,
    category: newProductForm.category,
    price: Number(newProductForm.price),
    originalPrice: Number(newProductForm.originalPrice) || Number(newProductForm.price) * 2,
    stock: Number(newProductForm.stock) || 1,
    size: newProductForm.size,
    conditionGrade: newProductForm.conditionGrade,
    flawDetails: newProductForm.flawDetails,
    image: newProductForm.image || '/images/product_northface_jacket.jpg',
    description: newProductForm.description
  })

  // Reset form
  newProductForm.name = ''
  newProductForm.price = ''
  newProductForm.originalPrice = ''
  newProductForm.flawDetails = 'Minus pemakaian wajar, zipper dan sablon aman.'

  // Jump to catalog to show real-time inclusion
  actions.navigate('catalog')
}

// ------------------------------------
// TAB 3: Edit Produk
// ------------------------------------
const editingProductId = ref(state.products[0]?.id || '')
const editForm = reactive({
  id: '',
  name: '',
  brand: '',
  category: '',
  price: 0,
  originalPrice: 0,
  stock: 1,
  size: '',
  conditionGrade: '',
  flawDetails: '',
  image: '',
  description: ''
})

watch(
  editingProductId,
  (id) => {
    const prod = state.products.find((p) => p.id === id)
    if (prod) {
      editForm.id = prod.id
      editForm.name = prod.name
      editForm.brand = prod.brand
      editForm.category = prod.category
      editForm.price = prod.price
      editForm.originalPrice = prod.originalPrice
      editForm.stock = prod.stock
      editForm.size = prod.size
      editForm.conditionGrade = prod.conditionGrade
      editForm.flawDetails = prod.flawDetails
      editForm.image = prod.image
      editForm.description = prod.description
    }
  },
  { immediate: true }
)

function handleUpdateProduct() {
  actions.updateProduct(editForm.id, editForm)
  setTab('products')
}

// ------------------------------------
// TAB 4: Kelola Pesanan & Detail #CPZ-9825
// ------------------------------------
const selectedOrder = ref(null)

function viewOrderDetail(order) {
  selectedOrder.value = order
}

// ------------------------------------
// TAB 5: Voucher Management
// ------------------------------------
const newVoucherCode = ref('')
const newVoucherPercent = ref(15)
const newVoucherMin = ref(200000)

function createVoucher() {
  if (!newVoucherCode.value.trim()) return
  state.vouchers.push({
    id: `vouch-${Date.now()}`,
    code: newVoucherCode.value.trim().toUpperCase(),
    title: `Promo Diskon ${newVoucherPercent.value}%`,
    discountType: 'percent',
    discountValue: Number(newVoucherPercent.value),
    maxDiscount: 100000,
    minSpend: Number(newVoucherMin.value),
    expiresAt: '31 Des 2026',
    isActive: true
  })
  actions.showToast(`Voucher ${newVoucherCode.value.toUpperCase()} berhasil dibuat!`, 'success')
  newVoucherCode.value = ''
}

function getGradeClass(grade) {
  if (grade.includes('Grade S')) return 'grade-badge-s'
  if (grade.includes('Grade A')) return 'grade-badge-a'
  if (grade.includes('Grade B')) return 'grade-badge-b'
  return 'grade-badge-c'
}

const adminGateEmail = ref('admin@cpazra.id')
const adminGatePassword = ref('admin123')

function handleAdminGateLogin() {
  actions.loginAdmin(adminGateEmail.value.trim(), adminGatePassword.value.trim())
}
</script>

<template>
  <!-- IF NOT AUTHENTICATED AS ADMIN: SHOW LOGIN GATE -->
  <div v-if="!state.isAdminAuthenticated" class="py-5" style="background-color: #f4efe9; min-height: 85vh;">
    <div class="container max-w-md px-3" style="max-width: 480px; margin: 0 auto;">
      <div class="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white text-center">
        <div class="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-3 mx-auto mb-3" style="width: 68px; height: 68px;">
          <i class="bi bi-shield-lock-fill fs-1"></i>
        </div>
        <h4 class="fw-bold text-dark mb-1">Akses Khusus Administrator</h4>
        <p class="text-muted small mb-4">
          Halaman Admin Panel diproteksi. Masukkan kredensial admin untuk mengakses dashboard, katalog produk, dan laporan keuangan.
        </p>

        <div class="alert alert-light border small text-start mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <span><strong>Kredensial Demo:</strong> admin@cpazra.id / admin123</span>
            <button type="button" class="btn btn-sm btn-outline-warning text-dark py-0 px-2 fw-bold" @click="adminGateEmail = 'admin@cpazra.id'; adminGatePassword = 'admin123'">
              Isi Otomatis
            </button>
          </div>
        </div>

        <form @submit.prevent="handleAdminGateLogin" class="text-start">
          <div class="mb-3">
            <label class="form-label small fw-bold text-muted">Email Administrator</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="bi bi-person-badge"></i></span>
              <input v-model="adminGateEmail" type="email" class="form-control" required />
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label small fw-bold text-muted">Password Administrator</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted"><i class="bi bi-lock"></i></span>
              <input v-model="adminGatePassword" type="password" class="form-control" required />
            </div>
          </div>
          <button type="submit" class="btn btn-warning text-dark w-100 py-3 fw-bold fs-6 shadow-sm mb-3">
            <i class="bi bi-box-arrow-in-right me-1"></i> Buka Admin Panel
          </button>
          <div class="text-center">
            <button type="button" class="btn btn-link text-secondary text-decoration-none btn-sm" @click="actions.switchMode('store')">
              <i class="bi bi-arrow-left me-1"></i> Kembali ke Toko Online
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- IF AUTHENTICATED: SHOW ADMIN MANAGEMENT SUITE -->
  <div v-else class="py-4" style="background-color: #f4efe9; min-height: 85vh;">
    <div class="container-fluid max-w-7xl px-3 px-md-4">
      <!-- Admin Top Banner -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <div class="d-flex align-items-center gap-2 mb-1">
            <span class="badge bg-dark text-warning px-2 py-1">CPazra Admin Back-Office</span>
            <span class="text-muted small">Showroom & E-Commerce Control Center</span>
          </div>
          <h1 class="fw-bold text-dark m-0" style="font-size: 1.85rem; letter-spacing: -0.02em;">
            Pusat Kendali Toko Thrift & POS
          </h1>
        </div>

        <div class="d-flex gap-2">
          <button type="button" class="btn btn-warning text-dark btn-sm fw-bold shadow-sm" @click="setTab('add')">
            <i class="bi bi-plus-circle me-1"></i> Tambah Produk Baru
          </button>
          <button type="button" class="btn btn-outline-dark btn-sm fw-semibold" @click="actions.switchMode('store')">
            <i class="bi bi-shop me-1"></i> Buka Toko
          </button>
          <button type="button" class="btn btn-outline-danger btn-sm fw-semibold" @click="actions.logoutAdmin()">
            <i class="bi bi-box-arrow-right me-1"></i> Logout Admin
          </button>
        </div>
      </div>

      <!-- Navigation Tabs Strip -->
      <div class="card border-0 shadow-sm rounded-4 mb-4 bg-white p-2">
        <ul class="nav nav-pills gap-1 flex-nowrap overflow-x-auto">
          <li class="nav-item">
            <button
              class="nav-link py-2 px-3 fw-bold text-nowrap"
              :class="{ 'active bg-forest text-white': activeTab === 'dashboard', 'text-secondary': activeTab !== 'dashboard' }"
              @click="setTab('dashboard')"
            >
              <i class="bi bi-grid-1x2 me-1"></i> Dashboard
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-2 px-3 fw-bold text-nowrap"
              :class="{ 'active bg-forest text-white': activeTab === 'products', 'text-secondary': activeTab !== 'products' }"
              @click="setTab('products')"
            >
              <i class="bi bi-box-seam me-1"></i> Kelola Produk ({{ state.products.length }})
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-2 px-3 fw-bold text-nowrap"
              :class="{ 'active bg-forest text-white': activeTab === 'add', 'text-secondary': activeTab !== 'add' }"
              @click="setTab('add')"
            >
              <i class="bi bi-plus-square me-1"></i> Tambah Produk
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-2 px-3 fw-bold text-nowrap"
              :class="{ 'active bg-forest text-white': activeTab === 'orders', 'text-secondary': activeTab !== 'orders' }"
              @click="setTab('orders')"
            >
              <i class="bi bi-receipt me-1"></i> Kelola Pesanan ({{ state.orders.length }})
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-2 px-3 fw-bold text-nowrap"
              :class="{ 'active bg-forest text-white': activeTab === 'vouchers', 'text-secondary': activeTab !== 'vouchers' }"
              @click="setTab('vouchers')"
            >
              <i class="bi bi-ticket-perforated me-1"></i> Voucher & Promo
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-2 px-3 fw-bold text-nowrap"
              :class="{ 'active bg-forest text-white': activeTab === 'reviews', 'text-secondary': activeTab !== 'reviews' }"
              @click="setTab('reviews')"
            >
              <i class="bi bi-star me-1"></i> Review Pembeli
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link py-2 px-3 fw-bold text-nowrap"
              :class="{ 'active bg-forest text-white': activeTab === 'sales', 'text-secondary': activeTab !== 'sales' }"
              @click="setTab('sales')"
            >
              <i class="bi bi-graph-up me-1"></i> Laporan Omset
            </button>
          </li>
        </ul>
      </div>

      <!-- ============================================== -->
      <!-- TAB 1: DASHBOARD -->
      <!-- ============================================== -->
      <div v-if="activeTab === 'dashboard'">
        <!-- 4 KPI Metrics -->
        <div class="row g-3 mb-4">
          <div class="col-lg-3 col-md-6 col-6">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small fw-bold text-uppercase">Total Omset Penjualan</span>
                <div class="p-2 bg-success bg-opacity-10 text-success rounded-3 fs-5">
                  <i class="bi bi-cash-stack"></i>
                </div>
              </div>
              <h4 class="fw-bold text-dark font-mono m-0">{{ formatIDR(totalRevenue) }}</h4>
              <span class="text-muted small mt-1 d-block" style="font-size: 0.72rem;">Online + Terminal POS</span>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 col-6">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small fw-bold text-uppercase">Total Transaksi</span>
                <div class="p-2 bg-primary bg-opacity-10 text-primary rounded-3 fs-5">
                  <i class="bi bi-receipt"></i>
                </div>
              </div>
              <h4 class="fw-bold text-dark font-mono m-0">{{ totalOrdersCount }} Pesanan</h4>
              <span class="text-muted small mt-1 d-block" style="font-size: 0.72rem;">100% Tercatat di localStorage</span>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 col-6">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small fw-bold text-uppercase">Produk Thrift Aktif</span>
                <div class="p-2 bg-warning bg-opacity-10 text-warning rounded-3 fs-5">
                  <i class="bi bi-boxes"></i>
                </div>
              </div>
              <h4 class="fw-bold text-dark font-mono m-0">{{ totalProductsCount }} SKU</h4>
              <span class="text-muted small mt-1 d-block" style="font-size: 0.72rem;">Terkurasi & Siap Kirim</span>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 col-6">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small fw-bold text-uppercase">Item Stok 1 Pcs</span>
                <div class="p-2 bg-danger bg-opacity-10 text-danger rounded-3 fs-5">
                  <i class="bi bi-exclamation-triangle"></i>
                </div>
              </div>
              <h4 class="fw-bold text-dark font-mono m-0">{{ lowStockCount }} Item</h4>
              <span class="text-muted small mt-1 d-block" style="font-size: 0.72rem;">Khas Thrift One-of-a-Kind</span>
            </div>
          </div>
        </div>

        <!-- Recent Orders & Fast Actions -->
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold text-dark m-0">Pesanan Masuk Terbaru</h5>
                <button type="button" class="btn btn-link text-forest fw-bold text-decoration-none btn-sm" @click="setTab('orders')">
                  Lihat Semua
                </button>
              </div>

              <div class="table-responsive">
                <table class="table table-hover align-middle small">
                  <thead class="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Pelanggan</th>
                      <th>Total</th>
                      <th>Metode</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ord in state.orders.slice(0, 5)" :key="ord.id">
                      <td class="fw-bold font-mono">#{{ ord.id }}</td>
                      <td>{{ ord.customer.name }}</td>
                      <td class="font-mono fw-bold text-success">{{ formatIDR(ord.total) }}</td>
                      <td>{{ ord.paymentMethod }}</td>
                      <td>
                        <span class="badge" :class="ord.status === 'Selesai' ? 'bg-success' : 'bg-warning text-dark'">
                          {{ ord.status }}
                        </span>
                      </td>
                      <td>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="viewOrderDetail(ord); setTab('orders');">
                          Detail
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 class="fw-bold text-dark mb-3">Aksi Cepat Admin</h5>
              <div class="d-flex flex-column gap-2 mb-4">
                <button type="button" class="btn btn-forest fw-bold py-2 text-start" @click="setTab('add')">
                  <i class="bi bi-plus-circle me-2"></i> Tambah Produk Thrift Baru
                </button>
                <button type="button" class="btn btn-outline-dark fw-bold py-2 text-start" @click="actions.switchMode('pos')">
                  <i class="bi bi-calculator me-2"></i> Buka Terminal POS Kasir
                </button>
                <button type="button" class="btn btn-outline-secondary py-2 text-start" @click="setTab('vouchers')">
                  <i class="bi bi-ticket-perforated me-2"></i> Terbitkan Kode Voucher Baru
                </button>
                <button type="button" class="btn btn-outline-danger py-2 text-start" @click="actions.resetSampleData()">
                  <i class="bi bi-arrow-clockwise me-2"></i> Reset Data Sampel Default
                </button>
              </div>

              <div class="alert alert-light border small text-muted mb-0">
                <strong>Tips Thrifting:</strong> Selalu periksa resleting dan kelengkapan strap sebelum memotret produk untuk memastikan deskripsi grade 100% akurat.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 2: TAMBAH PRODUK (Requirement #1) -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'add'">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div class="border-bottom pb-3 mb-4">
            <h4 class="fw-bold text-dark m-0">Tambah Produk Thrift Baru</h4>
            <p class="text-muted small m-0">
              Data yang dimasukkan akan otomatis tersimpan ke <code>localStorage</code> dan langsung muncul di halaman Katalog Produk secara real-time.
            </p>
          </div>

          <form @submit.prevent="handleAddProductSubmit">
            <div class="row g-4">
              <!-- Col Left: Main Info -->
              <div class="col-lg-8">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label small fw-bold text-dark">Nama Produk Thrift *</label>
                    <input
                      v-model="newProductForm.name"
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="Contoh: Arc'teryx Gamma MX Hoody Vintage"
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Merk / Brand *</label>
                    <input
                      v-model="newProductForm.brand"
                      type="text"
                      class="form-control"
                      placeholder="Contoh: Arc'teryx, The North Face, Osprey..."
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Kategori *</label>
                    <select v-model="newProductForm.category" class="form-select">
                      <option value="Jaket">Jaket & Windbreaker</option>
                      <option value="Tas">Carrier & Tas</option>
                      <option value="Sepatu">Sepatu Trail & Trekking</option>
                      <option value="Camping">Tenda & Camping Gear</option>
                      <option value="Outdoor Gear">Aksesoris & Outdoor Gear</option>
                    </select>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label small fw-bold text-dark">Harga Thrift (Dijual) *</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">Rp</span>
                      <input
                        v-model.number="newProductForm.price"
                        type="number"
                        step="1000"
                        class="form-control font-mono fw-bold"
                        placeholder="750000"
                        required
                      />
                    </div>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label small fw-bold text-muted">Harga Asli / Retail Baru</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">Rp</span>
                      <input
                        v-model.number="newProductForm.originalPrice"
                        type="number"
                        step="1000"
                        class="form-control font-mono"
                        placeholder="2200000"
                      />
                    </div>
                  </div>

                  <div class="col-md-4">
                    <label class="form-label small fw-bold text-dark">Jumlah Stok</label>
                    <input
                      v-model.number="newProductForm.stock"
                      type="number"
                      min="1"
                      class="form-control font-mono"
                      placeholder="1"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Ukuran / Size / Dimensi</label>
                    <input
                      v-model="newProductForm.size"
                      type="text"
                      class="form-control"
                      placeholder="Contoh: L (P: 72cm x L: 60cm) atau 65L"
                    />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-dark">Grade Kondisi Thrift *</label>
                    <select v-model="newProductForm.conditionGrade" class="form-select">
                      <option value="Grade S">Grade S - Like New / Sangat Istimewa (9.5 - 10/10)</option>
                      <option value="Grade A">Grade A - Mulus Terawat (8.5 - 9.4/10)</option>
                      <option value="Grade B">Grade B - Minus Ringan Pemakaian (7.5 - 8.4/10)</option>
                      <option value="Grade C">Grade C - Butuh Servis / Proyek (Di bawah 7.5)</option>
                    </select>
                  </div>

                  <div class="col-12">
                    <label class="form-label small fw-bold text-danger">Catatan Detail Minus / Cacat Fisik *</label>
                    <textarea
                      v-model="newProductForm.flawDetails"
                      rows="2"
                      class="form-control"
                      placeholder="Contoh: Sablon dada sedikit retak halus, ada goresan kecil di buckle tas, resleting semua lancar..."
                      required
                    ></textarea>
                  </div>

                  <div class="col-12">
                    <label class="form-label small fw-bold text-dark">Deskripsi Lengkap Produk</label>
                    <textarea
                      v-model="newProductForm.description"
                      rows="3"
                      class="form-control"
                      placeholder="Tuliskan spesifikasi bahan, kelebihan, dan kecocokan penggunaan produk..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Col Right: Photo Upload & Preview -->
              <div class="col-lg-4">
                <div class="card border p-3 rounded-3 bg-light">
                  <label class="form-label small fw-bold text-dark">Foto Produk Thrift</label>

                  <!-- Image Preview Box -->
                  <div class="rounded-3 overflow-hidden border mb-3 position-relative" style="height: 240px; background: #e5e0d8;">
                    <img :src="imagePreview" alt="Preview Foto" class="w-100 h-100 object-fit-cover" />
                    <span class="position-absolute top-2 start-2" :class="getGradeClass(newProductForm.conditionGrade)">
                      {{ newProductForm.conditionGrade }}
                    </span>
                  </div>

                  <!-- Upload Local File -->
                  <div class="mb-3">
                    <label class="form-label small text-muted">Upload File dari Komputer / HP</label>
                    <input type="file" accept="image/*" class="form-control form-control-sm" @change="handleFileUpload" />
                  </div>

                  <!-- Quick Choose Generated Samples -->
                  <div>
                    <label class="form-label small text-muted">Atau Pilih Sampel Studio CPazra:</label>
                    <div class="d-flex gap-2">
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm p-1"
                        style="width: 50px; height: 50px;"
                        @click="newProductForm.image = '/images/product_northface_jacket.jpg'; imagePreview = '/images/product_northface_jacket.jpg'"
                      >
                        <img src="/images/product_northface_jacket.jpg" class="w-100 h-100 object-fit-cover rounded-1" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm p-1"
                        style="width: 50px; height: 50px;"
                        @click="newProductForm.image = '/images/product_patagonia_fleece.jpg'; imagePreview = '/images/product_patagonia_fleece.jpg'"
                      >
                        <img src="/images/product_patagonia_fleece.jpg" class="w-100 h-100 object-fit-cover rounded-1" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm p-1"
                        style="width: 50px; height: 50px;"
                        @click="newProductForm.image = '/images/product_osprey_backpack.jpg'; imagePreview = '/images/product_osprey_backpack.jpg'"
                      >
                        <img src="/images/product_osprey_backpack.jpg" class="w-100 h-100 object-fit-cover rounded-1" />
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm p-1"
                        style="width: 50px; height: 50px;"
                        @click="newProductForm.image = '/images/product_salomon_shoes.jpg'; imagePreview = '/images/product_salomon_shoes.jpg'"
                      >
                        <img src="/images/product_salomon_shoes.jpg" class="w-100 h-100 object-fit-cover rounded-1" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <button type="submit" class="btn btn-warning text-dark w-100 py-3 fw-bold fs-6 shadow-sm">
                    <i class="bi bi-save me-2"></i> Simpan ke Katalog & localStorage
                  </button>
                  <button type="button" class="btn btn-link text-secondary w-100 mt-2 text-decoration-none" @click="setTab('products')">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 3: KELOLA PRODUK -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'products'">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 class="fw-bold text-dark m-0">Katalog Produk Terdaftar ({{ state.products.length }})</h5>
              <span class="text-muted small">Semua produk tersimpan di localStorage browser</span>
            </div>
            <button type="button" class="btn btn-forest fw-bold btn-sm" @click="setTab('add')">
              <i class="bi bi-plus-circle me-1"></i> Tambah Produk
            </button>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle small">
              <thead class="table-light">
                <tr>
                  <th>Foto</th>
                  <th>SKU / Nama</th>
                  <th>Kategori</th>
                  <th>Grade</th>
                  <th>Harga Thrift</th>
                  <th>Stok</th>
                  <th class="text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in state.products" :key="p.id">
                  <td>
                    <img :src="p.image" class="rounded-2 object-fit-cover border" style="width: 48px; height: 48px;" />
                  </td>
                  <td>
                    <div class="fw-bold text-dark">{{ p.name }}</div>
                    <span class="text-muted" style="font-size: 0.72rem;">{{ p.sku }} · {{ p.brand }}</span>
                  </td>
                  <td>{{ p.category }}</td>
                  <td>
                    <span :class="getGradeClass(p.conditionGrade)" style="font-size: 0.7rem;">
                      {{ p.conditionGrade }}
                    </span>
                  </td>
                  <td class="font-mono fw-bold text-success">{{ formatIDR(p.price) }}</td>
                  <td>
                    <span class="badge" :class="p.stock <= 1 ? 'bg-danger' : 'bg-light text-dark border'">
                      {{ p.stock }} Pcs
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        title="Lihat Halaman Produk"
                        @click="actions.navigate('detail', { productId: p.id })"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-primary"
                        title="Edit Produk"
                        @click="editingProductId = p.id; setTab('edit');"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        title="Hapus Produk"
                        @click="actions.deleteProduct(p.id)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB: EDIT PRODUK -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'edit'">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
              <h4 class="fw-bold text-dark m-0">Edit Produk Thrift</h4>
              <p class="text-muted small m-0">Perbarui informasi harga, stok, grade, atau catatan minus produk.</p>
            </div>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="setTab('products')">
              Kembali
            </button>
          </div>

          <form @submit.prevent="handleUpdateProduct">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold">Nama Produk</label>
                <input v-model="editForm.name" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Brand</label>
                <input v-model="editForm.brand" type="text" class="form-control" required />
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold">Harga Thrift</label>
                <input v-model.number="editForm.price" type="number" class="form-control font-mono" required />
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold">Harga Retail Baru</label>
                <input v-model.number="editForm.originalPrice" type="number" class="form-control font-mono" />
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold">Stok</label>
                <input v-model.number="editForm.stock" type="number" min="0" class="form-control font-mono" />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Grade Kondisi</label>
                <select v-model="editForm.conditionGrade" class="form-select">
                  <option value="Grade S">Grade S</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Grade C">Grade C</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Ukuran / Size</label>
                <input v-model="editForm.size" type="text" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label small fw-bold text-danger">Catatan Minus / Cacat</label>
                <textarea v-model="editForm.flawDetails" rows="2" class="form-control"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label small fw-bold">Deskripsi</label>
                <textarea v-model="editForm.description" rows="3" class="form-control"></textarea>
              </div>
              <div class="col-12 mt-3">
                <button type="submit" class="btn btn-warning text-dark fw-bold px-4">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 4: KELOLA PESANAN (Screen 7 & 8) -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'orders'">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold text-dark m-0">Daftar Seluruh Pesanan ({{ state.orders.length }})</h5>
            <span class="text-muted small">Termasuk Pesanan #CPZ-9825</span>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle small">
              <thead class="table-light">
                <tr>
                  <th>No. Order</th>
                  <th>Tanggal</th>
                  <th>Pelanggan</th>
                  <th>Total</th>
                  <th>Metode</th>
                  <th>Status Pesanan</th>
                  <th>Ubah Status</th>
                  <th class="text-end">Rincian</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ord in state.orders" :key="ord.id">
                  <td class="fw-bold font-mono">#{{ ord.id }}</td>
                  <td>{{ new Date(ord.createdAt).toLocaleDateString('id-ID') }}</td>
                  <td>{{ ord.customer.name }}</td>
                  <td class="font-mono fw-bold text-success">{{ formatIDR(ord.total) }}</td>
                  <td>{{ ord.paymentMethod }}</td>
                  <td>
                    <span class="badge" :class="ord.status === 'Selesai' ? 'bg-success' : 'bg-warning text-dark'">
                      {{ ord.status }}
                    </span>
                  </td>
                  <td>
                    <select
                      :value="ord.status"
                      class="form-select form-select-sm"
                      style="width: 130px; font-size: 0.75rem;"
                      @change="actions.updateOrderStatus(ord.id, $event.target.value)"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </td>
                  <td class="text-end">
                    <button type="button" class="btn btn-sm btn-outline-dark" @click="viewOrderDetail(ord)">
                      <i class="bi bi-eye me-1"></i> Buka
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detail Pesanan Modal / Panel (Screen 8) -->
        <div v-if="selectedOrder" class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <h5 class="fw-bold text-dark m-0">
              <i class="bi bi-box-seam text-warning me-2"></i> Detail Pesanan #{{ selectedOrder.id }}
            </h5>
            <button type="button" class="btn-close" @click="selectedOrder = null"></button>
          </div>

          <div class="row g-4">
            <div class="col-md-6">
              <h6 class="fw-bold text-dark mb-2">Informasi Pembeli</h6>
              <div class="p-3 bg-light rounded-3 small">
                <div class="mb-1"><strong>Nama:</strong> {{ selectedOrder.customer.name }}</div>
                <div class="mb-1"><strong>WhatsApp:</strong> {{ selectedOrder.customer.phone }}</div>
                <div class="mb-1"><strong>Alamat:</strong> {{ selectedOrder.customer.address }}, {{ selectedOrder.customer.city }}</div>
                <div class="mb-1"><strong>Kurir:</strong> {{ selectedOrder.shippingCourier }}</div>
                <div v-if="selectedOrder.trackingNumber"><strong>No. Resi:</strong> <span class="font-mono text-primary">{{ selectedOrder.trackingNumber }}</span></div>
              </div>
            </div>

            <div class="col-md-6">
              <h6 class="fw-bold text-dark mb-2">Item Belanja</h6>
              <div class="p-3 bg-light rounded-3 small">
                <div v-for="it in selectedOrder.items" :key="it.productId" class="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-25">
                  <span>{{ it.name }} (x{{ it.quantity }})</span>
                  <span class="font-mono fw-bold">{{ formatIDR(it.price * it.quantity) }}</span>
                </div>
                <div class="d-flex justify-content-between pt-2 fw-bold text-success fs-6">
                  <span>Total Tagihan:</span>
                  <span class="font-mono">{{ formatIDR(selectedOrder.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 5: VOUCHER & PROMO -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'vouchers'">
        <div class="row g-4">
          <div class="col-lg-5">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 class="fw-bold text-dark mb-3">Buat Voucher Promo Baru</h5>
              <form @submit.prevent="createVoucher">
                <div class="mb-3">
                  <label class="form-label small fw-bold">Kode Voucher (Kapital)</label>
                  <input v-model="newVoucherCode" type="text" class="form-control text-uppercase" placeholder="Contoh: RINJANI15" required />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">Diskon Persen (%)</label>
                  <input v-model.number="newVoucherPercent" type="number" min="1" max="50" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">Minimal Belanja (Rp)</label>
                  <input v-model.number="newVoucherMin" type="number" step="10000" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-forest fw-bold w-100">
                  <i class="bi bi-plus-circle me-1"></i> Terbitkan Voucher
                </button>
              </form>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 class="fw-bold text-dark mb-3">Voucher Aktif di Toko</h5>
              <div class="table-responsive">
                <table class="table align-middle small">
                  <thead class="table-light">
                    <tr>
                      <th>Kode</th>
                      <th>Diskon</th>
                      <th>Min. Belanja</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="v in state.vouchers" :key="v.id">
                      <td><span class="badge bg-warning text-dark font-mono fs-6">{{ v.code }}</span></td>
                      <td>{{ v.discountType === 'percent' ? `${v.discountValue}%` : formatIDR(v.discountValue) }}</td>
                      <td>{{ formatIDR(v.minSpend) }}</td>
                      <td><span class="badge bg-success">Aktif</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 6: REVIEW PEMBELI -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'reviews'">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold text-dark mb-3">Ulasan Produk dari Pelanggan</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle small">
              <thead class="table-light">
                <tr>
                  <th>Produk</th>
                  <th>Nama Pengulas</th>
                  <th>Bintang</th>
                  <th>Komentar</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rev in state.reviews" :key="rev.id">
                  <td class="fw-bold">{{ state.products.find(p => p.id === rev.productId)?.name || 'Produk Thrift' }}</td>
                  <td>{{ rev.userName }}</td>
                  <td class="text-warning">
                    <i v-for="i in rev.rating" :key="i" class="bi bi-star-fill"></i>
                  </td>
                  <td style="max-width: 300px;">{{ rev.comment }}</td>
                  <td class="text-muted">{{ rev.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 7: LAPORAN PENJUALAN -->
      <!-- ============================================== -->
      <div v-else-if="activeTab === 'sales'">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 class="fw-bold text-dark m-0">Ringkasan Laporan Keuangan & Penjualan</h5>
              <span class="text-muted small">Semua data terakumulasi secara otomatis</span>
            </div>
            <button type="button" class="btn btn-outline-dark btn-sm fw-bold" onclick="window.print()">
              <i class="bi bi-printer me-1"></i> Cetak Laporan
            </button>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="p-3 bg-light rounded-3 text-center">
                <span class="text-muted small">Total Pendapatan Kotor</span>
                <h4 class="fw-bold text-success font-mono m-0 mt-1">{{ formatIDR(totalRevenue) }}</h4>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 bg-light rounded-3 text-center">
                <span class="text-muted small">Total Barang Terjual</span>
                <h4 class="fw-bold text-dark font-mono m-0 mt-1">
                  {{ state.orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0) }} Unit
                </h4>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 bg-light rounded-3 text-center">
                <span class="text-muted small">Rata-rata Nilai Transaksi</span>
                <h4 class="fw-bold text-primary font-mono m-0 mt-1">
                  {{ formatIDR(totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0) }}
                </h4>
              </div>
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
</style>
