<script setup>
import { computed } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const featuredProducts = computed(() => {
  return state.products.slice(0, 6)
})

const categories = [
  { name: 'Semua', icon: 'bi-grid-fill', label: 'Semua Kategori' },
  { name: 'Jaket', icon: 'bi-snow', label: 'Jaket & Windbreaker' },
  { name: 'Tas', icon: 'bi-backpack2-fill', label: 'Carrier & Daypack' },
  { name: 'Sepatu', icon: 'bi-boot-fill', label: 'Sepatu Trail & Trekking' },
  { name: 'Camping', icon: 'bi-tree-fill', label: 'Tenda & Matras' },
  { name: 'Outdoor Gear', icon: 'bi-lightning-charge-fill', label: 'Aksesoris & Headlamp' }
]

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
</script>

<template>
  <div>
    <!-- Hero Banner Section -->
    <section class="position-relative text-white overflow-hidden" style="background-color: #12281d; min-height: 480px;">
      <!-- Hero Background Image with Scrim -->
      <img
        src="/images/hero_outdoor_thrift.jpg"
        alt="Outdoor Hiking Adventure with CPazra Gear"
        class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-40"
        referrerpolicy="no-referrer"
      />
      <div
        class="position-absolute top-0 start-0 w-100 h-100"
        style="background: linear-gradient(90deg, rgba(18,40,29,0.95) 0%, rgba(18,40,29,0.8) 50%, rgba(18,40,29,0.4) 100%);"
      ></div>

      <div class="container max-w-7xl position-relative py-5 px-4 my-md-4">
        <div class="row align-items-center">
          <div class="col-lg-7 py-3">
            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 mb-3" style="font-size: 0.85rem; font-weight: 600;">
              <i class="bi bi-patch-check-fill"></i> Kurasi Thrift Outdoor Autentik & Transparan
            </div>
            <h1 class="display-5 fw-bold text-white mb-3" style="letter-spacing: -0.03em; line-height: 1.15;">
              Gear Gunung Berkualitas,<br>
              <span class="text-warning">Harga Thrift yang Terjangkau.</span>
            </h1>
            <p class="fs-6 text-light text-opacity-85 mb-4 pe-lg-4" style="line-height: 1.6; max-width: 600px;">
              Jelajahi koleksi carrier, jaket waterproof Gore-Tex, fleece hangat, dan sepatu hiking original terkurasi. Setiap minus dan kondisi fisik didokumentasikan dengan jujur tanpa rahasia.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <button
                type="button"
                class="btn btn-warning text-dark btn-lg px-4 fw-bold shadow-sm"
                @click="actions.navigate('catalog')"
              >
                <i class="bi bi-compass me-2"></i> Belanja Koleksi Thrift
              </button>
              <button
                type="button"
                class="btn btn-outline-light btn-lg px-4 fw-semibold"
                @click="actions.navigate('kebijakan-pengembalian')"
              >
                <i class="bi bi-shield-check me-2"></i> Panduan Grade Minus
              </button>
            </div>
          </div>

          <!-- Quick Highlight Card (Osprey Aether 65 Spotlight) -->
          <div class="col-lg-5 d-none d-lg-block">
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark p-3">
              <div class="position-relative rounded-3 overflow-hidden mb-3" style="height: 240px; background-color: #f3efe9;">
                <img
                  src="/images/product_osprey_backpack.jpg"
                  alt="Osprey Aether 65 Pack Thrift"
                  class="w-100 h-100 object-fit-cover"
                />
                <span class="position-absolute top-2 start-2 grade-badge-a">
                  GRADE A · SANGAT MULUS
                </span>
                <span class="position-absolute top-2 end-2 badge bg-danger">
                  Hemat 52%
                </span>
              </div>
              <div class="d-flex justify-content-between align-items-start mb-1">
                <div>
                  <span class="text-muted small text-uppercase fw-bold" style="font-size: 0.75rem;">Osprey · Tas Carrier</span>
                  <h5 class="fw-bold m-0 text-dark">Osprey Aether 65 Pack</h5>
                </div>
                <div class="text-end">
                  <span class="text-decoration-line-through text-muted small d-block">{{ formatIDR(3900000) }}</span>
                  <span class="fs-5 fw-bold text-success price-tag">{{ formatIDR(1850000) }}</span>
                </div>
              </div>
              <p class="text-muted small mb-3" style="font-size: 0.8rem;">
                <i class="bi bi-info-circle text-warning me-1"></i>
                Minus lecet halus gesekan batu di webbing bawah. Busa tebal & raincover lengkap.
              </p>
              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-forest flex-grow-1 fw-bold py-2"
                  @click="actions.navigate('detail', { productId: 'prod-001' })"
                >
                  Lihat Detail Minus & Beli
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary px-3"
                  title="Tambah ke Wishlist"
                  @click="actions.toggleWishlist('prod-001')"
                >
                  <i :class="['bi', actions.isInWishlist('prod-001') ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4-Pillar Value Proposition Strip -->
    <section class="border-bottom bg-white py-4 shadow-sm">
      <div class="container max-w-7xl px-4">
        <div class="row g-3">
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center bg-warning bg-opacity-20 text-warning rounded-3 p-3 fs-4">
              <i class="bi bi-binoculars-fill"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">Transparansi Minus</h6>
              <span class="text-muted small">Detail cacat difoto jujur</span>
            </div>
          </div>
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center bg-success bg-opacity-20 text-success rounded-3 p-3 fs-4">
              <i class="bi bi-award-fill"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">100% Brand Asli</h6>
              <span class="text-muted small">Bukan KW atau replika</span>
            </div>
          </div>
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-20 text-primary rounded-3 p-3 fs-4">
              <i class="bi bi-piggy-bank-fill"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">Hemat Hingga 70%</h6>
              <span class="text-muted small">Performa pro harga hemat</span>
            </div>
          </div>
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center bg-danger bg-opacity-20 text-danger rounded-3 p-3 fs-4">
              <i class="bi bi-shield-lock-fill"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">Garansi 7 Hari</h6>
              <span class="text-muted small">Jaminan tukar / kembali</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Category Bar -->
    <section class="py-5" style="background-color: #f7f4ee;">
      <div class="container max-w-7xl px-4">
        <div class="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span class="text-uppercase text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 0.08em;">Pilihan Perlengkapan</span>
            <h2 class="fw-bold text-dark m-0" style="font-size: 1.75rem;">Kategori Thrift Populer</h2>
          </div>
          <button
            type="button"
            class="btn btn-link text-forest fw-bold text-decoration-none p-0"
            @click="actions.navigate('catalog')"
          >
            Lihat Semua Katalog <i class="bi bi-arrow-right"></i>
          </button>
        </div>

        <div class="row g-3">
          <div
            v-for="cat in categories"
            :key="cat.name"
            class="col-lg-2 col-md-4 col-6"
          >
            <div
              class="cp-card cp-card-hover p-3 text-center cursor-pointer h-100 d-flex flex-column justify-content-center align-items-center"
              style="cursor: pointer;"
              @click="actions.navigate('catalog', { category: cat.name })"
            >
              <div class="rounded-circle d-flex align-items-center justify-content-center mb-2" style="width: 52px; height: 52px; background-color: #edf3f0; color: #1b3b2b;">
                <i :class="['bi fs-4', cat.icon]"></i>
              </div>
              <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.9rem;">{{ cat.name }}</h6>
              <span class="text-muted small" style="font-size: 0.72rem;">{{ cat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Showcase -->
    <section class="py-5 bg-white">
      <div class="container max-w-7xl px-4">
        <div class="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
          <div>
            <span class="text-uppercase text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 0.08em;">Barang Pilihan Minggu Ini</span>
            <h2 class="fw-bold text-dark m-0" style="font-size: 1.75rem;">Produk Thrift Siap Ekspedisi</h2>
          </div>
          <div class="d-flex gap-2">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="actions.navigate('catalog')"
            >
              Filter Berdasarkan Grade & Harga <i class="bi bi-funnel ms-1"></i>
            </button>
          </div>
        </div>

        <!-- Product Cards Grid -->
        <div class="row g-4">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="col-lg-3 col-md-6 col-sm-6"
          >
            <div class="cp-card cp-card-hover h-100 d-flex flex-column overflow-hidden position-relative">
              <!-- Thrift Badge & Wishlist Button -->
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

              <!-- Image Container -->
              <div
                class="position-relative overflow-hidden cursor-pointer"
                style="height: 220px; background-color: #f7f4ee;"
                @click="actions.navigate('detail', { productId: product.id })"
              >
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-100 h-100 object-fit-cover transition"
                />
                <span
                  v-if="calculateSavings(product.originalPrice, product.price)"
                  class="position-absolute bottom-2 start-2 badge bg-dark text-warning"
                  style="font-size: 0.7rem;"
                >
                  {{ calculateSavings(product.originalPrice, product.price) }}
                </span>
              </div>

              <!-- Product Info -->
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

                <!-- Minus Sneak Peek -->
                <p class="text-muted small mb-3 text-truncate" style="font-size: 0.78rem;">
                  <i class="bi bi-search text-warning me-1"></i> {{ product.flawDetails }}
                </p>

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
                      Hanya 1 Pcs
                    </span>
                  </div>

                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-sm btn-forest flex-grow-1 fw-bold"
                      @click="actions.addToCart(product)"
                    >
                      <i class="bi bi-cart-plus me-1"></i> Beli
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

        <div class="text-center mt-5">
          <button
            type="button"
            class="btn btn-outline-dark btn-lg px-5 fw-bold"
            @click="actions.navigate('catalog')"
          >
            Jelajahi Seluruh Koleksi ({{ state.products.length }} Produk)
          </button>
        </div>
      </div>
    </section>

    <!-- Condition Grade Guide Section -->
    <section class="py-5" style="background-color: #f7f4ee;">
      <div class="container max-w-7xl px-4">
        <div class="text-center mb-5">
          <span class="text-uppercase text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 0.08em;">Standar Kurasi CPazra</span>
          <h2 class="fw-bold text-dark m-0" style="font-size: 1.75rem;">Sistem Grading Kondisi Thrift</h2>
          <p class="text-muted small mt-2">Setiap produk diuji coba fungsi mekanik (zipper, buckle, waterproofness) dan dinilai berdasarkan standar ketat berikut:</p>
        </div>

        <div class="row g-4">
          <div class="col-md-3 col-6">
            <div class="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
              <span class="grade-badge-s d-inline-block align-self-start mb-2">GRADE S · LIKE NEW</span>
              <h6 class="fw-bold text-dark">Kondisi Sempurna (9.5 - 10/10)</h6>
              <p class="text-muted small mb-0" style="font-size: 0.8rem; line-height: 1.5;">
                Barang nyaris seperti baru keluar dari toko. Tanpa cacat, kain mulus, coating waterproof utuh, dan warna masih 100% cerah.
              </p>
            </div>
          </div>

          <div class="col-md-3 col-6">
            <div class="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
              <span class="grade-badge-a d-inline-block align-self-start mb-2">GRADE A · SANGAT MULUS</span>
              <h6 class="fw-bold text-dark">Mulus Terawat (8.5 - 9.4/10)</h6>
              <p class="text-muted small mb-0" style="font-size: 0.8rem; line-height: 1.5;">
                Pemakaian wajar 1-2 kali trip. Mungkin ada lecet halus di gesper atau sablon dalam, namun fungsi teknis 100% prima.
              </p>
            </div>
          </div>

          <div class="col-md-3 col-6">
            <div class="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
              <span class="grade-badge-b d-inline-block align-self-start mb-2">GRADE B · GOOD CONDITION</span>
              <h6 class="fw-bold text-dark">Kondisi Bagus (7.5 - 8.4/10)</h6>
              <p class="text-muted small mb-0" style="font-size: 0.8rem; line-height: 1.5;">
                Ada tanda pemakaian nyata seperti tapak sol aus 10-15% atau pudar tipis karena matahari, namun tetap kuat dan layak pakai.
              </p>
            </div>
          </div>

          <div class="col-md-3 col-6">
            <div class="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
              <span class="grade-badge-c d-inline-block align-self-start mb-2">GRADE C · FAIR / PROYEK</span>
              <h6 class="fw-bold text-dark">Butuh Servis (Di bawah 7.5)</h6>
              <p class="text-muted small mb-0" style="font-size: 0.8rem; line-height: 1.5;">
                Harga sangat murah! Ada minus yang dicatat jelas (seperti zipper macet atau jahitan perlu dijahit ulang oleh pembeli).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial & Social Proof -->
    <section class="py-5 bg-white border-top">
      <div class="container max-w-7xl px-4">
        <div class="row align-items-center g-4">
          <div class="col-lg-4">
            <span class="text-uppercase text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 0.08em;">Suara Pendaki CPazra</span>
            <h3 class="fw-bold text-dark mb-3">Dipercaya Lebih dari 1.200 Petualang</h3>
            <p class="text-muted small" style="line-height: 1.6;">
              Dari pendaki Gunung Rinjani, Semeru, hingga pegiat ultralight hiking di seluruh Indonesia mengandalkan kurasi thrift kami.
            </p>
            <div class="d-flex align-items-center gap-2">
              <div class="text-warning fs-5">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
              <span class="fw-bold text-dark">4.9 / 5.0</span>
              <span class="text-muted small">(420+ Review Terverifikasi)</span>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="row g-3">
              <div class="col-md-6" v-for="review in state.reviews.slice(0, 2)" :key="review.id">
                <div class="p-3 rounded-3 border bg-light h-100">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-dark small">{{ review.userName }}</span>
                    <div class="text-warning small">
                      <i v-for="i in review.rating" :key="i" class="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <p class="text-secondary small fst-italic mb-2" style="line-height: 1.5;">
                    "{{ review.comment }}"
                  </p>
                  <span class="text-muted" style="font-size: 0.7rem;">{{ review.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
