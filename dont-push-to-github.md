# Hal-Hal yang Dilarang di-Push ke GitHub (E-Commerce Backend)

Saat membuat backend dan database untuk e-commerce baru Anda, ada beberapa file sensitif dan tidak penting yang wajib hukumnya tidak boleh di-push ke GitHub. Membocorkan file-file ini bisa membuat database Anda diretas orang lain atau kuota API Studio Anda dikuras oleh bot scrapper.

Berikut adalah daftar hal yang dilarang keras untuk di-push ke GitHub:

## 1. Data Kredensial & Rahasia (Paling Kritikal)
Semua file yang menyimpan kunci akses sistem backend Anda harus disembunyikan.
* **File `.env` atau `.env.local`**: File ini berisi *Environment Variables* seperti password database, JWT secret key, dan konfigurasi sensitif lainnya.
* **API Keys & Token**: Jangan menaruh API key pihak ketiga langsung di dalam kode, seperti Google AI Studio API key, token Payment Gateway (Midtrans/Stripe), atau Firebase config.
* **SSH Keys & File Kredensial**: File seperti `id_rsa`, `id_rsa.pub`, atau file JSON dari Google Cloud Service Account (`service-account.json`).

## 2. Folder Dependensi (Bikin Repo Gemuk & Eror)
Folder ini berisi pustaka/library pihak ketiga yang Anda unduh saat koding. Tidak perlu di-push karena tim lain atau server *deploy* bisa mengunduhnya secara otomatis menggunakan file manajer paket (seperti `package.json` atau `requirements.txt`).
* **Node.js**: Folder `node_modules/`.
* **Python**: Folder `.venv/`, `env/`, atau `venv/`.
* **PHP**: Folder `vendor/`.

## 3. File Log dan Cache Browser/Aplikasi
File sementara yang dihasilkan saat backend dijalankan.
* **File Log**: `*.log` (seperti `npm-debug.log` atau log *error* database).
* **Folder Cache**: `.eslintcache`, `.turbo/`, `.next/` (jika menggunakan Next.js).

## 4. File Konfigurasi Editor / OS Lokal
File otomatis dari laptop atau aplikasi *code editor* Anda yang tidak ada hubungannya dengan fungsionalitas web.
* **Sistem Operasi**: `.DS_Store` (Mac) atau `Thumbs.db` (Windows).
* **Text Editor**: Folder `.vscode/` (jika berisi pengaturan personal/kredensial) atau `.idea/` (Android Studio/IntelliJ).

---

## 🛡️ Cara Mencegahnya: Gunakan `.gitignore`
Sebelum Anda mengetik perintah `git add .` dan `git push` pertama kali di backend, pastikan Anda sudah membuat file bernama **`.gitignore`** di root folder project Anda.

Berikut isi dasar file `.gitignore` yang wajib Anda siapkan untuk backend:

```text
# Mengabaikan file konfigurasi rahasia
.env
.env.local
.env.*.local

# Mengabaikan dependensi proyek
node_modules/
/vendor/
.venv/
env/

# Mengabaikan log
*.log

# Mengabaikan file sistem operasi
.DS_Store
Thumbs.db
```

---

## 🚨 Bagaimana kalau terlanjur ke-push?
Jika Anda terlanjur melakukan *push* file `.env` ke GitHub, **menghapus file lalu melakukan push ulang TIDAK CUKUP**. GitHub merekam seluruh riwayat ketikan (*commit history*) Anda. Langkah terbaik yang harus segera dilakukan adalah:

1. **Segera ubah password database** atau *revoke* (matikan) API Key yang bocor tersebut dan buat key baru di dashboard penyedia layanan.
2. **Gunakan alat bantu** seperti `git filter-repo` atau BFG Repo-Cleaner untuk menghapus file tersebut dari riwayat *commit* secara permanen sebelum repositori Anda diubah menjadi publik.
