<script setup>
import { computed, ref, watch } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const selectedCategory = ref(state.catalogCategory || 'Semua')
const selectedGrade = ref('Semua')
const sortBy = ref('terbaru') // 'terbaru', 'termurah', 'termahal', 'rating'
const maxPrice = ref(5000000)
const localSearch = ref(state.searchQuery || '')

watch(
  () => state.catalogCategory,
  (newCat) => {
    if (newCat) selectedCategory.value = newCat
  }
)

const categories = ['Semua', 'Jaket', 'Tas', 'Sepatu', 'Camping', 'Outdoor Gear']
const grades = ['Semua', 'Grade S', 'Grade A', 'Grade B', 'Grade C']

const filteredProducts = computed(() => {
  return state.products
    .filter((product) => {
      // Category filter
      if (selectedCategory.value !== 'Semua' && product.category !== selectedCategory.value) {
        return false
      }
      // Grade filter
      if (selectedGrade.value !== 'Semua' && !product.conditionGrade.includes(selectedGrade.value)) {
        return false
      }
      // Max price
      if (product.price > maxPrice.value) {
        return false
      }
      // Search query
      const query = (localSearch.value || state.searchQuery).toLowerCase().trim()
      if (query) {
        const matchName = product.name.toLowerCase().includes(query)
        const matchBrand = product.brand.toLowerCase().includes(query)
        const matchCat = product.category.toLowerCase().includes(query)
        const matchDesc = product.description.toLowerCase().includes(query)
        const matchFlaw = product.flawDetails.toLowerCase().includes(query)
        if (!matchName && !matchBrand && !matchCat && !matchDesc && !matchFlaw) {
          return false
        }
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy.value === 'termurah') return a.price - b.price
      if (sortBy.value === 'termahal') return b.price - a.price
      if (sortBy.value === 'rating') return (b.rating || 0) - (a.rating || 0)
      return 0 // default order (newest first as unshifted)
    })
})

function getGradeClass(grade) {
  if (grade.includes('Grade S')) return 'grade-badge-s'
  if (grade.includes('Grade A')) return 'grade-badge-a'
  if (grade.includes('Grade B')) return 'grade-badge-b'
  return 'grade-badge-c'
}

function calculateSavings(original, price) {
  if (!original || original <= price) return null
  const percent = Math.round(((original - price) / original) * 100)
  return `Hemat ${percent}%`
}

function resetFilters() {
  selectedCategory.value = 'Semua'
  selectedGrade.value = 'Semua'
  maxPrice.value = 5000000
  localSearch.value = ''
  state.searchQuery = ''
  sortBy.value = 'terbaru'
}
</script>

<template>
  <div class="py-4" style="background-color: #fbf9f6; min-height: 80vh;">
    <div class="container max-w-7xl px-3 px-md-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="cp-breadcrumb mb-3 small">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item">
            <a href="#" @click.prevent="actions.navigate('home')">Beranda</a>
          </li>
          <li class="breadcrumb-item active text-secondary" aria-current="page">Katalog Produk</li>
        </ol>
      </nav>

      <!-- Page Header & Live Counts -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 class="fw-bold text-dark m-0" style="font-size: 1.85rem; letter-spacing: -0.02em;">
            Katalog Thrift Outdoor
          </h1>
          <p class="text-muted small m-0">
            Menampilkan <span class="fw-bold text-dark">{{ filteredProducts.length }}</span> dari <span class="fw-bold text-dark">{{ state.products.length }}</span> produk thrift original terverifikasi.
          </p>
        </div>

        <!-- Quick Admin Action (To Test Requirement 1 & 2 directly) -->
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-success fw-bold d-flex align-items-center gap-1"
            @click="actions.navigate('admin-add')"
          >
            <i class="bi bi-plus-circle"></i> Tambah Produk Thrift Baru
          </button>
        </div>
      </div>

      <!-- Filters & Sorting Bar -->
      <div class="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
        <div class="row g-3 align-items-center">
          <!-- Search Input -->
          <div class="col-lg-4 col-md-6">
            <label class="form-label small fw-bold text-muted mb-1">Cari Kata Kunci</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-muted">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="localSearch"
                type="text"
                class="form-control border-start-0"
                placeholder="Cari merk, tipe jaket, tas carrier..."
                @input="state.searchQuery = localSearch"
              />
              <button
                v-if="localSearch"
                type="button"
                class="btn btn-outline-secondary"
                @click="localSearch = ''; state.searchQuery = ''"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>

          <!-- Grade Filter -->
          <div class="col-lg-3 col-md-6 col-6">
            <label class="form-label small fw-bold text-muted mb-1">Grade Kondisi</label>
            <select v-model="selectedGrade" class="form-select">
              <option v-for="g in grades" :key="g" :value="g">
                {{ g === 'Semua' ? 'Semua Grade' : g }}
              </option>
            </select>
          </div>

          <!-- Sort Order -->
          <div class="col-lg-3 col-md-6 col-6">
            <label class="form-label small fw-bold text-muted mb-1">Urutkan</label>
            <select v-model="sortBy" class="form-select">
              <option value="terbaru">Terbaru Ditambahkan</option>
              <option value="termurah">Harga: Termurah</option>
              <option value="termahal">Harga: Termahal</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>

          <!-- Reset Filter Button -->
          <div class="col-lg-2 col-md-6 d-flex align-items-end">
            <button
              type="button"
              class="btn btn-outline-secondary w-100 fw-semibold"
              @click="resetFilters"
            >
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filter
            </button>
          </div>
        </div>

        <!-- Category Filter Tabs -->
        <div class="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="filter-tab"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat; state.catalogCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Active Filter Chips -->
      <div v-if="selectedCategory !== 'Semua' || selectedGrade !== 'Semua' || localSearch" class="d-flex flex-wrap align-items-center gap-2 mb-3">
        <span class="text-muted small">Filter aktif:</span>
        <span v-if="selectedCategory !== 'Semua'" class="badge bg-forest text-white py-1 px-2 rounded-2">
          Kategori: {{ selectedCategory }}
          <i class="bi bi-x cursor-pointer ms-1" @click="selectedCategory = 'Semua'"></i>
        </span>
        <span v-if="selectedGrade !== 'Semua'" class="badge bg-warning text-dark py-1 px-2 rounded-2">
          {{ selectedGrade }}
          <i class="bi bi-x cursor-pointer ms-1" @click="selectedGrade = 'Semua'"></i>
        </span>
        <span v-if="localSearch" class="badge bg-secondary text-white py-1 px-2 rounded-2">
          Kata Kunci: "{{ localSearch }}"
          <i class="bi bi-x cursor-pointer ms-1" @click="localSearch = ''; state.searchQuery = ''"></i>
        </span>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="row g-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
        >
          <div class="cp-card cp-card-hover h-100 d-flex flex-column overflow-hidden position-relative bg-white">
            <!-- Top Badges & Wishlist -->
            <div class="card-badge-left">
              <span :class="getGradeClass(product.conditionGrade)">
                {{ product.conditionGrade }}
              </span>
            </div>
            <button
              type="button"
              class="card-action-right"
              :title="actions.isInWishlist(product.id) ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'"
              @click.stop="actions.toggleWishlist(product.id)"
            >
              <i :class="['bi', actions.isInWishlist(product.id) ? 'bi-heart-fill text-danger' : 'bi-heart text-secondary']"></i>
            </button>

            <!-- Product Image -->
            <div
              class="position-relative overflow-hidden cursor-pointer"
              style="height: 220px; background-color: #f7f4ee;"
              @click="actions.navigate('detail', { productId: product.id })"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="w-100 h-100 object-fit-cover"
                loading="lazy"
              />
              <span
                v-if="calculateSavings(product.originalPrice, product.price)"
                class="position-absolute bottom-2 start-2 badge bg-dark text-warning"
                style="font-size: 0.7rem;"
              >
                {{ calculateSavings(product.originalPrice, product.price) }}
              </span>
            </div>

            <!-- Card Content -->
            <div class="p-3 d-flex flex-column flex-grow-1">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="text-muted fw-bold text-uppercase" style="font-size: 0.72rem;">
                  {{ product.brand }} · {{ product.category }}
                </span>
                <span class="badge bg-light text-secondary border" style="font-size: 0.68rem;">
                  Size: {{ product.size.split(' ')[0] }}
                </span>
              </div>

              <h6
                class="fw-bold text-dark mb-1 cursor-pointer text-truncate"
                :title="product.name"
                @click="actions.navigate('detail', { productId: product.id })"
              >
                {{ product.name }}
              </h6>

              <!-- Transparent Minus Callout -->
              <div class="p-2 rounded-2 bg-light border my-2" style="font-size: 0.75rem;">
                <span class="text-warning fw-bold d-block mb-1">
                  <i class="bi bi-info-circle-fill me-1"></i> Catatan Minus:
                </span>
                <span class="text-secondary text-truncate d-block" :title="product.flawDetails">
                  {{ product.flawDetails }}
                </span>
              </div>

              <!-- Price & CTA -->
              <div class="mt-auto pt-2 border-top">
                <div class="d-flex justify-content-between align-items-baseline mb-2">
                  <div>
                    <span class="text-decoration-line-through text-muted small d-block" style="font-size: 0.75rem;">
                      {{ formatIDR(product.originalPrice) }}
                    </span>
                    <span class="fw-bold text-success fs-6 price-tag">
                      {{ formatIDR(product.price) }}
                    </span>
                  </div>
                  <span v-if="product.stock <= 1" class="badge bg-warning bg-opacity-25 text-warning border border-warning" style="font-size: 0.65rem;">
                    Stok: 1 Pcs
                  </span>
                  <span v-else class="badge bg-light text-muted border" style="font-size: 0.65rem;">
                    Stok: {{ product.stock }}
                  </span>
                </div>

                <div class="d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-forest flex-grow-1 fw-bold"
                    @click="actions.addToCart(product)"
                  >
                    <i class="bi bi-cart-plus me-1"></i> + Keranjang
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary px-2"
                    title="Lihat Detail Produk"
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
      <div v-else class="text-center py-5 bg-white rounded-3 shadow-sm p-4">
        <i class="bi bi-search fs-1 text-muted d-block mb-3"></i>
        <h5 class="fw-bold text-dark">Tidak ada produk thrift yang cocok</h5>
        <p class="text-muted small mb-4">
          Coba ganti kata kunci pencarian, pilih kategori lain, atau reset filter Anda.
        </p>
        <button type="button" class="btn btn-forest px-4 fw-bold" @click="resetFilters">
          Reset Filter Produk
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-forest {
  background-color: #1b3b2b !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
