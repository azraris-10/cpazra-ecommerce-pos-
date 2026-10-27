<script setup>
import { computed } from 'vue'
import { state, actions, formatIDR } from '../services/store'

const order = computed(() => {
  const found = state.orders.find((o) => o.id === state.selectedOrderId)
  return found || state.orders[0]
})

function printReceipt() {
  window.print()
}
</script>

<template>
  <div class="py-5" style="background-color: #fbf9f6; min-height: 85vh;">
    <div class="container max-w-4xl px-3 px-md-4">
      <!-- Success Banner Card -->
      <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center mb-4">
        <div class="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mx-auto mb-3" style="width: 72px; height: 72px;">
          <i class="bi bi-check-lg fs-1"></i>
        </div>
        <h2 class="fw-bold text-dark mb-1">Terima Kasih, Pesanan Anda Berhasil!</h2>
        <p class="text-muted small mb-3">
          Nomor Pesanan: <span class="fw-bold text-dark fs-6 font-mono">#{{ order.id }}</span>
        </p>
        <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border mx-auto mb-4" style="font-size: 0.85rem;">
          <span class="text-muted">Status Pesanan:</span>
          <span class="badge bg-success">{{ order.status }}</span>
          <span class="text-muted">· Pembayaran:</span>
          <span class="badge bg-primary">{{ order.paymentStatus }}</span>
        </div>

        <p class="text-secondary small mb-4" style="max-width: 580px; margin: 0 auto; line-height: 1.6;">
          Kami telah mencatat pesanan Anda di sistem CPazra. Perlengkapan outdoor Anda akan segera diinspeksi ulang, disterilkan, dan dipacking rapi untuk dikirim via <strong>{{ order.shippingCourier }}</strong>.
        </p>

        <!-- Quick CTAs -->
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <a
            :href="`https://wa.me/6281234567890?text=Halo%20Admin%20CPazra,%20saya%20sudah%20melakukan%20checkout%20pesanan%20nomor%20%23${order.id}%20sebesar%20${encodeURIComponent(formatIDR(order.total))}`"
            target="_blank"
            class="btn btn-success fw-bold px-4 py-2"
          >
            <i class="bi bi-whatsapp me-2"></i> Konfirmasi ke WhatsApp Admin
          </a>
          <button type="button" class="btn btn-outline-dark fw-bold px-4 py-2" @click="printReceipt">
            <i class="bi bi-printer me-2"></i> Cetak Struk Transaksi
          </button>
          <button type="button" class="btn btn-forest fw-bold px-4 py-2" @click="actions.navigate('catalog')">
            <i class="bi bi-shop me-2"></i> Belanja Lagi
          </button>
        </div>
      </div>

      <!-- Printable Thermal Invoice / Receipt Card -->
      <div class="thermal-receipt rounded-3 p-4 bg-white shadow-sm mb-5">
        <div class="text-center mb-3 pb-3 border-bottom border-dashed">
          <h5 class="fw-bold m-0 tracking-tight text-dark">CPAZRA OUTDOOR & THRIFT</h5>
          <span class="small text-muted d-block" style="font-size: 0.75rem;">Jl. Raya Semeru No. 88, Oro-oro Dowo, Malang</span>
          <span class="small text-muted d-block" style="font-size: 0.75rem;">WhatsApp: 0812-3456-7890 · Web: cpazra.id</span>
        </div>

        <!-- Receipt Meta -->
        <div class="small mb-3 text-secondary" style="font-size: 0.78rem;">
          <div class="d-flex justify-content-between">
            <span>No. Order:</span>
            <span class="fw-bold text-dark font-mono">#{{ order.id }}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>Tanggal:</span>
            <span>{{ new Date(order.createdAt).toLocaleString('id-ID') }}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>Pelanggan:</span>
            <span class="fw-bold text-dark">{{ order.customer.name }}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>Ekspedisi:</span>
            <span>{{ order.shippingCourier }}</span>
          </div>
          <div v-if="order.trackingNumber" class="d-flex justify-content-between">
            <span>Resi Pengiriman:</span>
            <span class="fw-bold text-primary font-mono">{{ order.trackingNumber }}</span>
          </div>
        </div>

        <hr class="border-dashed my-2">

        <!-- Receipt Item List -->
        <div class="mb-3 small">
          <div
            v-for="item in order.items"
            :key="item.productId"
            class="py-1 border-bottom border-light"
          >
            <div class="d-flex justify-content-between fw-bold text-dark">
              <span>{{ item.name }}</span>
              <span class="font-mono">{{ formatIDR(item.price * item.quantity) }}</span>
            </div>
            <div class="d-flex justify-content-between text-muted" style="font-size: 0.72rem;">
              <span>{{ item.quantity }}x @{{ formatIDR(item.price) }} · Size {{ item.size }}</span>
              <span>({{ item.conditionGrade }})</span>
            </div>
          </div>
        </div>

        <!-- Receipt Totals -->
        <div class="small text-secondary" style="font-size: 0.8rem;">
          <div class="d-flex justify-content-between mb-1">
            <span>Subtotal:</span>
            <span class="font-mono text-dark">{{ formatIDR(order.subtotal) }}</span>
          </div>
          <div v-if="order.discount > 0" class="d-flex justify-content-between mb-1 text-success">
            <span>Diskon Voucher ({{ order.voucherCode }}):</span>
            <span class="font-mono">- {{ formatIDR(order.discount) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span>Ongkos Kirim:</span>
            <span class="font-mono text-dark">{{ formatIDR(order.shippingFee) }}</span>
          </div>
          <hr class="border-dashed my-2">
          <div class="d-flex justify-content-between fs-6 fw-bold text-dark">
            <span>TOTAL DIBAYAR:</span>
            <span class="font-mono text-success">{{ formatIDR(order.total) }}</span>
          </div>
          <div class="d-flex justify-content-between text-muted mt-1" style="font-size: 0.75rem;">
            <span>Metode:</span>
            <span class="fw-bold text-dark">{{ order.paymentMethod }}</span>
          </div>
        </div>

        <!-- Receipt Footer Note -->
        <div class="text-center mt-4 pt-3 border-top border-dashed small text-muted" style="font-size: 0.72rem;">
          <div>*** SIMPAN STRUK INI SEBAGAI BUKTI GARANSI 7 HARI ***</div>
          <div>Barang thrift telah lolos seleksi uji coba mekanis dan kebersihan.</div>
          <div>Salam Lestari & Selamat Berpetualang!</div>
        </div>
      </div>
    </div>
  </div>
</template>
