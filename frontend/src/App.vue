<script setup>
import { computed } from 'vue'
import { state } from './services/store'

import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'

import HomeView from './views/HomeView.vue'
import CatalogView from './views/CatalogView.vue'
import ProductDetailView from './views/ProductDetailView.vue'
import CartView from './views/CartView.vue'
import CheckoutView from './views/CheckoutView.vue'
import OrderSuccessView from './views/OrderSuccessView.vue'
import WishlistView from './views/WishlistView.vue'
import PosView from './views/PosView.vue'
import AdminView from './views/AdminView.vue'
import InfoView from './views/InfoView.vue'
import ProfileView from './views/ProfileView.vue'
import LoginView from './views/LoginView.vue'

const isPosMode = computed(() => state.currentMode === 'pos' || state.currentView === 'pos')
const isAdminMode = computed(() => state.currentMode === 'admin' || state.currentView.startsWith('admin'))

const currentComponent = computed(() => {
  if (isPosMode.value) return PosView
  if (state.currentView === 'login') return LoginView
  if (state.currentView === 'profile') return ProfileView
  if (isAdminMode.value) return AdminView

  switch (state.currentView) {
    case 'home':
      return HomeView
    case 'profile':
      return ProfileView
    case 'login':
      return LoginView
    case 'catalog':
      return CatalogView
    case 'detail':
      return ProductDetailView
    case 'cart':
      return CartView
    case 'checkout':
      return CheckoutView
    case 'order-success':
      return OrderSuccessView
    case 'wishlist':
      return WishlistView
    case 'cara-belanja':
    case 'faq':
    case 'kebijakan-pengembalian':
    case 'syarat-ketentuan':
    case 'kebijakan-privasi':
    case 'hubungi-kami':
    case 'notifikasi':
      return InfoView
    default:
      return HomeView
  }
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Navbar (always visible, handles Store, POS, and Admin mode switching) -->
    <Navbar v-if="!isPosMode" />

    <!-- Main Content Area -->
    <main class="flex-grow-1">
      <component :is="currentComponent" />
    </main>

    <!-- Footer (shown in store and admin mode) -->
    <Footer v-if="!isPosMode" />

    <!-- Global Toast Notifications -->
    <Toast />
  </div>
</template>

<style>
/* Global App Container */
#app {
  width: 100% !important;
  max-width: 100% !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.max-w-7xl {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}
</style>
