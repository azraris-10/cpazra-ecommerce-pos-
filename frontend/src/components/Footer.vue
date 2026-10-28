<script setup>
import { actions } from '../services/store'
</script>

<template>
  <footer class="mt-auto border-top" style="background-color: #12281d; color: #d1d5db;">
    <div class="container max-w-7xl py-5 px-4">
      <div class="row g-4">
        <!-- Col 1: Brand & Philosophy -->
        <div class="col-lg-4 col-md-6">
          <div class="d-flex align-items-center gap-2 mb-3">
            <div class="bg-warning text-dark rounded-2 fw-bold px-2 py-1" style="font-size: 1.1rem; line-height: 1;">
              <i class="bi bi-compass-fill me-1"></i> CP
            </div>
            <span class="fs-4 fw-bold text-white tracking-tight">CPazra Outdoor</span>
          </div>
          <p class="text-secondary small pe-lg-4" style="line-height: 1.6;">
            Platform e-commerce dan thrift store kurasi perlengkapan hiking, camping, dan pakaian gunung original. Kami menjunjung tinggi transparansi kondisi barang dan grade minus agar petualangan Anda tetap aman dan terjangkau.
          </p>
          <div class="d-flex gap-2 mt-3">
            <a href="https://instagram.com" target="_blank" class="btn btn-sm btn-outline-light rounded-circle px-2" title="Instagram">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" class="btn btn-sm btn-outline-light rounded-circle px-2" title="TikTok">
              <i class="bi bi-tiktok"></i>
            </a>
            <a href="https://youtube.com" target="_blank" class="btn btn-sm btn-outline-light rounded-circle px-2" title="YouTube">
              <i class="bi bi-youtube"></i>
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" class="btn btn-sm btn-outline-light rounded-circle px-2" title="WhatsApp Customer Care">
              <i class="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- Col 2: Kategori & Jelajah -->
        <div class="col-lg-2 col-md-6 col-6">
          <h6 class="text-white fw-bold text-uppercase mb-3" style="font-size: 0.85rem; letter-spacing: 0.05em;">
            Kategori Thrift
          </h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small">
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('catalog', { category: 'Jaket' })">
                Jaket & Windbreaker
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('catalog', { category: 'Tas' })">
                Carrier & Daypack
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('catalog', { category: 'Sepatu' })">
                Sepatu Trail & Trekking
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('catalog', { category: 'Camping' })">
                Tenda & Camping Gear
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('catalog', { category: 'Outdoor Gear' })">
                Aksesoris & Headlamp
              </a>
            </li>
          </ul>
        </div>

        <!-- Col 3: Layanan Pelanggan -->
        <div class="col-lg-3 col-md-6 col-6">
          <h6 class="text-white fw-bold text-uppercase mb-3" style="font-size: 0.85rem; letter-spacing: 0.05em;">
            Bantuan & Kebijakan
          </h6>
          <ul class="list-unstyled d-flex flex-column gap-2 small">
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('cara-belanja')">
                Cara Belanja Online
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('faq')">
                FAQ (Tanya Jawab)
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('kebijakan-pengembalian')">
                Kebijakan Garansi 7 Hari
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('syarat-ketentuan')">
                Syarat & Ketentuan
              </a>
            </li>
            <li>
              <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.navigate('kebijakan-privasi')">
                Kebijakan Privasi
              </a>
            </li>
          </ul>
        </div>

        <!-- Col 4: Toko Fisik & Kontak -->
        <div class="col-lg-3 col-md-6">
          <h6 class="text-white fw-bold text-uppercase mb-3" style="font-size: 0.85rem; letter-spacing: 0.05em;">
            Showroom Offline & POS
          </h6>
          <p class="text-secondary small mb-2">
            <i class="bi bi-geo-alt-fill text-warning me-1"></i> Jl. Raya Semeru No. 88, Oro-oro Dowo, Klojen, Kota Malang, Jawa Timur 65119
          </p>
          <p class="text-secondary small mb-2">
            <i class="bi bi-clock-fill text-warning me-1"></i> Buka Setiap Hari: 09.00 - 21.00 WIB
          </p>
          <p class="text-secondary small mb-3">
            <i class="bi bi-envelope-fill text-warning me-1"></i> halo@cpazra.id / 0812-3456-7890
          </p>
          <div class="p-2 rounded-2 bg-black bg-opacity-40 border border-secondary border-opacity-25 small">
            <span class="text-warning fw-bold d-block mb-1">
              <i class="bi bi-qr-code me-1"></i> Metode Pembayaran:
            </span>
            <span class="text-light text-opacity-75" style="font-size: 0.75rem;">
              BCA · Mandiri · QRIS All Payment · ShopeePay · COD (Bayar di Tempat)
            </span>
          </div>
        </div>
      </div>

      <hr class="border-secondary border-opacity-25 my-4">

      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-secondary">
        <div>
          &copy; 2026 CPazra Outdoor & Thrifting. All rights reserved.
        </div>
        <div class="d-flex gap-3">
          <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.switchMode('pos')">
            <i class="bi bi-display me-1"></i> Terminal Kasir POS
          </a>
          <span>·</span>
          <a href="#" class="text-secondary text-decoration-none hover-white" @click.prevent="actions.switchMode('admin')">
            <i class="bi bi-lock me-1"></i> Portal Manajemen Admin
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.hover-white:hover {
  color: #ffffff !important;
  text-decoration: underline !important;
}
</style>
