<script setup>
import { computed, reactive, ref } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const activeProfileTab = ref('biodata') // 'biodata', 'orders', 'vouchers', 'security'

const editForm = reactive({
  name: state.currentUser.name || '',
  email: state.currentUser.email || '',
  phone: state.currentUser.phone || '',
  address: state.currentUser.address || '',
  city: state.currentUser.city || '',
  postalCode: state.currentUser.postalCode || '65141',
  gender: 'Laki-laki',
  birthDate: '1998-08-17'
})

const passwordForm = reactive({
  current: '',
  newPass: '',
  confirm: ''
})

const customerOrders = computed(() => {
  return state.orders
})

function saveProfile() {
  actions.updateUserProfile({
    name: editForm.name.trim(),
    email: editForm.email.trim(),
    phone: editForm.phone.trim(),
    address: editForm.address.trim(),
    city: editForm.city.trim(),
    postalCode: editForm.postalCode.trim()
  })
}

function handlePasswordChange() {
  if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirm) {
    actions.showToast('Konfirmasi password baru tidak cocok!', 'warning')
    return
  }
  actions.showToast('Password akun Anda berhasil diperbarui!', 'success')
  passwordForm.current = ''
  passwordForm.newPass = ''
  passwordForm.confirm = ''
}

function copyVoucher(code) {
  navigator.clipboard.writeText(code)
  actions.showToast(`Kode voucher "${code}" berhasil disalin!`, 'info')
}
</script>

<template>
  <div class="py-5" style="background-color: #fbf9f6; min-height: 85vh;">
    <div class="container max-w-7xl px-3 px-md-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="cp-breadcrumb mb-4 small">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item"><a href="#" @click.prevent="actions.navigate('home')">Beranda</a></li>
          <li class="breadcrumb-item active text-secondary" aria-current="page">Akun Profil Pelanggan</li>
        </ol>
      </nav>

      <div class="row g-4">
        <!-- Sidebar Navigation -->
        <div class="col-lg-4">
          <!-- Profile Badge Card -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="rounded-circle bg-forest text-white d-flex align-items-center justify-content-center fw-bold fs-3 shadow-sm flex-shrink-0" style="width: 64px; height: 64px; background-color: #1b3b2b;">
                {{ state.currentUser.name.charAt(0) }}
              </div>
              <div class="overflow-hidden">
                <h5 class="fw-bold text-dark m-0 text-truncate">{{ state.currentUser.name }}</h5>
                <span class="text-muted small d-block text-truncate">{{ state.currentUser.email }}</span>
                <span class="badge bg-warning text-dark mt-1" style="font-size: 0.7rem;">
                  <i class="bi bi-patch-check-fill me-1"></i> {{ state.currentUser.memberTier || 'Member Gold' }}
                </span>
              </div>
            </div>

            <div class="p-2 rounded-3 bg-light border small text-muted d-flex justify-content-between align-items-center">
              <span>Bergabung Sejak:</span>
              <strong class="text-dark">{{ state.currentUser.joinedDate || '2024' }}</strong>
            </div>
          </div>

          <!-- Profile Nav Menu -->
          <div class="card border-0 shadow-sm rounded-4 p-2 bg-white">
            <div class="list-group list-group-flush border-0">
              <button
                type="button"
                class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0 rounded-3 fw-semibold"
                :class="{ 'bg-forest text-white': activeProfileTab === 'biodata', 'text-dark': activeProfileTab !== 'biodata' }"
                @click="activeProfileTab = 'biodata'"
              >
                <i class="bi bi-person-lines-fill fs-5"></i>
                <span>Biodata Diri & Alamat</span>
              </button>

              <button
                type="button"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 border-0 rounded-3 fw-semibold"
                :class="{ 'bg-forest text-white': activeProfileTab === 'orders', 'text-dark': activeProfileTab !== 'orders' }"
                @click="activeProfileTab = 'orders'"
              >
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-bag-check-fill fs-5"></i>
                  <span>Riwayat Pesanan Saya</span>
                </div>
                <span class="badge rounded-pill" :class="activeProfileTab === 'orders' ? 'bg-warning text-dark' : 'bg-light text-dark border'">
                  {{ customerOrders.length }}
                </span>
              </button>

              <button
                type="button"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 border-0 rounded-3 fw-semibold text-dark"
                @click="actions.navigate('wishlist')"
              >
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-heart-fill text-danger fs-5"></i>
                  <span>Wishlist Favorit</span>
                </div>
                <span class="badge bg-light text-dark border rounded-pill">{{ state.wishlist.length }}</span>
              </button>

              <button
                type="button"
                class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0 rounded-3 fw-semibold"
                :class="{ 'bg-forest text-white': activeProfileTab === 'vouchers', 'text-dark': activeProfileTab !== 'vouchers' }"
                @click="activeProfileTab = 'vouchers'"
              >
                <i class="bi bi-ticket-perforated-fill text-warning fs-5"></i>
                <span>Kupon & Voucher Saya</span>
              </button>

              <button
                type="button"
                class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0 rounded-3 fw-semibold"
                :class="{ 'bg-forest text-white': activeProfileTab === 'security', 'text-dark': activeProfileTab !== 'security' }"
                @click="activeProfileTab = 'security'"
              >
                <i class="bi bi-shield-lock-fill fs-5"></i>
                <span>Keamanan & Password</span>
              </button>

              <hr class="my-2">

              <button
                type="button"
                class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 border-0 rounded-3 text-danger fw-bold"
                @click="actions.logoutCustomer()"
              >
                <i class="bi bi-box-arrow-right fs-5"></i>
                <span>Keluar dari Akun (Logout)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-lg-8">
          <!-- TAB 1: BIODATA & ALAMAT -->
          <div v-if="activeProfileTab === 'biodata'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h4 class="fw-bold text-dark mb-4 border-bottom pb-3">
              <i class="bi bi-person-circle text-warning me-2"></i> Biodata Diri & Alamat Pengiriman
            </h4>

            <form @submit.prevent="saveProfile">
              <h6 class="fw-bold text-dark mb-3">Informasi Kontak</h6>
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Nama Lengkap</label>
                  <input v-model="editForm.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Alamat Email</label>
                  <input v-model="editForm.email" type="email" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Nomor WhatsApp / HP</label>
                  <input v-model="editForm.phone" type="tel" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-muted">Jenis Kelamin</label>
                  <select v-model="editForm.gender" class="form-select">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <h6 class="fw-bold text-dark mb-3">Alamat Pengiriman Utama</h6>
              <div class="row g-3 mb-4">
                <div class="col-12">
                  <label class="form-label small fw-bold text-muted">Alamat Lengkap (Jalan, RT/RW, No. Rumah)</label>
                  <textarea v-model="editForm.address" rows="2" class="form-control" required></textarea>
                </div>
                <div class="col-md-8">
                  <label class="form-label small fw-bold text-muted">Kota / Kabupaten, Provinsi</label>
                  <input v-model="editForm.city" type="text" class="form-control" required />
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold text-muted">Kode Pos</label>
                  <input v-model="editForm.postalCode" type="text" class="form-control" />
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-forest fw-bold px-4 py-2">
                  <i class="bi bi-check2-circle me-1"></i> Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>

          <!-- TAB 2: RIWAYAT PESANAN -->
          <div v-else-if="activeProfileTab === 'orders'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <div>
                <h4 class="fw-bold text-dark m-0">Riwayat Pesanan Belanja</h4>
                <span class="text-muted small">Status pengiriman pesanan thrift outdoor Anda</span>
              </div>
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="actions.navigate('catalog')">
                <i class="bi bi-cart-plus me-1"></i> Belanja Lagi
              </button>
            </div>

            <div v-if="customerOrders.length > 0" class="d-flex flex-column gap-3">
              <div
                v-for="order in customerOrders"
                :key="order.id"
                class="card border rounded-3 p-3 bg-white cp-card-hover"
              >
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 pb-2 border-bottom gap-2">
                  <div class="d-flex align-items-center gap-2 small">
                    <span class="badge bg-dark font-mono">#{{ order.id }}</span>
                    <span class="text-muted">{{ new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                  </div>
                  <div>
                    <span class="badge" :class="order.status === 'Selesai' ? 'bg-success' : 'bg-warning text-dark'">
                      {{ order.status }}
                    </span>
                  </div>
                </div>

                <!-- Items Preview -->
                <div class="d-flex flex-column gap-2 mb-3">
                  <div
                    v-for="item in order.items"
                    :key="item.productId"
                    class="d-flex align-items-center justify-content-between gap-3"
                  >
                    <div class="d-flex align-items-center gap-3">
                      <img :src="item.image" class="rounded-2 object-fit-cover border" style="width: 48px; height: 48px;" />
                      <div>
                        <div class="fw-bold text-dark small">{{ item.name }}</div>
                        <div class="text-muted" style="font-size: 0.72rem;">{{ item.quantity }}x @{{ formatIDR(item.price) }} · Size {{ item.size }}</div>
                      </div>
                    </div>
                    <span class="fw-bold text-dark small font-mono">{{ formatIDR(item.price * item.quantity) }}</span>
                  </div>
                </div>

                <div class="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top gap-2 small">
                  <div>
                    <span class="text-muted">Total Belanja: </span>
                    <strong class="text-success fs-6 font-mono">{{ formatIDR(order.total) }}</strong>
                    <span class="text-muted ms-2">({{ order.shippingCourier }})</span>
                  </div>
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-dark"
                      @click="actions.navigate('order-success', { orderId: order.id })"
                    >
                      <i class="bi bi-printer me-1"></i> Lihat Struk / Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5 text-muted small">
              Belum ada riwayat pesanan.
            </div>
          </div>

          <!-- TAB 3: VOUCHER SAYA -->
          <div v-else-if="activeProfileTab === 'vouchers'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h4 class="fw-bold text-dark mb-4 border-bottom pb-3">
              <i class="bi bi-ticket-perforated-fill text-warning me-2"></i> Voucher & Kupon Promo Saya
            </h4>

            <div class="row g-3">
              <div v-for="v in state.vouchers" :key="v.id" class="col-md-6">
                <div class="p-3 rounded-3 border border-warning border-opacity-50 bg-light position-relative">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-warning text-dark font-mono fs-6">{{ v.code }}</span>
                    <span class="badge bg-success">Aktif</span>
                  </div>
                  <h6 class="fw-bold text-dark mb-1">{{ v.title }}</h6>
                  <p class="text-muted small mb-2" style="font-size: 0.75rem;">
                    Min. belanja {{ formatIDR(v.minSpend) }} · Berlaku s/d {{ v.expiresAt }}
                  </p>
                  <button type="button" class="btn btn-sm btn-outline-dark w-100 fw-bold" @click="copyVoucher(v.code)">
                    <i class="bi bi-copy me-1"></i> Salin Kode Voucher
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: KEAMANAN -->
          <div v-else-if="activeProfileTab === 'security'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h4 class="fw-bold text-dark mb-4 border-bottom pb-3">
              <i class="bi bi-shield-lock-fill text-warning me-2"></i> Keamanan Akun & Ganti Password
            </h4>

            <form @submit.prevent="handlePasswordChange" style="max-width: 480px;">
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Password Saat Ini</label>
                <input v-model="passwordForm.current" type="password" class="form-control" placeholder="••••••••" required />
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Password Baru</label>
                <input v-model="passwordForm.newPass" type="password" class="form-control" placeholder="Minimal 6 karakter" required />
              </div>
              <div class="mb-4">
                <label class="form-label small fw-bold text-muted">Konfirmasi Password Baru</label>
                <input v-model="passwordForm.confirm" type="password" class="form-control" placeholder="Ulangi password baru" required />
              </div>
              <button type="submit" class="btn btn-forest fw-bold px-4 py-2">
                Update Password
              </button>
            </form>
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
</style>
