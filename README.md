# TELMI - Website Penyedia Jasa Telekomunikasi

Website untuk penyedia jasa telekomunikasi dengan desain modern menggunakan React dan Vite.

## Fitur

### Landing Page
- ✅ Header dengan navigasi lengkap (dropdown menu)
- ✅ Hero section dengan animasi
- ✅ Features section (6 fitur utama)
- ✅ Cara kerja sistem (4 langkah)
- ✅ Rekomendasi paket dengan carousel
- ✅ Call to action section
- ✅ Customer actions section
- ✅ Footer dengan informasi kontak

### CMS (Content Management System)
- ✅ Dashboard dengan statistik
- ✅ Kelola Paket (CRUD)
- ✅ Kelola Pelanggan
- ✅ Kelola Rekomendasi
- ✅ Pengaturan Sistem
- ✅ Sidebar navigasi yang responsif

## Teknologi

- React 18
- React Router DOM (Routing)
- Vite
- CSS3 (Modern styling dengan CSS Variables)

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Build untuk production:
```bash
npm run build
```

### 🚀 Cara Cepat dengan Batch File (Windows)

File batch helper untuk memudahkan:

1. **Double-click `install.bat`** - Untuk install dependencies
2. **Double-click `run-dev.bat`** - Untuk menjalankan development server

## Struktur Project

```
├── src/
│   ├── components/          # Komponen React
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── PackageRecommendations.jsx
│   │   ├── CallToAction.jsx
│   │   ├── CustomerActions.jsx
│   │   ├── Footer.jsx
│   │   └── CMSLayout.jsx   # Layout untuk CMS
│   ├── pages/              # Halaman
│   │   ├── Home.jsx        # Landing page
│   │   └── CMS/            # Halaman CMS
│   │       ├── Dashboard.jsx
│   │       ├── Packages.jsx
│   │       ├── Customers.jsx
│   │       ├── Recommendations.jsx
│   │       └── Settings.jsx
│   ├── styles/             # File CSS
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── [component].css
│   │   └── CMS/            # CSS untuk CMS
│   │       ├── CMSLayout.css
│   │       ├── Dashboard.css
│   │       ├── Packages.css
│   │       ├── Customers.css
│   │       ├── Recommendations.css
│   │       └── Settings.css
│   ├── App.jsx             # Router utama
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Routing

- `/` - Landing page (Home)
- `/cms` - Dashboard CMS
- `/cms/packages` - Kelola Paket
- `/cms/customers` - Kelola Pelanggan
- `/cms/recommendations` - Kelola Rekomendasi
- `/cms/settings` - Pengaturan

## Catatan

Project ini masih dalam tahap UI development. Backend dan fungsionalitas akan ditambahkan kemudian.



