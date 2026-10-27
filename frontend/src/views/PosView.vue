<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const posSearch = ref('')
const posCategory = ref('Semua')
const paymentMethod = ref('Tunai')
const showReceiptModal = ref(false)
const recentReceipt = ref(null)

const currentTime = ref(new Date().toLocaleTimeString('id-ID'))
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('id-ID')
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const categories = ['Semua', 'Jaket', 'Tas', 'Sepatu', 'Camping', 'Outdoor Gear']

const posProducts = computed(() => {
  return state.products.filter((p) => {
    if (posCategory.value !== 'Semua' && p.category !== posCategory.value) {
      return false
    }
    const q = posSearch.value.toLowerCase().trim()
    if (q) {
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      )
    }
    return true
  })
})

const posTotal = computed(() => {
  return state.posCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const posChange = computed(() => {
  if (paymentMethod.value !== 'Tunai') return 0
  return Math.max(0, (state.posCashTendered || 0) - posTotal.value)
})

function setCashTender(amount) {
  if (amount === 'pas') {
    state.posCashTendered = posTotal.value
  } else {
    state.posCashTendered = amount
  }
}

function handleCompleteTransaction() {
  if (state.posCart.length === 0) {
    actions.showToast('Keranjang kasir masih kosong!', 'warning')
    return
  }

  if (paymentMethod.value === 'Tunai' && state.posCashTendered < posTotal.value) {
    actions.showToast('Uang tunai yang diterima kurang dari total belanja!', 'warning')
    return
  }

  const receipt = actions.completePosTransaction(paymentMethod.value)
  recentReceipt.value = receipt
  showReceiptModal.value = true
}

function printPosReceipt() {
  window.print()
}
</script>

<template>
  <div class="pos-container bg-light d-flex flex-column">
    <!-- POS Top Command Header -->
    <header class="bg-dark text-white py-2 px-3 d-flex justify-content-between align-items-center border-bottom shadow-sm" style="background-color: #12281d !important;">
      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <div class="bg-warning text-dark fw-bold px-2 py-0 rounded-2" style="font-size: 0.9rem;">
            POS
          </div>
          <span class="fw-bold tracking-tight text-white fs-6">Terminal Kasir CPazra (Malang #01)</span>
        </div>
        <span class="text-secondary d-none d-md-inline">|</span>
        <span class="small text-light text-opacity-75 d-none d-md-inline">
          <i class="bi bi-person-badge text-warning me-1"></i> Kasir: <strong>Ahmad Rizky</strong>
        </span>
      </div>

      <div class="d-flex align-items-center gap-3">
        <div class="d-none d-sm-block text-warning font-mono fw-bold small">
          <i class="bi bi-clock me-1"></i> {{ currentTime }}
        </div>
        <button
          type="button"
          class="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
          @click="actions.switchMode('store')"
        >
          <i class="bi bi-box-arrow-left"></i> Kembali ke Toko
        </button>
      </div>
    </header>

    <!-- POS Main Split View -->
    <div class="container-fluid flex-grow-1 p-2 p-md-3 overflow-hidden">
      <div class="row g-2 g-md-3 h-100">
        <!-- Col Left: Fast Catalog for Tally -->
        <div class="col-lg-7 d-flex flex-column h-100">
          <div class="card border-0 shadow-sm rounded-3 p-3 bg-white mb-2">
            <!-- Search & Filter Bar -->
            <div class="row g-2 align-items-center">
              <div class="col-md-7">
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0 text-muted">
                    <i class="bi bi-search"></i>
                  </span>
                  <input
                    v-model="posSearch"
                    type="text"
                    class="form-control border-start-0"
                    placeholder="Scan Barcode / Ketik SKU / Nama Thrift..."
                    autofocus
                  />
                  <button v-if="posSearch" type="button" class="btn btn-outline-secondary" @click="posSearch = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-5">
                <div class="d-flex gap-1 overflow-x-auto pb-1">
                  <button
                    v-for="cat in categories"
                    :key="cat"
                    type="button"
                    class="btn btn-sm text-nowrap py-1 px-2 fw-semibold"
                    :class="posCategory === cat ? 'btn-forest text-white' : 'btn-outline-secondary'"
                    style="font-size: 0.75rem;"
                    @click="posCategory = cat"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Touch Grid -->
          <div class="card border-0 shadow-sm rounded-3 p-2 bg-white flex-grow-1 pos-catalog-scroll">
            <div class="row g-2">
              <div
                v-for="product in posProducts"
                :key="product.id"
                class="col-xl-3 col-lg-4 col-md-4 col-6"
              >
                <div
                  class="card h-100 border p-2 cursor-pointer cp-card-hover"
                  style="cursor: pointer; background: #fff;"
                  @click="actions.addToPosCart(product)"
                >
                  <div class="rounded-2 overflow-hidden position-relative mb-2" style="height: 100px; background: #f3efe9;">
                    <img :src="product.image" :alt="product.name" class="w-100 h-100 object-fit-cover" />
                    <span class="position-absolute bottom-1 start-1 badge bg-dark text-warning" style="font-size: 0.65rem;">
                      {{ product.conditionGrade }}
                    </span>
                    <span v-if="product.stock <= 1" class="position-absolute top-1 end-1 badge bg-danger" style="font-size: 0.6rem;">
                      Sisa 1
                    </span>
                  </div>
                  <div class="small fw-bold text-dark text-truncate mb-0" :title="product.name">
                    {{ product.name }}
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-auto pt-1">
                    <span class="text-muted" style="font-size: 0.7rem;">{{ product.sku }}</span>
                    <span class="fw-bold text-success font-mono" style="font-size: 0.85rem;">
                      {{ formatIDR(product.price) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Col Right: Cash Register Drawer & Tally -->
        <div class="col-lg-5 d-flex flex-column h-100">
          <div class="card border-0 shadow-sm rounded-3 p-3 bg-white flex-grow-1 d-flex flex-column h-100">
            <!-- Customer Selector -->
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-person-circle text-muted fs-5"></i>
                <input
                  v-model="state.posCustomerName"
                  type="text"
                  class="form-control form-control-sm border-0 bg-light fw-bold"
                  placeholder="Nama Pelanggan (Default Walk-in)"
                  style="width: 180px;"
                />
              </div>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm py-0 px-2"
                style="font-size: 0.75rem;"
                :disabled="state.posCart.length === 0"
                @click="actions.clearPosCart()"
              >
                <i class="bi bi-trash"></i> Bersihkan
              </button>
            </div>

            <!-- Active Cart Item List -->
            <div class="pos-cart-scroll flex-grow-1 border rounded-2 p-2 mb-2 bg-light">
              <div v-if="state.posCart.length > 0" class="d-flex flex-column gap-2">
                <div
                  v-for="item in state.posCart"
                  :key="item.productId"
                  class="p-2 bg-white rounded-2 border d-flex justify-content-between align-items-center gap-2"
                >
                  <div class="flex-grow-1 text-truncate">
                    <div class="fw-bold text-dark text-truncate small" :title="item.name">{{ item.name }}</div>
                    <div class="text-muted font-mono" style="font-size: 0.75rem;">
                      {{ formatIDR(item.price) }} · Size {{ item.size }}
                    </div>
                  </div>

                  <!-- Stepper -->
                  <div class="input-group input-group-sm" style="width: 90px;">
                    <button
                      type="button"
                      class="btn btn-outline-secondary py-0 px-2"
                      @click="actions.updatePosCartQuantity(item.productId, item.quantity - 1)"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readonly
                      :value="item.quantity"
                      class="form-control text-center p-0 fw-bold bg-white"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary py-0 px-2"
                      @click="actions.updatePosCartQuantity(item.productId, item.quantity + 1)"
                    >
                      +
                    </button>
                  </div>

                  <span class="fw-bold text-success font-mono small text-nowrap" style="min-width: 80px; text-align: right;">
                    {{ formatIDR(item.price * item.quantity) }}
                  </span>
                </div>
              </div>
              <div v-else class="text-center text-muted py-5 small">
                <i class="bi bi-upc-scan fs-2 d-block mb-2 text-secondary"></i>
                Pilih atau klik produk di sebelah kiri untuk menambah ke struk kasir.
              </div>
            </div>

            <!-- Total Breakdown Banner -->
            <div class="p-3 bg-dark text-white rounded-3 mb-2" style="background-color: #1b3b2b !important;">
              <div class="d-flex justify-content-between align-items-center mb-1 text-light text-opacity-75 small">
                <span>Total Item: {{ state.posCart.reduce((sum, i) => sum + i.quantity, 0) }} Pcs</span>
                <span>Subtotal Kasir</span>
              </div>
              <div class="d-flex justify-content-between align-items-baseline">
                <span class="fs-6 text-warning fw-bold text-uppercase">Total Bayar:</span>
                <span class="display-6 fw-bold text-warning font-mono">{{ formatIDR(posTotal) }}</span>
              </div>
            </div>

            <!-- Payment Tender Controls -->
            <div class="border rounded-2 p-2 mb-2 bg-white">
              <!-- Payment Method Toggle -->
              <div class="btn-group w-100 mb-2" role="group">
                <input v-model="paymentMethod" type="radio" class="btn-check" name="posPay" id="payCash" value="Tunai" />
                <label class="btn btn-outline-success btn-sm fw-bold" for="payCash">
                  <i class="bi bi-cash me-1"></i> Tunai (Cash)
                </label>

                <input v-model="paymentMethod" type="radio" class="btn-check" name="posPay" id="payQris" value="QRIS Kasir" />
                <label class="btn btn-outline-success btn-sm fw-bold" for="payQris">
                  <i class="bi bi-qr-code me-1"></i> QRIS Toko
                </label>

                <input v-model="paymentMethod" type="radio" class="btn-check" name="posPay" id="payDebit" value="Kartu Debit" />
                <label class="btn btn-outline-success btn-sm fw-bold" for="payDebit">
                  <i class="bi bi-credit-card me-1"></i> Debit EDC
                </label>
              </div>

              <!-- Cash Received & Change (Only for Cash) -->
              <div v-if="paymentMethod === 'Tunai'">
                <div class="row g-1 mb-2">
                  <div class="col-3">
                    <button type="button" class="btn btn-light border btn-sm w-100 fw-bold small text-nowrap" @click="setCashTender('pas')">
                      Uang Pas
                    </button>
                  </div>
                  <div class="col-3">
                    <button type="button" class="btn btn-light border btn-sm w-100 fw-bold font-mono small text-nowrap" @click="setCashTender(500000)">
                      500.000
                    </button>
                  </div>
                  <div class="col-3">
                    <button type="button" class="btn btn-light border btn-sm w-100 fw-bold font-mono small text-nowrap" @click="setCashTender(1000000)">
                      1.000.000
                    </button>
                  </div>
                  <div class="col-3">
                    <button type="button" class="btn btn-light border btn-sm w-100 fw-bold font-mono small text-nowrap" @click="setCashTender(2000000)">
                      2.000.000
                    </button>
                  </div>
                </div>

                <div class="row g-2 align-items-center">
                  <div class="col-6">
                    <label class="form-label small fw-bold text-muted mb-0">Uang Diterima:</label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text bg-light">Rp</span>
                      <input
                        v-model.number="state.posCashTendered"
                        type="number"
                        step="1000"
                        class="form-control font-mono fw-bold text-end"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div class="col-6 text-end">
                    <label class="form-label small fw-bold text-muted mb-0">Kembalian:</label>
                    <div class="fs-5 fw-bold font-mono text-danger">
                      {{ formatIDR(posChange) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Process & Print Button -->
            <button
              type="button"
              class="btn btn-warning text-dark w-100 py-3 fw-bold fs-6 shadow-sm d-flex align-items-center justify-content-center gap-2"
              :disabled="state.posCart.length === 0"
              @click="handleCompleteTransaction"
            >
              <i class="bi bi-printer-fill fs-5"></i>
              Proses Transaksi & Cetak Struk
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Preview Modal -->
    <div
      v-if="showReceiptModal && recentReceipt"
      class="modal fade show d-block"
      style="background: rgba(0,0,0,0.7);"
      @click.self="showReceiptModal = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 p-3 shadow-lg">
          <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <h6 class="fw-bold m-0 text-success">
              <i class="bi bi-check-circle-fill me-1"></i> Transaksi Berhasil Dicatat
            </h6>
            <button type="button" class="btn-close" @click="showReceiptModal = false"></button>
          </div>

          <!-- Printable Struk -->
          <div class="thermal-receipt rounded-3 p-3 mb-3 border">
            <div class="text-center mb-2 pb-2 border-bottom border-dashed">
              <div class="fw-bold fs-6">CPAZRA OUTDOOR & THRIFT</div>
              <div class="small text-muted" style="font-size: 0.7rem;">Showroom Malang · 0812-3456-7890</div>
            </div>

            <div class="small mb-2" style="font-size: 0.72rem;">
              <div class="d-flex justify-content-between">
                <span>Struk:</span>
                <span class="fw-bold font-mono">#{{ recentReceipt.id }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Waktu:</span>
                <span>{{ recentReceipt.date }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Pelanggan:</span>
                <span class="fw-bold">{{ recentReceipt.customerName }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Kasir:</span>
                <span>{{ recentReceipt.cashier }}</span>
              </div>
            </div>

            <hr class="border-dashed my-1">

            <div class="small mb-2" style="font-size: 0.75rem;">
              <div v-for="item in recentReceipt.items" :key="item.productId" class="py-1">
                <div class="d-flex justify-content-between fw-bold">
                  <span>{{ item.name }}</span>
                  <span class="font-mono">{{ formatIDR(item.price * item.quantity) }}</span>
                </div>
                <div class="text-muted" style="font-size: 0.68rem;">
                  {{ item.quantity }}x @{{ formatIDR(item.price) }} · Size {{ item.size }}
                </div>
              </div>
            </div>

            <hr class="border-dashed my-1">

            <div class="small" style="font-size: 0.78rem;">
              <div class="d-flex justify-content-between fw-bold">
                <span>TOTAL:</span>
                <span class="font-mono">{{ formatIDR(recentReceipt.total) }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Metode:</span>
                <span>{{ recentReceipt.paymentMethod }}</span>
              </div>
              <div v-if="recentReceipt.paymentMethod === 'Tunai'" class="d-flex justify-content-between">
                <span>Uang Tunai:</span>
                <span class="font-mono">{{ formatIDR(recentReceipt.cashTendered) }}</span>
              </div>
              <div v-if="recentReceipt.paymentMethod === 'Tunai'" class="d-flex justify-content-between text-danger fw-bold">
                <span>Kembalian:</span>
                <span class="font-mono">{{ formatIDR(recentReceipt.change) }}</span>
              </div>
            </div>

            <div class="text-center mt-3 pt-2 border-top border-dashed small text-muted" style="font-size: 0.68rem;">
              <div>Terima kasih atas kunjungan Anda!</div>
              <div>Garansi retur 7 hari dengan nota asli.</div>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary w-50" @click="showReceiptModal = false">
              Tutup
            </button>
            <button type="button" class="btn btn-forest w-50 fw-bold" @click="printPosReceipt">
              <i class="bi bi-printer me-1"></i> Cetak Struk
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
