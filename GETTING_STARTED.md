# 🚀 Getting Started dengan KARYO OS

Panduan lengkap untuk setup development environment dan jalankan aplikasi.

---

## 📋 Prasyarat

- **Node.js** 18+ ([download](https://nodejs.org))
- **Git** untuk clone repository
- **Supabase Account** ([daftar gratis](https://supabase.com))

---

## ⚡ 3-Minute Quickstart

### 1. Clone Repository
```bash
git clone https://github.com/zenipara/Militer.git
cd Militer
```

### 2. Automatic Setup (Recommended)
```bash
# Codespace atau terminal lokal
bash scripts/setup.sh

# Script ini handle:
# ✅ npm install (dependencies)
# ✅ .env.local setup (interactive)
# ✅ Supabase migration (jika ada)
# ✅ npm run build (verify)
```

### 3. Run Development Server
```bash
npm run dev
```

Akses aplikasi: **http://localhost:5173**

---

## 🔧 Manual Setup (Jika Script Gagal)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Buat `.env.local` di root project:
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan Supabase credentials:
```env
# Supabase Config
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Only for GitHub Pages deploy
VITE_BASE_PATH=/Militer/
VITE_APP_NAME=Karyo OS
```

**Cara dapatkan Supabase credentials:**
1. Login ke [Supabase](https://app.supabase.com)
2. Buat project baru atau gunakan existing
3. Pergi ke **Settings → API**
4. Copy `Project URL` → `VITE_SUPABASE_URL`
5. Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`

### Step 3: Database Migration
```bash
# Setup Supabase CLI
npm install -g supabase
# atau
npm exec --yes supabase@latest -- --version

# Push migrations ke database
supabase db push
## 🚀 Getting Started dengan KARYO OS

Panduan singkat untuk setup development environment dan menjalankan aplikasi.

---

## 📋 Prasyarat

- **Node.js** 20+ ([download](https://nodejs.org))
- **Git**
- **Supabase Account** ([daftar gratis](https://supabase.com))

---

## ⚡ Quickstart (Ringkas)

1. Clone repository

```bash
git clone <repo-url>
cd <repo>
```

2. Jalankan setup otomatis (direkomendasikan)

```bash
bash scripts/setup.sh
```

3. Jalankan development server

```bash
npm run dev
```

Akses: `http://localhost:5173`

---

## 🔧 Manual Setup (Jika perlu)

1. Install dependencies

```bash
npm install
```

2. Siapkan env

```bash
cp .env.example .env.local
# edit .env.local dengan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
```

3. Jalankan migrasi (opsional)

```bash
npm run sync:supabase
# atau: supabase db push
```

4. Jalankan dev server

```bash
npm run dev
```

---

## 🎯 Demo Accounts (development)

PIN demo default: `123456`

- Admin: `1000001`
- Komandan: `2000001`
- Prajurit: `3000001`
- Staf: `5000001`

---

## 🔨 Scripts Penting

Gunakan skrip yang tersedia di `package.json`:

```bash
# Development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Tests
npm run test:unit
npm run test:e2e
```

Catatan: tidak semua contoh perintah di dokumentasi lama (mis. `format`, `check`) tersedia di `package.json` — gunakan perintah yang tertera di atas.

---

## 📂 Struktur Proyek (ringkas)

```
src/
e2e/
supabase/
scripts/
public/
package.json
```

---

## 🐛 Troubleshooting Singkat

- Port 5173 sibuk: `lsof -ti:5173 | xargs kill -9`
- Path alias bermasalah: cek `tsconfig.app.json` paths `@/*` → `./src/*`
- Supabase tidak konek: cek `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`

---

Jika butuh bantuan lanjutan, lihat `DEPLOYMENT.md`, `TROUBLESHOOTING.md`, atau buka issue di repo.

**Happy coding!** 🚀

