<script setup>
import { computed, reactive } from 'vue'
import { state, actions } from '../services/store'

const currentView = computed(() => state.currentView)

const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

function submitContact() {
  actions.showToast('Pesan Anda telah terkirim! Tim CPazra akan membalas via email/WhatsApp.', 'success')
  contactForm.name = ''
  contactForm.email = ''
  contactForm.subject = ''
  contactForm.message = ''
}
</script>

<template>
  <div class="py-5" style="background-color: #fbf9f6; min-height: 80vh;">
    <div class="container max-w-4xl px-3 px-md-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="cp-breadcrumb mb-4 small">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item"><a href="#" @click.prevent="actions.navigate('home')">Beranda</a></li>
          <li class="breadcrumb-item active text-secondary" aria-current="page">Bantuan & Informasi</li>
        </ol>
      </nav>

      <!-- 1. CARA BELANJA -->
      <div v-if="currentView === 'cara-belanja'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 class="fw-bold text-dark mb-4">
          <i class="bi bi-cart-check text-warning me-2"></i> Cara Belanja Online di CPazra Outdoor
        </h2>

        <div class="d-flex flex-column gap-4">
          <div class="d-flex gap-3">
            <div class="bg-forest text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style="width: 44px; height: 44px; background-color: #1b3b2b;">
              1
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-1">Cari & Periksa Grade Kondisi Thrift</h5>
              <p class="text-secondary small" style="line-height: 1.6;">
                Jelajahi katalog kami. Buka detail produk untuk membaca <strong>Catatan Detail Minus</strong> dan checklist inspeksi 5-titik. Kami memotret produk langsung tanpa manipulasi pencahayaan berlebih.
              </p>
            </div>
          </div>

          <div class="d-flex gap-3">
            <div class="bg-forest text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style="width: 44px; height: 44px; background-color: #1b3b2b;">
              2
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-1">Masukkan ke Keranjang & Pasang Voucher</h5>
              <p class="text-secondary small" style="line-height: 1.6;">
                Klik tombol "Tambah ke Keranjang". Masukkan kode voucher promo seperti <code>OUTDOOR20</code> atau <code>HEMAT50</code> untuk mendapatkan potongan harga langsung.
              </p>
            </div>
          </div>

          <div class="d-flex gap-3">
            <div class="bg-forest text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style="width: 44px; height: 44px; background-color: #1b3b2b;">
              3
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-1">Isi Alamat & Pilih Metode Pembayaran</h5>
              <p class="text-secondary small" style="line-height: 1.6;">
                Lengkapi nama, nomor WhatsApp, dan alamat pengiriman Anda. Pilih kurir (JNE, SiCepat, atau Ambil di Toko). Bayar praktis menggunakan QRIS, Transfer Bank BCA, atau COD.
              </p>
            </div>
          </div>

          <div class="d-flex gap-3">
            <div class="bg-forest text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style="width: 44px; height: 44px; background-color: #1b3b2b;">
              4
            </div>
            <div>
              <h5 class="fw-bold text-dark mb-1">Paket Dikirim & Garansi Toko 7 Hari</h5>
              <p class="text-secondary small" style="line-height: 1.6;">
                Simpan struk nota order Anda. Paket dipacking aman dengan bubble wrap dan stiker fragile. Nikmati masa uji coba 7 hari untuk memvalidasi performa gear Anda!
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-top text-center">
          <button type="button" class="btn btn-forest px-4 py-2 fw-bold" @click="actions.navigate('catalog')">
            <i class="bi bi-compass me-2"></i> Mulai Belanja Sekarang
          </button>
        </div>
      </div>

      <!-- 2. FAQ -->
      <div v-else-if="currentView === 'faq'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 class="fw-bold text-dark mb-4">
          <i class="bi bi-question-circle text-warning me-2"></i> Pertanyaan yang Sering Diajukan (FAQ)
        </h2>

        <div class="accordion accordion-flush" id="faqAccordion">
          <div class="accordion-item border-bottom py-2">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed fw-bold text-dark bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                Apakah semua barang outdoor di CPazra 100% original?
              </button>
            </h2>
            <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body text-secondary small" style="line-height: 1.6;">
                Ya, 100% original. Tim kurator CPazra memeriksa label jahitan, font bordir, jenis zipper (YKK/Vislon/WaterTight), dan kode nomor seri untuk menjamin keaslian setiap barang sebelum dipajang.
              </div>
            </div>
          </div>

          <div class="accordion-item border-bottom py-2">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed fw-bold text-dark bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                Apakah barang thrift sudah dicuci dan higienis?
              </button>
            </h2>
            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body text-secondary small" style="line-height: 1.6;">
                Semua pakaian (jaket, fleece, celana) dan tas carrier telah melalui proses pencucian khusus bahan outdoor (menggunakan sabun tech-wash tanpa merusak coating DWR/Gore-Tex) dan sterilisasi ozone higienis.
              </div>
            </div>
          </div>

          <div class="accordion-item border-bottom py-2">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed fw-bold text-dark bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                Bagaimana jika barang yang sampai tidak sesuai deskripsi minus?
              </button>
            </h2>
            <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body text-secondary small" style="line-height: 1.6;">
                Kami menyediakan Garansi Pengembalian 7 Hari. Apabila terdapat cacat mayor yang tidak disebutkan di deskripsi produk, Anda berhak mengajukan retur dan kami ganti 100% uang Anda termasuk ongkir retur.
              </div>
            </div>
          </div>

          <div class="accordion-item border-bottom py-2">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed fw-bold text-dark bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                Apakah bisa datang dan mencoba langsung di toko fisik?
              </button>
            </h2>
            <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div class="accordion-body text-secondary small" style="line-height: 1.6;">
                Tentu saja! Anda bisa mengunjungi showroom offline kami di Jl. Raya Semeru No. 88, Kota Malang, Jawa Timur. Transaksi di toko menggunakan sistem Terminal POS kasir CPazra.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. KEBIJAKAN PENGEMBALIAN & GARANSI -->
      <div v-else-if="currentView === 'kebijakan-pengembalian'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 class="fw-bold text-dark mb-4">
          <i class="bi bi-shield-check text-warning me-2"></i> Kebijakan Garansi & Pengembalian 7 Hari
        </h2>

        <p class="text-secondary small" style="line-height: 1.7;">
          Di CPazra, kepuasan dan keselamatan petualangan Anda adalah prioritas utama. Karena barang thrifting memiliki karakteristik unit yang unik (one-of-a-kind), kami memberikan perlindungan garansi sebagai berikut:
        </p>

        <div class="p-3 bg-light rounded-3 border mb-4 small text-secondary">
          <h6 class="fw-bold text-dark mb-2">Syarat Pengajuan Klaim Garansi:</h6>
          <ol class="m-0 ps-3 d-flex flex-column gap-1">
            <li>Klaim diajukan maksimal 7x24 jam sejak barang diterima berdasarkan status tracking ekspedisi.</li>
            <li>Ditemukan cacat/kerusakan fungsional yang <strong>tidak disebutkan</strong> di deskripsi minus produk (misal: membran bocor parah padahal tercatat aman).</li>
            <li>Melampirkan video unboxing paket dan foto nota struk pesanan (#CPZ-xxxx).</li>
            <li>Barang belum diubah atau diperbaiki secara mandiri oleh pembeli.</li>
          </ol>
        </div>

        <p class="text-secondary small" style="line-height: 1.6;">
          Untuk pengajuan retur cepat, silakan hubungi Customer Care WhatsApp kami di <strong>0812-3456-7890</strong> dengan menyertakan Nomor Pesanan Anda.
        </p>
      </div>

      <!-- 4. SYARAT & KETENTUAN -->
      <div v-else-if="currentView === 'syarat-ketentuan'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 class="fw-bold text-dark mb-4">
          <i class="bi bi-file-earmark-text text-warning me-2"></i> Syarat dan Ketentuan Transaksi
        </h2>
        <div class="text-secondary small d-flex flex-column gap-3" style="line-height: 1.7;">
          <p>
            1. <strong>Sifat Produk Thrifting:</strong> Produk yang dijual berstatus barang seken/thrift terkurasi original. Konsumen menyetujui bahwa kondisi fisik mengacu pada deskripsi grade dan catatan minus yang tertera di halaman produk.
          </p>
          <p>
            2. <strong>Stok Unit:</strong> Sebagian besar barang thrift hanya tersedia 1 unit per item. Barang dinyatakan sah terbeli setelah status pembayaran terverifikasi di sistem kasir/checkout.
          </p>
          <p>
            3. <strong>Pengiriman:</strong> CPazra bertanggung jawab mengemas barang dengan standar proteksi outdoor dan menyerahkan ke kurir yang dipilih oleh pembeli.
          </p>
        </div>
      </div>

      <!-- 5. KEBIJAKAN PRIVASI -->
      <div v-else-if="currentView === 'kebijakan-privasi'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 class="fw-bold text-dark mb-4">
          <i class="bi bi-lock text-warning me-2"></i> Kebijakan Privasi
        </h2>
        <div class="text-secondary small d-flex flex-column gap-3" style="line-height: 1.7;">
          <p>
            CPazra menghargai privasi data Anda. Informasi kontak, nomor WhatsApp, dan alamat pengiriman yang Anda masukkan hanya digunakan untuk keperluan pengiriman pesanan dan konfirmasi bukti struk transaksi. Kami tidak pernah membagikan data Anda kepada pihak ketiga manapun.
          </p>
        </div>
      </div>

      <!-- 6. HUBUNGI KAMI -->
      <div v-else-if="currentView === 'hubungi-kami'" class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 class="fw-bold text-dark mb-3">
          <i class="bi bi-chat-dots text-warning me-2"></i> Hubungi Customer Care CPazra
        </h2>
        <p class="text-secondary small mb-4">
          Punya pertanyaan seputar ukuran jaket, rekomendasi carrier, atau ingin titip jual gear outdoor? Kirimkan pesan Anda:
        </p>

        <form @submit.prevent="submitContact">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-bold">Nama Lengkap</label>
              <input v-model="contactForm.name" type="text" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold">Email atau No. WhatsApp</label>
              <input v-model="contactForm.email" type="text" class="form-control" required />
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold">Subjek Pesan</label>
              <input v-model="contactForm.subject" type="text" class="form-control" placeholder="Tanya detail produk, konsultasi ukuran..." required />
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold">Isi Pesan</label>
              <textarea v-model="contactForm.message" rows="4" class="form-control" placeholder="Tuliskan pertanyaan Anda..." required></textarea>
            </div>
            <div class="col-12 mt-3">
              <button type="submit" class="btn btn-forest fw-bold px-4 py-2">
                <i class="bi bi-send me-1"></i> Kirim Pesan
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- 7. NOTIFIKASI -->
      <div v-else class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <h2 class="fw-bold text-dark mb-3">
          <i class="bi bi-bell text-warning me-2"></i> Pusat Notifikasi Akun
        </h2>
        <div class="d-flex flex-column gap-3">
          <div class="p-3 bg-light rounded-3 border d-flex gap-3 align-items-center">
            <i class="bi bi-box-seam text-success fs-3"></i>
            <div>
              <div class="fw-bold text-dark small">Pesanan #CPZ-9825 Sedang Diproses</div>
              <div class="text-muted" style="font-size: 0.75rem;">Osprey Aether 65 Pack sedang disiapkan oleh tim logistik.</div>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3 border d-flex gap-3 align-items-center">
            <i class="bi bi-ticket-perforated text-warning fs-3"></i>
            <div>
              <div class="fw-bold text-dark small">Voucher Baru: OUTDOOR20</div>
              <div class="text-muted" style="font-size: 0.75rem;">Gunakan kode OUTDOOR20 untuk diskon 20% belanja gear hiking.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
