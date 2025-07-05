# ♻️ TrashValue Admin Dashboard

> **Mengubah Sampah Menjadi Nilai**

---
## Akun Admin
* admin@trashvalue.com
* admin123


## 📋 Deskripsi Proyek

**TrashValue** adalah sistem manajemen sampah yang mengonversi sampah menjadi uang. Proyek ini merupakan *admin dashboard* untuk mengelola seluruh aspek sistem TrashValue, mulai dari pengelolaan jenis sampah, bank sampah, dropoff, hingga transaksi.

---

## 🌟 Fitur Utama

### 1. Dashboard Home

* Statistik overview (Total Dropoffs, Total Earnings, Total Waste)
* Quick actions untuk navigasi cepat
* Grafik dan visualisasi data

### 2. Manajemen Jenis Sampah (Waste Types)

* ✅ CRUD operations
* ✅ Upload gambar untuk tiap jenis sampah
* ✅ Set harga per kg
* ✅ Status aktif/tidak aktif
* ✅ Responsive design (Mobile, Tablet, Desktop)

### 3. Manajemen Bank Sampah

* ✅ CRUD data bank sampah
* ✅ Nama & alamat bank
* ✅ Interface yang responsif

### 4. Manajemen Dropoff

* ✅ Melihat semua dropoff
* ✅ Filter berdasarkan status dan pencarian
* ✅ Ubah status dropoff (Pending, Processing, Completed, Rejected, Cancelled)
* ✅ Detail informasi lengkap

### 5. Riwayat Transaksi

* ✅ Lihat semua transaksi
* ✅ Filter & pencarian transaksi
* ✅ Export laporan ke PDF
* ✅ Detail transaksi lengkap

### 6. Autentikasi

* ✅ Sistem login untuk admin
* ✅ Protected routes
* ✅ Session management

---

## 🛠️ Teknologi yang Digunakan

### Frontend

* **React 18** - Library utama untuk UI
* **Vite** - Build tool & dev server
* **Tailwind CSS** - Utility-first CSS framework
* **shadcn/ui** - Komponen modern dan reusable

### Library Pendukung

* **TanStack React Query** - Server state management
* **TanStack React Table** - Komponen tabel yang powerful
* **React Hook Form** - Manajemen form
* **React Router DOM** - Routing
* **Lucide React** - Icon library
* **React PDF** - PDF generation
* **Sonner** - Toast notifications

### Styling & UI

* **Tailwind CSS**
* **shadcn/ui components**:
  `Button`, `Input`, `Select`, `Table`, `Dialog`, `AlertDialog`, `Card`, `Badge`, `Skeleton`, `DropdownMenu`, `Toast`

### State Management

* React Query
* React Hook Form
* React Router

---

## 📁 Struktur Proyek

Struktur folder mengikuti standar modern React dengan `components/`, `pages/`, `hooks/`, dan `services/` yang terpisah.

---

## 🚀 Instalasi & Setup

### Prasyarat

* Node.js 18+
* npm atau yarn

### Langkah Instalasi

```bash
git clone https://github.com/Haikal18/trashvalues-admin.git
cd trashvalue-dashboard
npm install
```

### Setup Environment Variables

Buat file `.env` dan tambahkan:

```
VITE_API_BASE_URL=https://your-api-url.com
```

### Menjalankan Project

```bash
npm run dev
```

### Build untuk Production

```bash
npm run build
```

---

## 🎯 Penggunaan

### Login Admin

* Buka aplikasi di browser
* Login menggunakan kredensial admin
* Akan diarahkan ke dashboard utama

### Mengelola Jenis Sampah

1. Navigasi ke menu **"Waste Types"**
2. Klik **"Add New"**
3. Isi form:

   * Nama jenis sampah
   * Harga per kg
   * Deskripsi
   * Upload gambar
   * Status aktif/tidak aktif

### Mengelola Bank Sampah

1. Navigasi ke menu **"Bank Sampah"**
2. Tambah/edit/hapus data
3. Isi nama & alamat bank sampah

### Mengelola Dropoff

1. Navigasi ke menu **"Dropoff"**
2. Lihat semua dropoff
3. Filter berdasarkan status/pencarian
4. Ubah status dropoff & lihat detail lengkap

### Melihat Riwayat Transaksi

1. Navigasi ke menu **"History"**
2. Gunakan filter pencarian
3. Export PDF jika diperlukan

---

## 📱 Responsive Design

Aplikasi mendukung **fully responsive** layout:

| Device  | Layout                |
| ------- | --------------------- |
| Mobile  | Card layout (compact) |
| Tablet  | Hybrid layout         |
| Desktop | Full table layout     |

---

## 🔐 Fitur Keamanan

* Protected routes (login & role-based access)
* Validasi form dengan Zod
* API call dengan error handling
* Session management

---

## 🎨 UI/UX Features

* Tampilan modern dan clean
* Skema warna konsisten (Green theme)
* Loading state & skeleton loaders
* Toast notification
* Modal dialog yang intuitif

---

## 📊 Data Management

* Real-time fetching dengan **React Query**
* Optimistic updates untuk UX yang lebih baik
* Caching & pagination
* Pencarian & filter data

---
> TrashValue Admin Dashboard – **Mengubah Sampah Menjadi Nilai 🌱**
---
