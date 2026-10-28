import { reactive, computed, watch } from 'vue'

const STORAGE_KEYS = {
  PRODUCTS: 'cpazra_products',
  CART: 'cpazra_cart',
  WISHLIST: 'cpazra_wishlist',
  ORDERS: 'cpazra_orders',
  REVIEWS: 'cpazra_reviews',
  VOUCHERS: 'cpazra_vouchers',
  CURRENT_USER: 'cpazra_user',
  CUSTOMER_LOGGED_IN: 'cpazra_customer_logged_in',
  ADMIN_LOGGED_IN: 'cpazra_admin_logged_in',
  POS_SUBSCRIPTION: 'cpazra_pos_subscription'
}

// Initial curated seed data with authentic outdoor thrifting details
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-001',
    sku: 'OSP-AETH-65',
    name: 'Osprey Aether 65 Pack',
    brand: 'Osprey',
    category: 'Tas',
    price: 1850000,
    originalPrice: 3900000,
    stock: 1,
    size: 'L / XL (65 Liter)',
    conditionGrade: 'Grade A',
    gradeLabel: 'Sangat Mulus (9/10)',
    flawDetails: 'Minus lecet halus gesekan batu di webbing bawah, busa hipbelt masih tebal dan kaku, raincover original lengkap.',
    specs: {
      volume: '65 Liter',
      weight: '2.23 kg',
      material: '210D High Tenacity Nylon',
      dimensions: '80H x 40W x 28D cm',
      color: 'Forest Pine Green'
    },
    image: '/images/product_osprey_backpack.jpg',
    images: [
      '/images/product_osprey_backpack.jpg',
      '/images/hero_outdoor_thrift.jpg'
    ],
    description: 'Tas carrier gunung kelas ekspedisi Osprey Aether 65 original. Dilengkapi teknologi suspensi Custom Fit-on-the-Fly™ pada sabuk pinggang dan tali bahu. Kondisi thrift grade A sangat terawat, siap mendaki gunung Rinjani, Semeru, atau ekspedisi luar pulau.',
    isFeatured: true,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 342,
    rating: 4.9,
    reviewCount: 14
  },
  {
    id: 'prod-002',
    sku: 'TNF-MTN-GTX',
    name: 'The North Face Mountain Light Gore-Tex Jacket',
    brand: 'The North Face',
    category: 'Jaket',
    price: 950000,
    originalPrice: 2800000,
    stock: 1,
    size: 'L (P: 72cm x L: 60cm)',
    conditionGrade: 'Grade A-',
    gradeLabel: 'Mulus Terawat (8.5/10)',
    flawDetails: 'Minus sablon size tag dalam sedikit pudar karena pencucian. Membran Gore-Tex masih waterproof 100%, zipper YKK Vislon lancar jaya.',
    specs: {
      material: '2-Layer Gore-Tex Shell',
      zipper: 'YKK Full Vislon with Storm Flap',
      hood: 'Adjustable Stowaway Hood',
      color: 'Retro Teal & Deep Black'
    },
    image: '/images/product_northface_jacket.jpg',
    images: [
      '/images/product_northface_jacket.jpg'
    ],
    description: 'Vintage The North Face Mountain Light Jacket original buatan era 90-an retro streetwear outdoor. Tahan badai hujan lebat dan angin kencang gunung. Potongan relaxed fit autentik khas thrifting Jepang.',
    isFeatured: true,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 520,
    rating: 4.8,
    reviewCount: 9
  },
  {
    id: 'prod-003',
    sku: 'PAT-RTRX-FLC',
    name: 'Patagonia Classic Retro-X Deep-Pile Fleece',
    brand: 'Patagonia',
    category: 'Jaket',
    price: 1250000,
    originalPrice: 2950000,
    stock: 1,
    size: 'M (P: 68cm x L: 56cm)',
    conditionGrade: 'Grade S',
    gradeLabel: 'Like New (9.8/10)',
    flawDetails: 'Kondisi istimewa nyaris tanpa minus! Bulu sherpa fleece masih empuk mekar dan belum ada matting di siku.',
    specs: {
      material: '100% Recycled Polyester Fleece 1/4" Pile',
      lining: 'Warp-Knit Mesh with Windproof Barrier',
      pocket: 'Contrast Nylon Chest Zip Pocket',
      color: 'Natural Oatmeal & Navy'
    },
    image: '/images/product_patagonia_fleece.jpg',
    images: [
      '/images/product_patagonia_fleece.jpg'
    ],
    description: 'Jaket fleece ikonik dari Patagonia yang sangat dicari pecinta gorpcore dan vintage outdoor. Memberikan kehangatan maksimal dengan lapisan penahan angin HeiQ Pure odor control.',
    isFeatured: true,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 618,
    rating: 5.0,
    reviewCount: 19
  },
  {
    id: 'prod-004',
    sku: 'SAL-XULT4-GTX',
    name: 'Salomon X Ultra 4 Gore-Tex Trail Hiking Shoes',
    brand: 'Salomon',
    category: 'Sepatu',
    price: 890000,
    originalPrice: 2400000,
    stock: 1,
    size: 'EUR 42 / 26.5 cm',
    conditionGrade: 'Grade B+',
    gradeLabel: 'Good Condition (8/10)',
    flawDetails: 'Minus tapak Contagrip aus tipis sekitar 10% pemakaian normal trekking, upper Gore-Tex masih sangat aman tanpa sobek, tali Quicklace lancar.',
    specs: {
      chassis: 'ADV-C Chassis Stabilitas',
      outsole: 'Contagrip® MA',
      membrane: 'Gore-Tex Waterproof',
      color: 'Earth Olive & Granite'
    },
    image: '/images/product_salomon_shoes.jpg',
    images: [
      '/images/product_salomon_shoes.jpg'
    ],
    description: 'Sepatu trail running dan hiking Salomon X Ultra 4 GTX. Bobot ringan dengan grip traksi agresif di medan lumpur dan bebatuan licin. Insole Ortholite original higienis sudah dicuci steril.',
    isFeatured: true,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 295,
    rating: 4.7,
    reviewCount: 7
  },
  {
    id: 'prod-005',
    sku: 'ARC-BETA-LT',
    name: 'Arc\'teryx Beta LT Hardshell Jacket',
    brand: 'Arc\'teryx',
    category: 'Jaket',
    price: 2450000,
    originalPrice: 6500000,
    stock: 1,
    size: 'L (P: 74cm x L: 62cm)',
    conditionGrade: 'Grade A',
    gradeLabel: 'Sangat Mulus (9/10)',
    flawDetails: 'Minus seam tape ujung lengan sudah di-retape rapi oleh spesialis reparasi outdoor, tidak bocor sama sekali saat dites water-spray.',
    specs: {
      membrane: 'GORE-TEX 3L with Tricot Backer',
      zipper: 'WaterTight™ VisLon Zipper',
      hood: 'StormHood™ Helmet Compatible',
      color: 'Dark Tatsu Olive'
    },
    image: '/images/product_northface_jacket.jpg',
    images: ['/images/product_northface_jacket.jpg'],
    description: 'Hardshell legendaris asal Kanada Arc\'teryx Beta LT. Ringan, tangguh, dan kedap air sempurna untuk ekspedisi cuaca ekstrem. Logo bordir fosil burung Archaeopteryx utuh bersinar.',
    isFeatured: false,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 410,
    rating: 4.9,
    reviewCount: 12
  },
  {
    id: 'prod-006',
    sku: 'COL-SUN-4P',
    name: 'Coleman Sundome 4P WeatherTec Camping Tent',
    brand: 'Coleman',
    category: 'Camping',
    price: 780000,
    originalPrice: 1650000,
    stock: 2,
    size: '4 Orang (2.7m x 2.1m)',
    conditionGrade: 'Grade A',
    gradeLabel: 'Mulus Terawat (9/10)',
    flawDetails: 'Minus pasak asli kurang 1 buah (sudah diganti dengan 2 buah pasak alloy cadangan tebal). Frame fiberglass masih kencang elastis tanpa pecah.',
    specs: {
      capacity: '4 Person Camping',
      setupTime: '10 Menit Quick Setup',
      system: 'WeatherTec™ Welded Floors',
      color: 'Navy & Sun Amber'
    },
    image: '/images/hero_outdoor_thrift.jpg',
    images: ['/images/hero_outdoor_thrift.jpg'],
    description: 'Tenda camping keluarga atau regu 4 orang dari Coleman. Tahan terpaan angin hingga 50 km/jam dengan lantai sistem mangkuk yang anti rembes saat hujan badai.',
    isFeatured: true,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 198,
    rating: 4.6,
    reviewCount: 5
  },
  {
    id: 'prod-007',
    sku: 'PTZ-TIK-350',
    name: 'Petzl Tikka Compact Headlamp 350 Lumens',
    brand: 'Petzl',
    category: 'Outdoor Gear',
    price: 320000,
    originalPrice: 650000,
    stock: 3,
    size: 'Universal / Adjustable',
    conditionGrade: 'Grade S',
    gradeLabel: 'Like New (9.5/10)',
    flawDetails: 'Minus kotak kardus retail asli sudah tidak ada, unit headlamp mulus bersih, lensa bening tanpa gores, strap elastis masih kencang.',
    specs: {
      brightness: '350 Lumens (Max Mode)',
      beam: 'Wide Beam with Red Lighting',
      battery: '3x AAA atau Petzl CORE Hybrid',
      color: 'Forest Green'
    },
    image: '/images/product_osprey_backpack.jpg',
    images: ['/images/product_osprey_backpack.jpg'],
    description: 'Senter kepala (headlamp) kompak untuk penerangan pendakian malam hari dan camping. Dilengkapi mode cahaya merah agar tidak menyilaukan sesama pendaki di tenda.',
    isFeatured: false,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 154,
    rating: 5.0,
    reviewCount: 8
  },
  {
    id: 'prod-008',
    sku: 'DEU-AIR-50',
    name: 'Deuter Aircontact Core 50+10 Trekking Pack',
    brand: 'Deuter',
    category: 'Tas',
    price: 1450000,
    originalPrice: 3100000,
    stock: 1,
    size: '50 + 10 Liter',
    conditionGrade: 'Grade A-',
    gradeLabel: 'Mulus (8.8/10)',
    flawDetails: 'Minus ada noda debu tipis pada raincover yang bisa dicuci, busa punggung Aircontact empuk dan sirkulasi udara sangat lancar.',
    specs: {
      volume: '50 + 10 L Extra Lid',
      backsystem: 'Aircontact Cushion System',
      access: 'Front J-Zipper Access',
      color: 'Graphite / Alpine Blue'
    },
    image: '/images/product_osprey_backpack.jpg',
    images: ['/images/product_osprey_backpack.jpg'],
    description: 'Carrier trekking Deuter Jerman dengan kenyamanan punggung terbaik di kelasnya. Bantalan punggung ergonomis mendistribusikan beban secara merata ke pinggul pendaki.',
    isFeatured: true,
    isThrift: true,
    authenticityVerified: true,
    viewsCount: 221,
    rating: 4.8,
    reviewCount: 6
  }
]

// Pre-seeded vouchers
const DEFAULT_VOUCHERS = [
  {
    id: 'vouch-1',
    code: 'OUTDOOR20',
    title: 'Diskon Spesial Pendaki 20%',
    discountType: 'percent',
    discountValue: 20,
    maxDiscount: 150000,
    minSpend: 250000,
    expiresAt: '31 Des 2026',
    isActive: true
  },
  {
    id: 'vouch-2',
    code: 'THRIFT10',
    title: 'Potongan Thrift Hunter 10%',
    discountType: 'percent',
    discountValue: 10,
    maxDiscount: 100000,
    minSpend: 150000,
    expiresAt: '31 Des 2026',
    isActive: true
  },
  {
    id: 'vouch-3',
    code: 'HEMAT50',
    title: 'Potongan Langsung Rp 50.000',
    discountType: 'fixed',
    discountValue: 50000,
    maxDiscount: 50000,
    minSpend: 500000,
    expiresAt: '31 Des 2026',
    isActive: true
  }
]

// Pre-seeded orders (including #CPZ-9825 from user request screen list!)
const DEFAULT_ORDERS = [
  {
    id: 'CPZ-9825',
    customer: {
      name: 'Bagus Prakoso',
      phone: '0812-3456-7890',
      email: 'bagus.prakoso@example.com',
      address: 'Jl. Merbabu No. 14, Lowokwaru',
      city: 'Kota Malang, Jawa Timur',
      postalCode: '65141',
      notes: 'Tolong packing bubble wrap tebal untuk carrier'
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Osprey Aether 65 Pack',
        brand: 'Osprey',
        price: 1850000,
        size: 'L / XL',
        conditionGrade: 'Grade A',
        quantity: 1,
        image: '/images/product_osprey_backpack.jpg'
      }
    ],
    subtotal: 1850000,
    discount: 150000,
    voucherCode: 'OUTDOOR20',
    shippingCourier: 'JNE YES (Yakin Esok Sampai)',
    shippingFee: 45000,
    total: 1745000,
    paymentMethod: 'Transfer Bank BCA',
    paymentStatus: 'Terverifikasi',
    status: 'Diproses',
    trackingNumber: 'JNE-MLG-98250012',
    createdAt: '2026-10-27T08:30:00.000Z'
  },
  {
    id: 'CPZ-9824',
    customer: {
      name: 'Dimas Wicaksono',
      phone: '0857-8901-2345',
      email: 'dimas.w@example.com',
      address: 'Komplek Giri Asri Blok C-2',
      city: 'Kota Bandung, Jawa Barat',
      postalCode: '40192',
      notes: ''
    },
    items: [
      {
        productId: 'prod-003',
        name: 'Patagonia Classic Retro-X Deep-Pile Fleece',
        brand: 'Patagonia',
        price: 1250000,
        size: 'M',
        conditionGrade: 'Grade S',
        quantity: 1,
        image: '/images/product_patagonia_fleece.jpg'
      }
    ],
    subtotal: 1250000,
    discount: 50000,
    voucherCode: 'HEMAT50',
    shippingCourier: 'SiCepat BEST',
    shippingFee: 28000,
    total: 1228000,
    paymentMethod: 'QRIS Gopay/BCA',
    paymentStatus: 'Terverifikasi',
    status: 'Dikirim',
    trackingNumber: 'SCP-BDG-7712904',
    createdAt: '2026-10-26T14:15:00.000Z'
  },
  {
    id: 'CPZ-9823',
    customer: {
      name: 'Rian Hidayat (Walk-in Kasir)',
      phone: '0813-1122-3344',
      email: 'walkin@cpazra.id',
      address: 'Toko Offline CPazra',
      city: 'Kota Malang',
      postalCode: '-',
      notes: 'Pembelian Kasir POS Toko Offline'
    },
    items: [
      {
        productId: 'prod-007',
        name: 'Petzl Tikka Compact Headlamp 350 Lumens',
        brand: 'Petzl',
        price: 320000,
        size: 'Universal',
        conditionGrade: 'Grade S',
        quantity: 1,
        image: '/images/product_osprey_backpack.jpg'
      }
    ],
    subtotal: 320000,
    discount: 0,
    voucherCode: null,
    shippingCourier: 'Bawa Sendiri (POS)',
    shippingFee: 0,
    total: 320000,
    paymentMethod: 'Tunai (Kasir)',
    paymentStatus: 'Terverifikasi',
    status: 'Selesai',
    trackingNumber: 'POS-OFFLINE-003',
    createdAt: '2026-10-26T11:05:00.000Z'
  }
]

// Pre-seeded customer reviews
const DEFAULT_REVIEWS = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    userName: 'Fajar Nugroho (Pendaki Gunung)',
    rating: 5,
    date: '24 Oktober 2026',
    comment: 'Barang authentic Osprey original! Deskripsi minus lecet bawah sangat transparan dan sesuai dengan kenyataan waktu paket sampai. Packing bubble wrap super tebal dan pengiriman kilat. Recommended thrifting outdoor!'
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    userName: 'Siti Rahma',
    rating: 5,
    date: '21 Oktober 2026',
    comment: 'Alhamdulillah dapat carrier kapasitas 65L harga setengah retail baru, kondisinya masih sangat kokoh dipakai summit camp kemarin.'
  },
  {
    id: 'rev-003',
    productId: 'prod-002',
    userName: 'Aldi Pratama',
    rating: 5,
    date: '25 Oktober 2026',
    comment: 'Gore-Tex TNF mantap! Diuji pas hujan lebat di basecamp air langsung meluncur daun talas. Kondisi mulus, minus sablon tipis doang.'
  }
]

const DEFAULT_USER = {
  id: 'usr-001',
  name: 'Ahmad Rizky',
  email: 'rizky.saputra@example.com',
  phone: '0812-3456-7890',
  address: 'Jl. Merbabu No. 14, Lowokwaru',
  city: 'Kota Malang, Jawa Timur',
  postalCode: '65141',
  memberTier: 'Pendaki Gold',
  joinedDate: '12 Januari 2024',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`Failed to parse localStorage for ${key}:`, err)
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Failed to save to localStorage for ${key}:`, err)
  }
}

// Global Reactive State
export const state = reactive({
  // Navigation / Routing
  currentView: 'home', // 'home', 'catalog', 'detail', 'cart', 'checkout', 'order-success', 'wishlist', 'pos', 'admin', 'profile', 'login', etc.
  currentMode: 'store', // 'store', 'pos', 'admin'
  selectedProductId: 'prod-001',
  selectedOrderId: 'CPZ-9825',
  catalogCategory: 'Semua',
  searchQuery: '',
  loginTargetTab: 'customer', // 'customer', 'admin', 'pos'

  // Collections backed by localStorage
  products: loadFromStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS),
  cart: loadFromStorage(STORAGE_KEYS.CART, []),
  wishlist: loadFromStorage(STORAGE_KEYS.WISHLIST, ['prod-001', 'prod-003']),
  orders: loadFromStorage(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS),
  vouchers: loadFromStorage(STORAGE_KEYS.VOUCHERS, DEFAULT_VOUCHERS),
  reviews: loadFromStorage(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS),
  appliedVoucher: null,

  // Auth: Customer & Admin
  isCustomerLoggedIn: loadFromStorage(STORAGE_KEYS.CUSTOMER_LOGGED_IN, true),
  currentUser: loadFromStorage(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER),
  
  isAdminAuthenticated: loadFromStorage(STORAGE_KEYS.ADMIN_LOGGED_IN, false),
  adminUser: {
    name: 'Administrator CPazra',
    email: 'admin@cpazra.id',
    role: 'Super Admin & Owner'
  },

  // POS Subscription SaaS System
  posSubscription: loadFromStorage(STORAGE_KEYS.POS_SUBSCRIPTION, {
    isSubscribed: true,
    plan: 'Paket Toko Tunggal (Aktif)',
    price: 99000,
    expiresAt: '27 November 2026',
    status: 'active'
  }),

  // Toast Notification
  toast: {
    show: false,
    message: '',
    type: 'success'
  },

  // POS State
  posCart: [],
  posCustomerName: 'Pelanggan Umum',
  posCashTendered: 0,
  posLastReceipt: null
})

// Auto-sync state changes with localStorage
watch(() => state.products, (newVal) => saveToStorage(STORAGE_KEYS.PRODUCTS, newVal), { deep: true })
watch(() => state.cart, (newVal) => saveToStorage(STORAGE_KEYS.CART, newVal), { deep: true })
watch(() => state.wishlist, (newVal) => saveToStorage(STORAGE_KEYS.WISHLIST, newVal), { deep: true })
watch(() => state.orders, (newVal) => saveToStorage(STORAGE_KEYS.ORDERS, newVal), { deep: true })
watch(() => state.vouchers, (newVal) => saveToStorage(STORAGE_KEYS.VOUCHERS, newVal), { deep: true })
watch(() => state.reviews, (newVal) => saveToStorage(STORAGE_KEYS.REVIEWS, newVal), { deep: true })
watch(() => state.currentUser, (newVal) => saveToStorage(STORAGE_KEYS.CURRENT_USER, newVal), { deep: true })
watch(() => state.isCustomerLoggedIn, (newVal) => saveToStorage(STORAGE_KEYS.CUSTOMER_LOGGED_IN, newVal))
watch(() => state.isAdminAuthenticated, (newVal) => saveToStorage(STORAGE_KEYS.ADMIN_LOGGED_IN, newVal))
watch(() => state.posSubscription, (newVal) => saveToStorage(STORAGE_KEYS.POS_SUBSCRIPTION, newVal), { deep: true })

// Computed Properties
export const cartItemCount = computed(() => {
  return state.cart.reduce((total, item) => total + item.quantity, 0)
})

export const cartSubtotal = computed(() => {
  return state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
})

export const cartDiscount = computed(() => {
  if (!state.appliedVoucher) return 0
  const sub = cartSubtotal.value
  if (sub < state.appliedVoucher.minSpend) return 0
  if (state.appliedVoucher.discountType === 'percent') {
    const calc = Math.round((sub * state.appliedVoucher.discountValue) / 100)
    return Math.min(calc, state.appliedVoucher.maxDiscount || calc)
  }
  return state.appliedVoucher.discountValue
})

export const cartTotal = computed(() => {
  return Math.max(0, cartSubtotal.value - cartDiscount.value)
})

export const wishlistItemCount = computed(() => state.wishlist.length)

// Actions & Helpers
export const actions = {
  // Navigation
  navigate(view, payload = null) {
    // Intercept admin navigation if not logged in
    if (view === 'admin' || view.startsWith('admin-')) {
      if (!state.isAdminAuthenticated) {
        state.loginTargetTab = 'admin'
        state.currentView = 'login'
        this.showToast('Silakan login sebagai Admin terlebih dahulu untuk mengakses Admin Panel!', 'warning')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }

    state.currentView = view
    if (payload?.productId) {
      state.selectedProductId = payload.productId
    }
    if (payload?.orderId) {
      state.selectedOrderId = payload.orderId
    }
    if (payload?.category) {
      state.catalogCategory = payload.category
    }
    if (payload?.loginTab) {
      state.loginTargetTab = payload.loginTab
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  switchMode(mode) {
    if (mode === 'admin') {
      if (!state.isAdminAuthenticated) {
        state.loginTargetTab = 'admin'
        state.currentView = 'login'
        this.showToast('Silakan login sebagai Admin terlebih dahulu untuk mengakses Admin Panel!', 'warning')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      state.currentMode = 'admin'
      state.currentView = 'admin'
    } else if (mode === 'pos') {
      state.currentMode = 'pos'
      state.currentView = 'pos'
    } else {
      state.currentMode = 'store'
      state.currentView = 'home'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  showToast(message, type = 'success') {
    state.toast.message = message
    state.toast.type = type
    state.toast.show = true
    setTimeout(() => {
      state.toast.show = false
    }, 3500)
  },

  // Auth: Customer
  loginCustomer(email, password) {
    state.isCustomerLoggedIn = true
    state.currentUser.email = email
    this.showToast(`Selamat datang kembali, ${state.currentUser.name}!`, 'success')
    this.navigate('profile')
  },

  registerCustomer(userData) {
    state.isCustomerLoggedIn = true
    state.currentUser = {
      ...state.currentUser,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '0812-3456-7890',
      joinedDate: 'Hari Ini'
    }
    this.showToast(`Pendaftaran berhasil! Selamat berbelanja di CPazra, ${userData.name}!`, 'success')
    this.navigate('profile')
  },

  logoutCustomer() {
    state.isCustomerLoggedIn = false
    this.showToast('Anda telah berhasil keluar dari akun pelanggan.', 'info')
    this.navigate('home')
  },

  updateUserProfile(updatedData) {
    state.currentUser = {
      ...state.currentUser,
      ...updatedData
    }
    this.showToast('Biodata profil berhasil disimpan!', 'success')
  },

  // Auth: Admin
  loginAdmin(email, password) {
    // Accepts admin@cpazra.id / admin123 or flexible demo credentials
    if (email.includes('admin') || password === 'admin123' || email === 'admin@cpazra.id') {
      state.isAdminAuthenticated = true
      state.currentMode = 'admin'
      state.currentView = 'admin'
      this.showToast('Login Admin berhasil! Selamat datang di Pusat Kendali CPazra.', 'success')
      return true
    } else {
      this.showToast('Email atau password admin salah! Gunakan: admin@cpazra.id / admin123', 'danger')
      return false
    }
  },

  logoutAdmin() {
    state.isAdminAuthenticated = false
    state.currentMode = 'store'
    state.currentView = 'home'
    this.showToast('Anda telah keluar dari sesi Admin.', 'info')
  },

  // POS Subscription
  subscribePos(planName, price) {
    state.posSubscription = {
      isSubscribed: true,
      plan: planName,
      price: price,
      expiresAt: '27 November 2026',
      status: 'active'
    }
    this.showToast(`Berhasil berlangganan ${planName}! Fitur POS Kasir aktif penuh.`, 'success')
    this.switchMode('pos')
  },

  // Products CRUD
  addProduct(productData) {
    const newId = `prod-${Date.now().toString().slice(-4)}`
    const product = {
      id: newId,
      sku: `CPZ-${Date.now().toString().slice(-6)}`,
      name: productData.name.trim(),
      brand: productData.brand?.trim() || 'Outdoor Brand',
      category: productData.category || 'Outdoor Gear',
      price: Number(productData.price) || 0,
      originalPrice: Number(productData.originalPrice) || Number(productData.price) * 2,
      stock: Number(productData.stock) || 1,
      size: productData.size?.trim() || 'Universal',
      conditionGrade: productData.conditionGrade || 'Grade A',
      gradeLabel: productData.gradeLabel || 'Mulus Terawat',
      flawDetails: productData.flawDetails?.trim() || 'Tidak ada minus signifikan',
      specs: productData.specs || {
        material: 'Premium Outdoor Material',
        color: 'Natural Tone'
      },
      image: productData.image || '/images/product_northface_jacket.jpg',
      images: [productData.image || '/images/product_northface_jacket.jpg'],
      description: productData.description?.trim() || 'Produk perlengkapan outdoor thrift terkurasi dari CPazra.',
      isFeatured: !!productData.isFeatured,
      isThrift: true,
      authenticityVerified: true,
      viewsCount: 1,
      rating: 5.0,
      reviewCount: 0
    }

    state.products.unshift(product)
    this.showToast(`Produk "${product.name}" berhasil ditambahkan ke katalog!`, 'success')
    return product
  },

  updateProduct(id, updatedData) {
    const index = state.products.findIndex((p) => p.id === id)
    if (index !== -1) {
      state.products[index] = {
        ...state.products[index],
        ...updatedData,
        price: Number(updatedData.price) || state.products[index].price,
        originalPrice: Number(updatedData.originalPrice) || state.products[index].originalPrice,
        stock: Number(updatedData.stock) || state.products[index].stock
      }
      this.showToast(`Produk "${state.products[index].name}" berhasil diperbarui!`, 'success')
      return true
    }
    return false
  },

  deleteProduct(id) {
    const prod = state.products.find((p) => p.id === id)
    const name = prod ? prod.name : 'Produk'
    state.products = state.products.filter((p) => p.id !== id)
    this.showToast(`Produk "${name}" berhasil dihapus dari sistem.`, 'info')
  },

  resetSampleData() {
    state.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS))
    state.orders = JSON.parse(JSON.stringify(DEFAULT_ORDERS))
    state.vouchers = JSON.parse(JSON.stringify(DEFAULT_VOUCHERS))
    state.reviews = JSON.parse(JSON.stringify(DEFAULT_REVIEWS))
    state.currentUser = JSON.parse(JSON.stringify(DEFAULT_USER))
    this.showToast('Data toko telah direset ke data sampel bawaan CPazra.', 'info')
  },

  // Cart Operations
  addToCart(product, quantity = 1) {
    const existing = state.cart.find((item) => item.productId === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      state.cart.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        size: product.size,
        conditionGrade: product.conditionGrade,
        stock: product.stock,
        quantity: quantity
      })
    }
    this.showToast(`"${product.name}" dimasukkan ke keranjang belanja!`, 'success')
  },

  updateCartQuantity(productId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(productId)
      return
    }
    const item = state.cart.find((i) => i.productId === productId)
    if (item) {
      item.quantity = newQty
    }
  },

  removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.productId !== productId)
    this.showToast('Item dihapus dari keranjang belanja.', 'info')
  },

  clearCart() {
    state.cart = []
  },

  // Wishlist Operations
  toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId)
    if (index > -1) {
      state.wishlist.splice(index, 1)
      this.showToast('Produk dihapus dari Wishlist.', 'info')
    } else {
      state.wishlist.push(productId)
      this.showToast('Produk disimpan ke Wishlist Favorit!', 'success')
    }
  },

  isInWishlist(productId) {
    return state.wishlist.includes(productId)
  },

  // Voucher Operations
  applyVoucher(code) {
    const cleaned = code.trim().toUpperCase()
    const found = state.vouchers.find((v) => v.code === cleaned && v.isActive)
    if (!found) {
      this.showToast('Kode voucher tidak ditemukan atau sudah tidak berlaku.', 'danger')
      return false
    }
    if (cartSubtotal.value < found.minSpend) {
      this.showToast(
        `Minimal belanja untuk kode ${found.code} adalah ${formatIDR(found.minSpend)}.`,
        'warning'
      )
      return false
    }
    state.appliedVoucher = found
    this.showToast(`Voucher ${found.code} berhasil dipasang!`, 'success')
    return true
  },

  removeVoucher() {
    state.appliedVoucher = null
    this.showToast('Voucher diskon dilepas.', 'info')
  },

  // Orders & Checkout
  createOrder(checkoutData) {
    const newOrderId = `CPZ-${Math.floor(1000 + Math.random() * 9000)}`
    const order = {
      id: newOrderId,
      customer: {
        name: checkoutData.name,
        phone: checkoutData.phone,
        email: checkoutData.email || 'customer@cpazra.id',
        address: checkoutData.address,
        city: checkoutData.city,
        postalCode: checkoutData.postalCode || '-',
        notes: checkoutData.notes || ''
      },
      items: JSON.parse(JSON.stringify(state.cart)),
      subtotal: cartSubtotal.value,
      discount: cartDiscount.value,
      voucherCode: state.appliedVoucher ? state.appliedVoucher.code : null,
      shippingCourier: checkoutData.courier || 'JNE Reguler',
      shippingFee: checkoutData.shippingFee || 25000,
      total: cartTotal.value + (checkoutData.shippingFee || 25000),
      paymentMethod: checkoutData.paymentMethod || 'QRIS Instant',
      paymentStatus: checkoutData.paymentMethod === 'COD' ? 'Menunggu Pembayaran' : 'Terverifikasi',
      status: 'Diproses',
      trackingNumber: `CPZ-TRK-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString()
    }

    order.items.forEach((item) => {
      const prod = state.products.find((p) => p.id === item.productId)
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity)
      }
    })

    state.orders.unshift(order)
    this.clearCart()
    state.appliedVoucher = null
    state.selectedOrderId = newOrderId
    this.showToast(`Pesanan #${newOrderId} berhasil dibuat!`, 'success')
    this.navigate('order-success', { orderId: newOrderId })
    return order
  },

  updateOrderStatus(orderId, newStatus) {
    const ord = state.orders.find((o) => o.id === orderId)
    if (ord) {
      ord.status = newStatus
      this.showToast(`Status pesanan #${orderId} diubah menjadi "${newStatus}".`, 'info')
    }
  },

  // Customer Reviews
  addReview(productId, reviewData) {
    const newReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      productId,
      userName: reviewData.userName || state.currentUser.name,
      rating: Number(reviewData.rating) || 5,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      comment: reviewData.comment
    }
    state.reviews.unshift(newReview)

    const prodReviews = state.reviews.filter((r) => r.productId === productId)
    const prod = state.products.find((p) => p.id === productId)
    if (prod && prodReviews.length > 0) {
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0)
      prod.rating = Number((totalRating / prodReviews.length).toFixed(1))
      prod.reviewCount = prodReviews.length
    }

    this.showToast('Ulasan produk Anda berhasil dikirim!', 'success')
    return newReview
  },

  // POS Cashier Actions
  addToPosCart(product) {
    const existing = state.posCart.find((i) => i.productId === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      state.posCart.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        size: product.size,
        conditionGrade: product.conditionGrade,
        quantity: 1
      })
    }
  },

  updatePosCartQuantity(productId, qty) {
    if (qty <= 0) {
      state.posCart = state.posCart.filter((i) => i.productId !== productId)
      return
    }
    const item = state.posCart.find((i) => i.productId === productId)
    if (item) item.quantity = qty
  },

  clearPosCart() {
    state.posCart = []
    state.posCashTendered = 0
  },

  completePosTransaction(paymentMethod = 'Tunai') {
    const totalAmount = state.posCart.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const changeAmount = Math.max(0, state.posCashTendered - totalAmount)
    const receiptId = `POS-${Math.floor(1000 + Math.random() * 9000)}`

    const receipt = {
      id: receiptId,
      date: new Date().toLocaleString('id-ID'),
      customerName: state.posCustomerName || 'Pelanggan Umum (Walk-in)',
      items: JSON.parse(JSON.stringify(state.posCart)),
      total: totalAmount,
      cashTendered: state.posCashTendered || totalAmount,
      change: changeAmount,
      paymentMethod,
      cashier: 'Ahmad Rizky (Kasir)'
    }

    state.orders.unshift({
      id: receiptId,
      customer: {
        name: receipt.customerName,
        phone: '-',
        email: 'pos@cpazra.id',
        address: 'Toko Offline CPazra Outdoor',
        city: 'Malang',
        postalCode: '-',
        notes: 'Transaksi Point of Sale (POS)'
      },
      items: receipt.items,
      subtotal: totalAmount,
      discount: 0,
      voucherCode: null,
      shippingCourier: 'Bawa Sendiri (POS)',
      shippingFee: 0,
      total: totalAmount,
      paymentMethod,
      paymentStatus: 'Terverifikasi',
      status: 'Selesai',
      trackingNumber: `POS-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    })

    receipt.items.forEach((item) => {
      const prod = state.products.find((p) => p.id === item.productId)
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity)
      }
    })

    state.posLastReceipt = receipt
    this.clearPosCart()
    this.showToast(`Transaksi POS #${receiptId} berhasil diselesaikan!`, 'success')
    return receipt
  }
}

export function formatIDR(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount)
}
