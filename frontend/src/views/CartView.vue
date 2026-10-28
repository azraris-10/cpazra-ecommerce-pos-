<script setup>
import { computed, ref } from 'vue'
import { state, actions, cartItemCount, cartSubtotal, cartDiscount, cartTotal, formatIDR } from '../services/store'

const voucherInput = ref('')
const selectedCourier = ref('JNE Reguler')
const shippingFee = computed(() => {
  if (selectedCourier.value === 'Ambil di Toko Offline (Malang)') return 0
  if (selectedCourier.value === 'JNE YES Kilat') return 45000
  if (selectedCourier.value === 'SiCepat BEST') return 28000
  return 25000 // JNE Reguler
})

const grandTotalWithShipping = computed(() => {
  return cartTotal.value + shippingFee.value
})

function applyVoucherCode() {
  if (voucherInput.value.trim()) {
    actions.applyVoucher(voucherInput.value)
    voucherInput.value = ''
  }
}

function handleProceedCheckout() {
  if (state.cart.length === 0) {
    actions.showToast('Keranjang belanja Anda masih kosong!', 'warning')
    return
  }
  actions.navigate('checkout')
}

function getGradeClass(grade) {
  if (grade.includes('Grade S')) return 'grade-badge-s'
  if (grade.includes('Grade A')) return 'grade-badge-a'
  if (grade.includes('Grade B')) return 'grade-badge-b'
  return 'grade-badge-c'
}
</script>

<template>
  <div class="py-4" style="background-color: #fbf9f6; min-height: 80vh;">
    <div class="container max-w-7xl px-3 px-md-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="cp-breadcrumb mb-3 small">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item"><a href="#" @click.prevent="actions.navigate('home')">Beranda</a></li>
          <li class="breadcrumb-item active text-secondary" aria-current="page">Keranjang Belanja</li>
        </ol>
      </nav>

      <h1 class="fw-bold text-dark mb-4" style="font-size: 1.85rem; letter-spacing: -0.02em;">
        Keranjang Belanja Anda ({{ cartItemCount }} Item)
      </h1>

      <div v-if="state.cart.length > 0" class="row g-4">
        <!-- Col Left: Itemized Cart Table -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
            <div class="table-responsive">
              <table class="table align-middle m-0">
                <thead class="table-light text-secondary small">
                  <tr>
                    <th scope="col" style="min-width: 250px;">Produk Thrift</th>
                    <th scope="col">Harga</th>
                    <th scope="col" style="width: 140px;" class="text-center">Jumlah</th>
                    <th scope="col" class="text-end">Subtotal</th>
                    <th scope="col" style="width: 40px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in state.cart" :key="item.productId">
                    <!-- Product Info -->
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <img
                          :src="item.image"
                          :alt="item.name"
                          class="rounded-3 object-fit-cover border"
                          style="width: 64px; height: 64px; background: #f3efe9;"
                        />
                        <div>
                          <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="text-muted fw-bold text-uppercase" style="font-size: 0.7rem;">
                              {{ item.brand }}
                            </span>
                            <span :class="getGradeClass(item.conditionGrade)" style="font-size: 0.65rem;">
                              {{ item.conditionGrade }}
                            </span>
                          </div>
                          <h6
                            class="fw-bold text-dark mb-1 cursor-pointer text-truncate"
                            style="max-width: 200px;"
                            :title="item.name"
                            @click="actions.navigate('detail', { productId: item.productId })"
                          >
                            {{ item.name }}
                          </h6>
                          <span class="text-muted small" style="font-size: 0.75rem;">Size: {{ item.size }}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Price -->
                    <td class="price-tag fw-medium text-dark text-nowrap">
                      {{ formatIDR(item.price) }}
                    </td>

                    <!-- Quantity Stepper -->
                    <td>
                      <div class="input-group input-group-sm mx-auto" style="width: 100px;">
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="actions.updateCartQuantity(item.productId, item.quantity - 1)"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          readonly
                          :value="item.quantity"
                          class="form-control text-center fw-bold bg-white"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          :disabled="item.quantity >= item.stock"
                          @click="actions.updateCartQuantity(item.productId, item.quantity + 1)"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <!-- Subtotal per item -->
                    <td class="text-end fw-bold text-success price-tag text-nowrap">
                      {{ formatIDR(item.price * item.quantity) }}
                    </td>

                    <!-- Delete button -->
                    <td class="text-end">
                      <button
                        type="button"
                        class="btn btn-link text-danger p-0"
                        title="Hapus Item"
                        @click="actions.removeFromCart(item.productId)"
                      >
                        <i class="bi bi-trash fs-5"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm"
                @click="actions.navigate('catalog')"
              >
                <i class="bi bi-arrow-left me-1"></i> Lanjut Belanja
              </button>
              <button
                type="button"
                class="btn btn-link text-danger text-decoration-none btn-sm"
                @click="actions.clearCart()"
              >
                <i class="bi bi-trash me-1"></i> Kosongkan Keranjang
              </button>
            </div>
          </div>

          <!-- Voucher Promo Input Box -->
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
            <h6 class="fw-bold text-dark mb-2">
              <i class="bi bi-ticket-perforated-fill text-warning me-1"></i> Gunakan Voucher Promo CPazra
            </h6>
            <div class="input-group mb-2" style="max-width: 480px;">
              <input
                v-model="voucherInput"
                type="text"
                class="form-control text-uppercase"
                placeholder="Masukkan kode voucher (contoh: OUTDOOR20)"
                @keyup.enter="applyVoucherCode"
              />
              <button class="btn btn-forest fw-bold px-4" type="button" @click="applyVoucherCode">
                Terapkan
              </button>
            </div>

            <!-- Pre-filled coupon buttons for quick testing -->
            <div class="d-flex flex-wrap align-items-center gap-2 small">
              <span class="text-muted">Voucher Tersedia:</span>
              <button
                type="button"
                class="btn btn-sm btn-outline-warning text-dark border-dashed py-0 px-2 fw-semibold"
                style="font-size: 0.75rem;"
                @click="actions.applyVoucher('OUTDOOR20')"
              >
                OUTDOOR20 (Diskon 20%)
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-warning text-dark border-dashed py-0 px-2 fw-semibold"
                style="font-size: 0.75rem;"
                @click="actions.applyVoucher('HEMAT50')"
              >
                HEMAT50 (Potongan Rp 50rb)
              </button>
            </div>

            <!-- Active Applied Voucher Badge -->
            <div v-if="state.appliedVoucher" class="alert alert-success d-flex justify-content-between align-items-center py-2 px-3 mt-3 mb-0">
              <div class="d-flex align-items-center gap-2 small">
                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                <div>
                  <strong>Voucher {{ state.appliedVoucher.code }} Aktif:</strong>
                  Hemat {{ formatIDR(cartDiscount) }}
                </div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" @click="actions.removeVoucher()">
                Hapus
              </button>
            </div>
          </div>
        </div>

        <!-- Col Right: Summary & Checkout Calculation -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style="top: 100px;">
            <h5 class="fw-bold text-dark border-bottom pb-3 mb-3">
              Ringkasan Pesanan
            </h5>

            <!-- Subtotal & Discount -->
            <div class="d-flex justify-content-between mb-2 small text-secondary">
              <span>Total Harga ({{ cartItemCount }} Barang)</span>
              <span class="text-dark fw-bold price-tag">{{ formatIDR(cartSubtotal) }}</span>
            </div>

            <div v-if="cartDiscount > 0" class="d-flex justify-content-between mb-2 small text-success fw-semibold">
              <span>Diskon Voucher Promo</span>
              <span class="price-tag">- {{ formatIDR(cartDiscount) }}</span>
            </div>

            <!-- Shipping Courier Selector -->
            <div class="my-3 pt-2 border-top">
              <label class="form-label small fw-bold text-muted mb-1">Pilih Ekspedisi Pengiriman</label>
              <select v-model="selectedCourier" class="form-select form-select-sm mb-2">
                <option value="JNE Reguler">JNE Reguler (Rp 25.000) - 2-3 Hari</option>
                <option value="JNE YES Kilat">JNE YES Kilat (Rp 45.000) - 1 Hari</option>
                <option value="SiCepat BEST">SiCepat BEST (Rp 28.000) - 1-2 Hari</option>
                <option value="Ambil di Toko Offline (Malang)">Ambil di Toko CPazra Malang (Gratis Rp 0)</option>
              </select>
              <div class="d-flex justify-content-between small text-secondary">
                <span>Ongkos Kirim</span>
                <span class="text-dark fw-bold price-tag">{{ formatIDR(shippingFee) }}</span>
              </div>
            </div>

            <!-- Grand Total Calculation -->
            <div class="border-top pt-3 mb-4">
              <div class="d-flex justify-content-between align-items-baseline">
                <span class="fs-6 fw-bold text-dark">Total Tagihan</span>
                <span class="fs-4 fw-bold text-success price-tag">
                  {{ formatIDR(grandTotalWithShipping) }}
                </span>
              </div>
              <span class="text-muted small d-block mt-1" style="font-size: 0.75rem;">
                *Termasuk garansi toko 7 hari & asuransi pengiriman
              </span>
            </div>

            <!-- Checkout Button -->
            <button
              type="button"
              class="btn btn-warning text-dark w-100 py-3 fw-bold fs-6 shadow-sm mb-2"
              @click="handleProceedCheckout"
            >
              Lanjut ke Pembayaran <i class="bi bi-arrow-right ms-1"></i>
            </button>

            <!-- Trust badges -->
            <div class="text-center text-muted small mt-2" style="font-size: 0.75rem;">
              <i class="bi bi-shield-check text-success me-1"></i> Transaksi Aman dengan QRIS & Transfer Bank
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div v-else class="text-center py-5 bg-white rounded-4 shadow-sm p-5 my-4">
        <i class="bi bi-cart-x fs-1 text-muted d-block mb-3" style="font-size: 3rem !important;"></i>
        <h4 class="fw-bold text-dark mb-2">Keranjang Belanja Masih Kosong</h4>
        <p class="text-muted small mb-4" style="max-width: 480px; margin: 0 auto;">
          Belum ada perlengkapan hiking atau jaket thrift yang Anda pilih. Yuk temukan gear outdoor favorit Anda dengan harga hemat!
        </p>
        <button
          type="button"
          class="btn btn-forest px-4 py-2 fw-bold"
          @click="actions.navigate('catalog')"
        >
          <i class="bi bi-compass me-2"></i> Jelajahi Katalog Thrift Sekarang
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.border-dashed {
  border-style: dashed !important;
}
</style>
