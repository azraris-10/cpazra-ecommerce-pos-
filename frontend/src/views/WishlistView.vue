<script setup>
import { computed } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const wishlistProducts = computed(() => {
  return state.products.filter((p) => state.wishlist.includes(p.id))
})

function getGradeClass(grade) {
  if (grade.includes('Grade S')) return 'grade-badge-s'
  if (grade.includes('Grade A')) return 'grade-badge-a'
  if (grade.includes('Grade B')) return 'grade-badge-b'
  return 'grade-badge-c'
}

function moveToCart(product) {
  actions.addToCart(product)
  actions.toggleWishlist(product.id)
}
</script>

<template>
  <div class="py-4" style="background-color: #fbf9f6; min-height: 80vh;">
    <div class="container max-w-7xl px-3 px-md-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="cp-breadcrumb mb-3 small">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item"><a href="#" @click.prevent="actions.navigate('home')">Beranda</a></li>
          <li class="breadcrumb-item active text-secondary" aria-current="page">Wishlist Favorit</li>
        </ol>
      </nav>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="fw-bold text-dark m-0" style="font-size: 1.85rem; letter-spacing: -0.02em;">
            Wishlist & Produk Favorit
          </h1>
          <p class="text-muted small m-0">
            Tersimpan <span class="fw-bold text-dark">{{ wishlistProducts.length }}</span> perlengkapan outdoor idaman Anda.
          </p>
        </div>
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="actions.navigate('catalog')"
        >
          <i class="bi bi-compass me-1"></i> Jelajahi Produk Lain
        </button>
      </div>

      <div v-if="wishlistProducts.length > 0" class="row g-4">
        <div
          v-for="product in wishlistProducts"
          :key="product.id"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
        >
          <div class="cp-card cp-card-hover h-100 d-flex flex-column overflow-hidden position-relative bg-white">
            <div class="card-badge-left">
              <span :class="getGradeClass(product.conditionGrade)">
                {{ product.conditionGrade }}
              </span>
            </div>

            <button
              type="button"
              class="card-action-right text-danger"
              title="Hapus dari Wishlist"
              @click.stop="actions.toggleWishlist(product.id)"
            >
              <i class="bi bi-trash"></i>
            </button>

            <div
              class="position-relative overflow-hidden cursor-pointer"
              style="height: 200px; background-color: #f7f4ee;"
              @click="actions.navigate('detail', { productId: product.id })"
            >
              <img :src="product.image" :alt="product.name" class="w-100 h-100 object-fit-cover" />
            </div>

            <div class="p-3 d-flex flex-column flex-grow-1">
              <span class="text-muted fw-bold text-uppercase small" style="font-size: 0.72rem;">
                {{ product.brand }} · {{ product.category }}
              </span>
              <h6
                class="fw-bold text-dark mb-1 text-truncate cursor-pointer"
                :title="product.name"
                @click="actions.navigate('detail', { productId: product.id })"
              >
                {{ product.name }}
              </h6>
              <span class="text-muted small mb-2" style="font-size: 0.75rem;">Size: {{ product.size }}</span>

              <div class="mt-auto pt-2 border-top">
                <div class="d-flex justify-content-between align-items-baseline mb-3">
                  <span class="text-decoration-line-through text-muted small price-tag" style="font-size: 0.75rem;">
                    {{ formatIDR(product.originalPrice) }}
                  </span>
                  <span class="fw-bold text-success fs-6 price-tag">
                    {{ formatIDR(product.price) }}
                  </span>
                </div>

                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-forest flex-grow-1 fw-bold"
                    @click="moveToCart(product)"
                  >
                    <i class="bi bi-cart-plus me-1"></i> Pindah ke Keranjang
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary px-2"
                    title="Lihat Detail"
                    @click="actions.navigate('detail', { productId: product.id })"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm p-5 my-4">
        <i class="bi bi-heart fs-1 text-muted d-block mb-3" style="font-size: 3rem !important;"></i>
        <h4 class="fw-bold text-dark mb-2">Wishlist Masih Kosong</h4>
        <p class="text-muted small mb-4" style="max-width: 460px; margin: 0 auto;">
          Simpan barang thrift yang Anda incar agar tidak keduluan pembeli lain. Cek katalog dan klik tombol hati pada produk!
        </p>
        <button
          type="button"
          class="btn btn-forest px-4 py-2 fw-bold"
          @click="actions.navigate('catalog')"
        >
          <i class="bi bi-compass me-2"></i> Jelajahi Produk Sekarang
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
