<script setup>
import { computed, reactive, ref } from 'vue'
import { state, actions, cartItemCount, cartSubtotal, cartDiscount, cartTotal, formatIDR } from '../services/store'

const form = reactive({
  name: state.currentUser.name || 'Ahmad Rizky',
  phone: '0812-3456-7890',
  email: state.currentUser.email || 'rizky.saputra@example.com',
  address: 'Jl. Merbabu No. 14, Lowokwaru',
  city: 'Kota Malang, Jawa Timur',
  postalCode: '65141',
  notes: 'Tolong packing bubble wrap tebal untuk tas carrier',
  courier: 'JNE Reguler',
  paymentMethod: 'QRIS Instant'
})

const isSubmitting = ref(false)

const shippingFee = computed(() => {
  if (form.courier === 'Ambil di Toko Offline') return 0
  if (form.courier === 'JNE YES Kilat') return 45000
  if (form.courier === 'SiCepat BEST') return 28000
  return 25000 // JNE Reguler
})

const grandTotal = computed(() => {
  return cartTotal.value + shippingFee.value
})

function submitCheckout() {
  if (!form.name || !form.phone || !form.address || !form.city) {
    actions.showToast('Harap lengkapi nama, nomor telepon, dan alamat pengiriman!', 'warning')
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    actions.createOrder({
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      notes: form.notes,
      courier: form.courier,
      shippingFee: shippingFee.value,
      paymentMethod: form.paymentMethod
    })
    isSubmitting.value = false
  }, 400)
}
</script>

<template>
  <div class="py-4" style="background-color: #fbf9f6; min-height: 80vh;">
    <div class="container max-w-7xl px-3 px-md-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="cp-breadcrumb mb-3 small">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item"><a href="#" @click.prevent="actions.navigate('home')">Beranda</a></li>
          <li class="breadcrumb-item"><a href="#" @click.prevent="actions.navigate('cart')">Keranjang</a></li>
          <li class="breadcrumb-item active text-secondary" aria-current="page">Pembayaran & Checkout</li>
        </ol>
      </nav>

      <h1 class="fw-bold text-dark mb-4" style="font-size: 1.85rem; letter-spacing: -0.02em;">
        Formulir Checkout & Pembayaran
      </h1>

      <form @submit.prevent="submitCheckout">
        <div class="row g-4">
          <!-- Col Left: Shipping Address & Payment Selection -->
          <div class="col-lg-7">
            <!-- Section 1: Customer Contact & Shipping Details -->
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">
                <i class="bi bi-geo-alt-fill text-warning me-2"></i> 1. Alamat Pengiriman
              </h5>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Nama Lengkap Penerima *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Nama lengkap penerima"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Nomor WhatsApp Aktif *</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="form-control"
                    placeholder="0812-xxxx-xxxx"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted">Alamat Email (Untuk Bukti & Struk)</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="nama@email.com"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted">Alamat Lengkap Jalan / Rumah *</label>
                  <textarea
                    v-model="form.address"
                    rows="2"
                    class="form-control"
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/desa..."
                    required
                  ></textarea>
                </div>
                <div class="col-md-7">
                  <label class="form-label small fw-bold text-muted">Kota / Kabupaten *</label>
                  <input
                    v-model="form.city"
                    type="text"
                    class="form-control"
                    placeholder="Contoh: Kota Malang, Jawa Timur"
                    required
                  />
                </div>
                <div class="col-md-5">
                  <label class="form-label small fw-bold text-muted">Kode Pos</label>
                  <input
                    v-model="form.postalCode"
                    type="text"
                    class="form-control"
                    placeholder="65141"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted">Catatan Khusus Pengiriman (Opsional)</label>
                  <input
                    v-model="form.notes"
                    type="text"
                    class="form-control"
                    placeholder="Contoh: Titipkan di pos satpam, bungkus bubble wrap tebal"
                  />
                </div>
              </div>
            </div>

            <!-- Section 2: Kurir Pengiriman -->
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">
                <i class="bi bi-truck text-warning me-2"></i> 2. Opsi Kurir Ekspedisi
              </h5>

              <div class="d-flex flex-column gap-2">
                <label
                  class="d-flex justify-content-between align-items-center p-3 border rounded-3 cursor-pointer"
                  :class="{ 'border-success bg-light border-2': form.courier === 'JNE Reguler' }"
                >
                  <div class="d-flex align-items-center gap-3">
                    <input v-model="form.courier" type="radio" value="JNE Reguler" class="form-check-input mt-0" />
                    <div>
                      <div class="fw-bold text-dark">JNE Reguler (Estimasi 2-3 Hari)</div>
                      <div class="text-muted small">Layanan standar seluruh Indonesia</div>
                    </div>
                  </div>
                  <span class="fw-bold text-dark price-tag">{{ formatIDR(25000) }}</span>
                </label>

                <label
                  class="d-flex justify-content-between align-items-center p-3 border rounded-3 cursor-pointer"
                  :class="{ 'border-success bg-light border-2': form.courier === 'JNE YES Kilat' }"
                >
                  <div class="d-flex align-items-center gap-3">
                    <input v-model="form.courier" type="radio" value="JNE YES Kilat" class="form-check-input mt-0" />
                    <div>
                      <div class="fw-bold text-dark">JNE YES (Yakin Esok Sampai)</div>
                      <div class="text-muted small">Prioritas pengiriman 1 hari tiba</div>
                    </div>
                  </div>
                  <span class="fw-bold text-dark price-tag">{{ formatIDR(45000) }}</span>
                </label>

                <label
                  class="d-flex justify-content-between align-items-center p-3 border rounded-3 cursor-pointer"
                  :class="{ 'border-success bg-light border-2': form.courier === 'SiCepat BEST' }"
                >
                  <div class="d-flex align-items-center gap-3">
                    <input v-model="form.courier" type="radio" value="SiCepat BEST" class="form-check-input mt-0" />
                    <div>
                      <div class="fw-bold text-dark">SiCepat BEST (Besok Sampai Tujuan)</div>
                      <div class="text-muted small">Cepat dan aman bergaransi</div>
                    </div>
                  </div>
                  <span class="fw-bold text-dark price-tag">{{ formatIDR(28000) }}</span>
                </label>

                <label
                  class="d-flex justify-content-between align-items-center p-3 border rounded-3 cursor-pointer"
                  :class="{ 'border-success bg-light border-2': form.courier === 'Ambil di Toko Offline' }"
                >
                  <div class="d-flex align-items-center gap-3">
                    <input v-model="form.courier" type="radio" value="Ambil di Toko Offline" class="form-check-input mt-0" />
                    <div>
                      <div class="fw-bold text-dark">Ambil di Showroom CPazra Malang</div>
                      <div class="text-muted small">Jl. Raya Semeru No. 88, Klojen, Kota Malang</div>
                    </div>
                  </div>
                  <span class="fw-bold text-success price-tag">Gratis</span>
                </label>
              </div>
            </div>

            <!-- Section 3: Metode Pembayaran -->
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 class="fw-bold text-dark mb-3 border-bottom pb-2">
                <i class="bi bi-wallet2 text-warning me-2"></i> 3. Metode Pembayaran
              </h5>

              <div class="d-flex flex-column gap-2">
                <!-- QRIS -->
                <label
                  class="p-3 border rounded-3 cursor-pointer"
                  :class="{ 'border-success bg-light border-2': form.paymentMethod === 'QRIS Instant' }"
                >
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                      <input v-model="form.paymentMethod" type="radio" value="QRIS Instant" class="form-check-input mt-0" />
                      <div>
                        <div class="fw-bold text-dark">QRIS Instant (BCA / Gopay / OVO / ShopeePay)</div>
                        <div class="text-muted small">Scan barcode langsung dari semua mobile banking</div>
                      </div>
                    </div>
                    <span class="badge bg-success">Otomatis Terverifikasi</span>
                  </div>
                </label>

                <!-- Bank Transfer Manual -->
                <label
                  class="p-3 border rounded-3 cursor-pointer"
                  :class="{ 'border-success bg-light border-2': form.paymentMethod === 'Transfer Bank BCA' }"
                >
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                      <input v-model="form.paymentMethod" type="radio" value="Transfer Bank BCA" class="form-check-input mt-0" />
                      <div>
                        <div class="fw-bold text-dark">Transfer Bank BCA Manual</div>
                        <div class="text-muted small">No. Rek: 829-012-3456 a.n CPazra Outdoor</div>
                      </div>
                    </div>
                    <span class="badge bg-secondary">Manual</span>
                  </div>
                </label>

                <!-- COD -->
                <label
                  class="p-3 border rounded-3 cursor-pointer"
                  :class="{ 'border-success bg-light border-2': form.paymentMethod === 'COD' }"
                >
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                      <input v-model="form.paymentMethod" type="radio" value="COD" class="form-check-input mt-0" />
                      <div>
                        <div class="fw-bold text-dark">Bayar di Tempat (COD)</div>
                        <div class="text-muted small">Bayar tunai ke kurir saat paket sampai di rumah</div>
                      </div>
                    </div>
                    <span class="badge bg-warning text-dark">Wilayah Tertentu</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Col Right: Order Item Recap & Submit Button -->
          <div class="col-lg-5">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style="top: 100px;">
              <h5 class="fw-bold text-dark border-bottom pb-3 mb-3">
                Ringkasan Pesanan ({{ cartItemCount }} Item)
              </h5>

              <!-- Item List Mini Recap -->
              <div class="d-flex flex-column gap-2 mb-3 max-h-48 overflow-y-auto">
                <div
                  v-for="item in state.cart"
                  :key="item.productId"
                  class="d-flex align-items-center justify-content-between gap-2 py-1 border-bottom border-light"
                >
                  <div class="d-flex align-items-center gap-2">
                    <img :src="item.image" class="rounded-2 object-fit-cover" style="width: 42px; height: 42px;" />
                    <div class="small">
                      <div class="fw-bold text-dark text-truncate" style="max-width: 170px;">{{ item.name }}</div>
                      <div class="text-muted">{{ item.quantity }}x {{ formatIDR(item.price) }}</div>
                    </div>
                  </div>
                  <span class="fw-bold text-dark small price-tag">{{ formatIDR(item.price * item.quantity) }}</span>
                </div>
              </div>

              <!-- Calculation -->
              <div class="d-flex justify-content-between mb-2 small text-secondary">
                <span>Subtotal Barang</span>
                <span class="text-dark fw-bold price-tag">{{ formatIDR(cartSubtotal) }}</span>
              </div>

              <div v-if="cartDiscount > 0" class="d-flex justify-content-between mb-2 small text-success fw-semibold">
                <span>Diskon Promo ({{ state.appliedVoucher.code }})</span>
                <span class="price-tag">- {{ formatIDR(cartDiscount) }}</span>
              </div>

              <div class="d-flex justify-content-between mb-2 small text-secondary">
                <span>Ongkos Kirim ({{ form.courier }})</span>
                <span class="text-dark fw-bold price-tag">{{ formatIDR(shippingFee) }}</span>
              </div>

              <hr class="my-3">

              <div class="d-flex justify-content-between align-items-baseline mb-4">
                <span class="fs-6 fw-bold text-dark">Total Pembayaran</span>
                <span class="fs-4 fw-bold text-success price-tag">
                  {{ formatIDR(grandTotal) }}
                </span>
              </div>

              <button
                type="submit"
                class="btn btn-warning text-dark w-100 py-3 fw-bold fs-6 shadow-sm mb-2"
                :disabled="isSubmitting || state.cart.length === 0"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-shield-check me-2"></i>
                Buat Pesanan Sekarang
              </button>

              <button
                type="button"
                class="btn btn-link text-secondary text-decoration-none w-100 btn-sm"
                @click="actions.navigate('cart')"
              >
                <i class="bi bi-arrow-left me-1"></i> Kembali ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
