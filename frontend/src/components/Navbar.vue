<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { state, actions, cartItemCount, wishlistItemCount } from '../services/store'

const showSearchModal = ref(false)
const searchInput = ref('')
const showProfileDropdown = ref(false)
const profileDropdownRef = ref(null)

const isStore = computed(() => state.currentMode === 'store')
const isPos = computed(() => state.currentMode === 'pos')
const isAdmin = computed(() => state.currentMode === 'admin')

function handleSearch() {
  if (searchInput.value.trim()) {
    state.searchQuery = searchInput.value.trim()
    actions.navigate('catalog')
    showSearchModal.value = false
    searchInput.value = ''
  }
}

function handleClickOutside(event) {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleAdminClick() {
  if (state.isAdminAuthenticated) {
    actions.switchMode('admin')
  } else {
    actions.navigate('login', { loginTab: 'admin' })
  }
}

function handleProfileClick() {
  showProfileDropdown.value = !showProfileDropdown.value
}

function goToProfile() {
  showProfileDropdown.value = false
  actions.navigate('profile')
}

function handleLogout() {
  showProfileDropdown.value = false
  actions.logoutCustomer()
}

function goToLogin(tab = 'customer') {
  showProfileDropdown.value = false
  actions.navigate('login', { loginTab: tab })
}
</script>

<template>
  <!-- Top Utility Banner & Mode Switcher Bar -->
  <div class="bg-dark text-white py-1 px-3 border-bottom border-secondary border-opacity-25" style="font-size: 0.8rem; background-color: #11251b !important;">
    <div class="container-fluid max-w-7xl d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div class="d-flex align-items-center gap-3 text-light text-opacity-75">
        <span><i class="bi bi-shield-check text-warning me-1"></i> 100% Produk Thrift Terkurasi & Autentik</span>
        <span class="d-none d-md-inline text-secondary">|</span>
        <span class="d-none d-md-inline"><i class="bi bi-truck text-warning me-1"></i> Gratis Ongkir Wilayah Jawa Min. Rp 500rb</span>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="d-flex align-items-center gap-1 bg-black bg-opacity-40 p-1 rounded-2">
        <button
          type="button"
          class="btn btn-sm py-0 px-2 rounded-1 text-nowrap"
          :class="isStore ? 'btn-warning text-dark fw-bold' : 'btn-link text-white text-decoration-none'"
          style="font-size: 0.75rem;"
          @click="actions.switchMode('store')"
        >
          <i class="bi bi-shop me-1"></i> Toko Online
        </button>

        <button
          type="button"
          class="btn btn-sm py-0 px-2 rounded-1 text-nowrap"
          :class="isPos ? 'btn-warning text-dark fw-bold' : 'btn-link text-white text-decoration-none'"
          style="font-size: 0.75rem;"
          @click="actions.switchMode('pos')"
        >
          <i class="bi bi-calculator me-1"></i> Kasir POS
        </button>

        <!-- Admin Panel Switcher: Requires Login if not authenticated -->
        <button
          type="button"
          class="btn btn-sm py-0 px-2 rounded-1 text-nowrap"
          :class="isAdmin ? 'btn-warning text-dark fw-bold' : 'btn-link text-white text-decoration-none'"
          style="font-size: 0.75rem;"
          @click="handleAdminClick"
        >
          <i class="bi bi-speedometer2 me-1"></i> Admin Panel
          <span v-if="!state.isAdminAuthenticated" class="badge bg-danger ms-1" style="font-size: 0.6rem;">Login</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Main Navigation Bar -->
  <header class="navbar navbar-expand-lg sticky-top border-bottom" style="background-color: #1b3b2b; border-color: rgba(255,255,255,0.1) !important;">
    <div class="container-fluid max-w-7xl px-3 px-md-4 py-2">
      <!-- Zone 1: Brand Wordmark -->
      <a
        href="#"
        class="navbar-brand d-flex align-items-center gap-2 text-white text-decoration-none m-0 p-0"
        @click.prevent="actions.navigate('home')"
      >
        <div class="d-flex align-items-center justify-content-center bg-warning text-dark rounded-2 fw-bold px-2 py-1" style="font-size: 1.1rem; line-height: 1;">
          <i class="bi bi-compass-fill me-1"></i> CP
        </div>
        <div class="d-flex flex-column">
          <span class="fw-bold tracking-tight text-white" style="font-size: 1.35rem; letter-spacing: -0.02em;">CPazra</span>
          <span class="text-white-50" style="font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; margin-top: -3px;">Outdoor & Thrift</span>
        </div>
      </a>

      <!-- Zone 2: Navigation Links (Store Mode) -->
      <nav v-if="isStore" class="d-none d-lg-flex align-items-center gap-4 ms-5">
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold text-opacity-100 border-bottom border-warning border-2': state.currentView === 'home' }"
          @click.prevent="actions.navigate('home')"
        >
          Beranda
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold text-opacity-100 border-bottom border-warning border-2': state.currentView === 'catalog' }"
          @click.prevent="actions.navigate('catalog')"
        >
          Katalog Produk
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold text-opacity-100 border-bottom border-warning border-2': state.currentView === 'cara-belanja' }"
          @click.prevent="actions.navigate('cara-belanja')"
        >
          Cara Belanja
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold text-opacity-100 border-bottom border-warning border-2': state.currentView === 'faq' }"
          @click.prevent="actions.navigate('faq')"
        >
          FAQ
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold text-opacity-100 border-bottom border-warning border-2': state.currentView === 'kebijakan-pengembalian' }"
          @click.prevent="actions.navigate('kebijakan-pengembalian')"
        >
          Garansi Thrift
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold text-opacity-100 border-bottom border-warning border-2': state.currentView === 'hubungi-kami' }"
          @click.prevent="actions.navigate('hubungi-kami')"
        >
          Kontak
        </a>
      </nav>

      <!-- Admin Navigation Links (When in Admin Mode) -->
      <nav v-else-if="isAdmin" class="d-none d-lg-flex align-items-center gap-3 ms-5">
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold': state.currentView === 'admin' }"
          @click.prevent="actions.navigate('admin')"
        >
          <i class="bi bi-grid-1x2 me-1"></i> Dashboard
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold': state.currentView === 'admin-products' }"
          @click.prevent="actions.navigate('admin-products')"
        >
          <i class="bi bi-box-seam me-1"></i> Kelola Produk
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold': state.currentView === 'admin-add' }"
          @click.prevent="actions.navigate('admin-add')"
        >
          <i class="bi bi-plus-circle me-1"></i> Tambah Produk
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium"
          :class="{ 'text-warning fw-bold': state.currentView === 'admin-orders' }"
          @click.prevent="actions.navigate('admin-orders')"
        >
          <i class="bi bi-receipt me-1"></i> Pesanan
        </a>
        <a
          href="#"
          class="nav-link py-1 text-white text-opacity-85 text-decoration-none fw-medium text-danger"
          @click.prevent="actions.logoutAdmin()"
        >
          <i class="bi bi-box-arrow-right me-1"></i> Keluar Admin
        </a>
      </nav>

      <!-- Zone 3: Interactive Affordances -->
      <div class="d-flex align-items-center gap-2 gap-md-3 ms-auto">
        <!-- Search Trigger Button -->
        <button
          type="button"
          class="btn btn-link text-white p-2 position-relative text-decoration-none"
          title="Cari Produk"
          @click="showSearchModal = true"
        >
          <i class="bi bi-search fs-5"></i>
        </button>

        <!-- Wishlist Button -->
        <button
          type="button"
          class="btn btn-link text-white p-2 position-relative text-decoration-none"
          title="Wishlist Favorit"
          @click="actions.navigate('wishlist')"
        >
          <i class="bi bi-heart fs-5"></i>
          <span
            v-if="wishlistItemCount > 0"
            class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger"
            style="font-size: 0.65rem;"
          >
            {{ wishlistItemCount }}
          </span>
        </button>

        <!-- Shopping Cart Trigger Button -->
        <button
          type="button"
          class="btn btn-warning text-dark px-3 py-2 rounded-2 fw-semibold d-flex align-items-center gap-2"
          @click="actions.navigate('cart')"
        >
          <i class="bi bi-cart3 fs-6"></i>
          <span class="d-none d-sm-inline">Keranjang</span>
          <span class="badge bg-dark text-warning rounded-pill px-2">
            {{ cartItemCount }}
          </span>
        </button>

        <!-- User Profile Dropdown (Requirement #2 & #3) -->
        <div ref="profileDropdownRef" class="position-relative">
          <button
            class="btn btn-outline-light py-1 px-2 rounded-2 d-flex align-items-center gap-2 text-decoration-none"
            type="button"
            style="font-size: 0.85rem;"
            @click="handleProfileClick"
          >
            <i class="bi bi-person-circle fs-5 text-warning"></i>
            <span class="d-none d-md-inline">
              {{ state.isCustomerLoggedIn ? state.currentUser.name.split(' ')[0] : 'Akun' }}
            </span>
            <i class="bi bi-chevron-down" style="font-size: 0.7rem;"></i>
          </button>

          <!-- Custom Reactive Dropdown Menu -->
          <div
            v-if="showProfileDropdown"
            class="position-absolute end-0 mt-2 card border-0 shadow-lg rounded-3 p-2 bg-white"
            style="min-width: 240px; z-index: 1050;"
          >
            <!-- IF LOGGED IN -->
            <div v-if="state.isCustomerLoggedIn">
              <div class="px-3 py-2 border-bottom">
                <div class="fw-bold text-dark text-truncate">{{ state.currentUser.name }}</div>
                <div class="text-muted small text-truncate">{{ state.currentUser.email }}</div>
                <span class="badge bg-warning text-dark mt-1" style="font-size: 0.65rem;">
                  {{ state.currentUser.memberTier || 'Member Gold' }}
                </span>
              </div>

              <div class="py-1">
                <button
                  type="button"
                  class="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2 small fw-semibold text-dark"
                  @click="goToProfile"
                >
                  <i class="bi bi-person-vcard text-primary fs-6"></i>
                  <span>Lihat Profil Saya</span>
                </button>

                <button
                  type="button"
                  class="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2 small fw-semibold text-dark"
                  @click="goToProfile"
                >
                  <i class="bi bi-bag-check text-success fs-6"></i>
                  <span>Riwayat Pesanan</span>
                </button>

                <button
                  type="button"
                  class="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2 small fw-semibold text-dark"
                  @click="showProfileDropdown = false; actions.navigate('wishlist');"
                >
                  <i class="bi bi-heart text-danger fs-6"></i>
                  <span>Wishlist Favorit ({{ wishlistItemCount }})</span>
                </button>

                <hr class="dropdown-divider my-1">

                <button
                  type="button"
                  class="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2 small fw-bold text-danger"
                  @click="handleLogout"
                >
                  <i class="bi bi-box-arrow-right fs-6"></i>
                  <span>Log Out (Keluar)</span>
                </button>
              </div>
            </div>

            <!-- IF NOT LOGGED IN -->
            <div v-else class="p-2 text-center">
              <div class="text-muted small mb-3">Selamat datang di CPazra Outdoor</div>
              <button
                type="button"
                class="btn btn-forest w-100 btn-sm fw-bold mb-2"
                @click="goToLogin('customer')"
              >
                <i class="bi bi-box-arrow-in-right me-1"></i> Masuk ke Akun
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary w-100 btn-sm"
                @click="goToLogin('customer')"
              >
                Daftar Akun Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Search Modal -->
  <div
    v-if="showSearchModal"
    class="modal fade show d-block"
    style="background: rgba(0,0,0,0.6);"
    @click.self="showSearchModal = false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow border-0 rounded-3 p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="modal-title fw-bold text-dark m-0">
            <i class="bi bi-search text-warning me-1"></i> Cari Perlengkapan Outdoor & Thrift
          </h6>
          <button type="button" class="btn-close" @click="showSearchModal = false"></button>
        </div>
        <form @submit.prevent="handleSearch">
          <div class="input-group">
            <input
              v-model="searchInput"
              type="text"
              class="form-control form-control-lg"
              placeholder="Cari Osprey, jacket Gore-Tex, fleece, sepatu..."
              autofocus
            />
            <button class="btn btn-forest px-4" type="submit">
              Cari
            </button>
          </div>
        </form>
        <div class="mt-3">
          <span class="text-muted small">Pencarian Populer: </span>
          <button
            v-for="kw in ['Osprey', 'Gore-Tex', 'Fleece', 'Sepatu', 'Tenda', 'Grade S']"
            :key="kw"
            type="button"
            class="btn btn-sm btn-light border me-1 mb-1 text-secondary"
            style="font-size: 0.75rem;"
            @click="searchInput = kw; handleSearch();"
          >
            {{ kw }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-item {
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}
.dropdown-item:hover {
  background-color: #f3efe9;
}
</style>
