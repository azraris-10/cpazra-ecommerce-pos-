<script setup>
import { computed, ref } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const quantity = ref(1)
const selectedImageIndex = ref(0)
const showReviewModal = ref(false)

const newReview = ref({
  userName: state.currentUser.name || '',
  rating: 5,
  comment: ''
})

const product = computed(() => {
  const found = state.products.find((p) => p.id === state.selectedProductId)
  return found || state.products[0]
})

const productReviews = computed(() => {
  return state.reviews.filter((r) => r.productId === product.value.id)
})

const relatedProducts = computed(() => {
  return state.products
    .filter((p) => p.id !== product.value.id && p.category === product.value.category)
    .slice(0, 4)
})

function getGradeClass(grade) {
  if (grade.includes('Grade S')) return 'grade-badge-s'
  if (grade.includes('Grade A')) return 'grade-badge-a'
  if (grade.includes('Grade B')) return 'grade-badge-b'
  return 'grade-badge-c'
}

function calculateSavings(original, price) {
  if (!original || original <= price) return null
  const saved = original - price
  const percent = Math.round((saved / original) * 100)
  return { saved, percent }
}

function handleAddToCart() {
  actions.addToCart(product.value, quantity.value)
}

function handleBuyNow() {
  actions.addToCart(product.value, quantity.value)
  actions.navigate('cart')
}

function submitReview() {
  if (!newReview.value.comment.trim()) {
    actions.showToast('Silakan isi ulasan produk Anda.', 'warning')
    return
  }
  actions.addReview(product.value.id, {
    userName: newReview.value.userName.trim() || 'Pelanggan CPazra',
    rating: newReview.value.rating,
    comment: newReview.value.comment.trim()
  })
  showReviewModal.value = false
  newReview.value.comment = ''
}
</script>

<template>
  <div class="py-4" style="background-color: #fbf9f6;">
    <div class="container max-w-7xl px-3 px-md-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="cp-breadcrumb mb-3 small">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item">
            <a href="#" @click.prevent="actions.navigate('home')">Beranda</a>
          </li>
          <li class="breadcrumb-item">
            <a href="#" @click.prevent="actions.navigate('catalog', { category: product.category })">{{ product.category }}</a>
          </li>
          <li class="breadcrumb-item active text-secondary text-truncate" aria-current="page" style="max-width: 300px;">
            {{ product.name }}
          </li>
        </ol>
      </nav>

      <!-- Main Product Details -->
      <div class="row g-4 g-lg-5 mb-5">
        <!-- Col Left: Photo Gallery -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3">
            <!-- Main Display Image -->
            <div class="position-relative rounded-3 overflow-hidden mb-3" style="height: 420px; background-color: #f7f4ee;">
              <img
                :src="product.images ? product.images[selectedImageIndex] || product.image : product.image"
                :alt="product.name"
                class="w-100 h-100 object-fit-cover"
              />
              <span class="position-absolute" style="top: 14px; left: 14px; z-index: 5;" :class="getGradeClass(product.conditionGrade)">
                {{ product.conditionGrade }} · {{ product.gradeLabel }}
              </span>
              <span
                v-if="calculateSavings(product.originalPrice, product.price)"
                class="position-absolute badge bg-danger fs-6 px-3 py-2 shadow-sm"
                style="top: 14px; right: 14px; z-index: 5;"
              >
                Hemat {{ calculateSavings(product.originalPrice, product.price).percent }}%
              </span>
            </div>

            <!-- Thumbnail Selector -->
            <div v-if="product.images && product.images.length > 1" class="d-flex gap-2">
              <div
                v-for="(img, idx) in product.images"
                :key="idx"
                class="rounded-2 overflow-hidden border cursor-pointer"
                :class="{ 'border-success border-2 shadow-sm': selectedImageIndex === idx }"
                style="width: 80px; height: 75px; background: #f1ede7;"
                @click="selectedImageIndex = idx"
              >
                <img :src="img" class="w-100 h-100 object-fit-cover" />
              </div>
            </div>

            <!-- Thrift Transparency Guarantee Notice -->
            <div class="alert alert-light border mt-3 mb-0 small text-muted d-flex align-items-center gap-2">
              <i class="bi bi-camera-fill text-warning fs-5"></i>
              <div>
                <strong>Foto Real Pict 100%:</strong> Foto produk diambil langsung di studio CPazra tanpa manipulasi kondisi fisik.
              </div>
            </div>
          </div>
        </div>

        <!-- Col Right: Contiguous Purchase Module -->
        <div class="col-lg-6">
          <div class="d-flex flex-column h-100">
            <!-- Brand & SKU -->
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted fw-bold text-uppercase" style="font-size: 0.8rem; letter-spacing: 0.05em;">
                {{ product.brand }} · SKU: {{ product.sku }}
              </span>
              <div class="d-flex align-items-center gap-1 text-warning small">
                <i class="bi bi-star-fill"></i>
                <span class="fw-bold text-dark">{{ product.rating || '4.9' }}</span>
                <span class="text-muted">({{ productReviews.length }} ulasan)</span>
              </div>
            </div>

            <!-- Product Title -->
            <h1 class="fw-bold text-dark mb-2" style="font-size: 1.85rem; letter-spacing: -0.02em;">
              {{ product.name }}
            </h1>

            <!-- Price Breakdown -->
            <div class="p-3 rounded-3 bg-white border shadow-sm mb-3">
              <div class="d-flex align-items-baseline gap-3 mb-1">
                <span class="fs-2 fw-bold text-success price-tag">
                  {{ formatIDR(product.price) }}
                </span>
                <span class="fs-6 text-decoration-line-through text-muted price-tag">
                  {{ formatIDR(product.originalPrice) }}
                </span>
              </div>
              <div v-if="calculateSavings(product.originalPrice, product.price)" class="text-danger small fw-bold">
                <i class="bi bi-tag-fill me-1"></i> Anda hemat {{ formatIDR(calculateSavings(product.originalPrice, product.price).saved) }} dibanding harga retail resmi!
              </div>
            </div>

            <!-- Thrifting Inspection Box (Grade & Minus Notes) -->
            <div class="card border-0 rounded-3 shadow-sm p-3 mb-3" style="background-color: #fcf9f2; border: 1.5px solid #e8dec8 !important;">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-shield-exclamation text-warning fs-5"></i>
                  <h6 class="fw-bold m-0 text-dark">Laporan Kondisi & Catatan Minus</h6>
                </div>
                <span :class="getGradeClass(product.conditionGrade)">
                  {{ product.conditionGrade }}
                </span>
              </div>

              <!-- Minus Detail Text -->
              <div class="p-2 bg-white rounded-2 border border-warning border-opacity-50 mb-3 small text-secondary">
                <strong class="text-dark d-block mb-1">
                  <i class="bi bi-search text-warning me-1"></i> Temuan Inspeksi CPazra:
                </strong>
                {{ product.flawDetails }}
              </div>

              <!-- 5-Point Quality Inspection Checklist -->
              <div class="row g-2 small text-secondary">
                <div class="col-6 d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-success"></i>
                  <span>Zipper & Gesper: Normal</span>
                </div>
                <div class="col-6 d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-success"></i>
                  <span>Jahitan Beban: Kuat</span>
                </div>
                <div class="col-6 d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-success"></i>
                  <span>Waterproof: Teruji</span>
                </div>
                <div class="col-6 d-flex align-items-center gap-2">
                  <i class="bi bi-check-circle-fill text-success"></i>
                  <span>Higienis: Sudah Dicuci</span>
                </div>
              </div>
            </div>

            <!-- Size & Stock -->
            <div class="row g-2 mb-3">
              <div class="col-6">
                <div class="p-2 border rounded-2 bg-white small">
                  <span class="text-muted d-block" style="font-size: 0.72rem;">Ukuran / Kapasitas:</span>
                  <strong class="text-dark">{{ product.size }}</strong>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 border rounded-2 bg-white small">
                  <span class="text-muted d-block" style="font-size: 0.72rem;">Ketersediaan Stok:</span>
                  <strong class="text-warning" v-if="product.stock <= 1">
                    <i class="bi bi-exclamation-circle-fill me-1"></i> Hanya 1 Unit
                  </strong>
                  <strong class="text-success" v-else>
                    {{ product.stock }} Unit Tersedia
                  </strong>
                </div>
              </div>
            </div>

            <!-- Action Controls (Quantity, Add to Cart, Buy Now, Wishlist) -->
            <div class="d-flex flex-column gap-2 mb-4">
              <div class="d-flex gap-2">
                <!-- Quantity Stepper -->
                <div class="input-group" style="width: 120px;">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    :disabled="quantity <= 1"
                    @click="quantity > 1 && quantity--"
                  >
                    -
                  </button>
                  <input
                    v-model.number="quantity"
                    type="text"
                    readonly
                    class="form-control text-center fw-bold bg-white"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    :disabled="quantity >= product.stock"
                    @click="quantity < product.stock && quantity++"
                  >
                    +
                  </button>
                </div>

                <!-- Add To Cart Button -->
                <button
                  type="button"
                  class="btn btn-forest flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  @click="handleAddToCart"
                >
                  <i class="bi bi-cart-plus fs-5"></i> Tambah ke Keranjang
                </button>

                <!-- Wishlist Toggle -->
                <button
                  type="button"
                  class="btn btn-outline-secondary px-3"
                  :title="actions.isInWishlist(product.id) ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'"
                  @click="actions.toggleWishlist(product.id)"
                >
                  <i :class="['bi fs-5', actions.isInWishlist(product.id) ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                </button>
              </div>

              <!-- Buy Now Direct Checkout Button -->
              <button
                type="button"
                class="btn btn-warning text-dark py-2 fw-bold w-100"
                @click="handleBuyNow"
              >
                Beli Sekarang (Langsung Checkout)
              </button>
            </div>

            <!-- WhatsApp Direct Consultation -->
            <a
              :href="`https://wa.me/6281234567890?text=Halo%20Admin%20CPazra,%20saya%20mau%20tanya%20kondisi%20detail%20produk%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku})`"
              target="_blank"
              class="btn btn-outline-success btn-sm w-100 fw-medium d-flex align-items-center justify-content-center gap-2"
            >
              <i class="bi bi-whatsapp"></i> Tanya Admin via WhatsApp (Minta Video Detail)
            </a>
          </div>
        </div>
      </div>

      <!-- Description & Specs Tabs -->
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-5">
        <h5 class="fw-bold text-dark border-bottom pb-3 mb-3">
          <i class="bi bi-file-text text-warning me-2"></i> Deskripsi & Spesifikasi Produk
        </h5>
        <div class="row g-4">
          <div class="col-lg-7">
            <h6 class="fw-bold text-dark">Tentang Produk Ini</h6>
            <p class="text-secondary small" style="line-height: 1.7;">
              {{ product.description }}
            </p>
          </div>
          <div class="col-lg-5">
            <h6 class="fw-bold text-dark mb-3">Spesifikasi Teknis</h6>
            <div class="table-responsive">
              <table class="table table-sm table-bordered small">
                <tbody>
                  <tr v-for="(val, key) in product.specs" :key="key">
                    <th class="bg-light text-secondary text-capitalize" style="width: 40%;">
                      {{ key }}
                    </th>
                    <td class="text-dark fw-medium">{{ val }}</td>
                  </tr>
                  <tr>
                    <th class="bg-light text-secondary">Kondisi</th>
                    <td class="text-dark fw-bold text-success">{{ product.conditionGrade }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Reviews Section -->
      <div class="card border-0 shadow-sm rounded-4 p-4 bg-white mb-5">
        <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4 gap-2">
          <div>
            <h5 class="fw-bold text-dark m-0">
              <i class="bi bi-chat-square-text text-warning me-2"></i> Ulasan Pembeli ({{ productReviews.length }})
            </h5>
            <span class="text-muted small">Ulasan autentik dari pendaki yang telah membeli produk ini</span>
          </div>
          <button
            type="button"
            class="btn btn-outline-dark btn-sm fw-bold"
            @click="showReviewModal = true"
          >
            <i class="bi bi-pencil-square me-1"></i> Beri Ulasan Produk
          </button>
        </div>

        <div v-if="productReviews.length > 0" class="row g-3">
          <div v-for="rev in productReviews" :key="rev.id" class="col-md-6">
            <div class="p-3 border rounded-3 bg-light h-100">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-bold text-dark small">{{ rev.userName }}</span>
                <span class="text-muted" style="font-size: 0.72rem;">{{ rev.date }}</span>
              </div>
              <div class="text-warning small mb-2">
                <i v-for="i in rev.rating" :key="i" class="bi bi-star-fill"></i>
              </div>
              <p class="text-secondary small m-0" style="line-height: 1.5;">
                {{ rev.comment }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-muted small">
          Belum ada ulasan untuk produk ini. Jadilah pendaki pertama yang memberikan ulasan!
        </div>
      </div>

      <!-- Related Thrift Products -->
      <div v-if="relatedProducts.length > 0" class="mb-5">
        <h4 class="fw-bold text-dark mb-4">Produk Serupa yang Mungkin Anda Sukai</h4>
        <div class="row g-3">
          <div v-for="rel in relatedProducts" :key="rel.id" class="col-lg-3 col-md-6 col-6">
            <div
              class="cp-card cp-card-hover p-2 cursor-pointer bg-white"
              @click="actions.navigate('detail', { productId: rel.id })"
            >
              <div class="rounded-2 overflow-hidden mb-2" style="height: 150px; background: #f7f4ee;">
                <img :src="rel.image" class="w-100 h-100 object-fit-cover" />
              </div>
              <span class="text-muted small fw-bold text-uppercase d-block" style="font-size: 0.7rem;">{{ rel.brand }}</span>
              <h6 class="fw-bold text-dark small text-truncate mb-1">{{ rel.name }}</h6>
              <span class="fw-bold text-success price-tag">{{ formatIDR(rel.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Submission Modal -->
    <div
      v-if="showReviewModal"
      class="modal fade show d-block"
      style="background: rgba(0,0,0,0.6);"
      @click.self="showReviewModal = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow border-0 rounded-4 p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="modal-title fw-bold text-dark m-0">
              <i class="bi bi-star-fill text-warning me-1"></i> Tulis Ulasan Produk
            </h5>
            <button type="button" class="btn-close" @click="showReviewModal = false"></button>
          </div>
          <form @submit.prevent="submitReview">
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Nama Anda</label>
              <input
                v-model="newReview.userName"
                type="text"
                class="form-control"
                placeholder="Nama Anda atau inisial"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Rating Bintang</label>
              <select v-model.number="newReview.rating" class="form-select">
                <option :value="5">⭐⭐⭐⭐⭐ (5 - Luar Biasa)</option>
                <option :value="4">⭐⭐⭐⭐ (4 - Sangat Bagus)</option>
                <option :value="3">⭐⭐⭐ (3 - Cukup Baik)</option>
                <option :value="2">⭐⭐ (2 - Kurang)</option>
                <option :value="1">⭐ (1 - Mengecewakan)</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Ulasan & Pengalaman Pemakaian</label>
              <textarea
                v-model="newReview.comment"
                class="form-control"
                rows="4"
                placeholder="Ceritakan kondisi fisik, kesesuaian minus, atau pengalaman memakai gear ini saat mendaki..."
                required
              ></textarea>
            </div>
            <div class="d-flex gap-2 justify-content-end">
              <button type="button" class="btn btn-outline-secondary" @click="showReviewModal = false">
                Batal
              </button>
              <button type="submit" class="btn btn-forest fw-bold px-4">
                Kirim Ulasan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
