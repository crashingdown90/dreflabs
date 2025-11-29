# MASTERPLAN - DREFLABS.COM

**Dokumen Perencanaan Komprehensif Berbasis User Story**
**Version:** 4.0
**Last Updated:** November 2025
**Author:** Drefan Mardiawan
**Status:** Living Document

---

# 📑 DAFTAR ISI

1. [Ringkasan Proyek](#-ringkasan-proyek)
2. [User Personas](#-user-personas)
3. [Tujuan Bisnis (SMART Goals)](#-tujuan-bisnis-smart-goals)
4. [User Stories](#-user-stories)
   - Epic 1: Mengenal Drefan & Kredibilitas
   - Epic 2: Belajar & Mendapat Insight
   - Epic 3: Menghubungi & Konsultasi
   - Epic 4: Administrasi Website
   - Epic 5: Pengalaman Pengguna (UX)
5. [Ringkasan User Stories](#-ringkasan-user-stories)
6. [Arsitektur Teknis](#-arsitektur-teknis)
7. [Database Schema](#-database-schema)
8. [API Endpoints](#-api-endpoints)
9. [Security Implementation](#-security-implementation)
10. [Deployment Strategy](#-deployment-strategy)
11. [Performance & Monitoring](#-performance--monitoring)
12. [Roadmap](#-roadmap)
13. [Success Metrics & KPIs](#-success-metrics--kpis)
14. [Maintenance & Support](#-maintenance--support)

---

## 📋 Ringkasan Proyek

### Tentang Website
Website portfolio profesional untuk **Drefan Mardiawan** - IT Expert dengan spesialisasi Big Data, AI, Cyber Security, dan E-Government. Platform ini berfungsi sebagai hub digital untuk personal branding, showcase proyek, lead generation, dan konsultasi bisnis.

**Domain:** dreflabs.com
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, SQLite
**Target Audience:** Pemerintah, Enterprise, IT Professionals

### Visi
Menjadi platform digital terdepan untuk personal branding di bidang teknologi pemerintahan dan enterprise di Indonesia.

### Misi
1. Menyediakan informasi lengkap tentang layanan konsultasi IT
2. Menampilkan portfolio proyek secara profesional
3. Berbagi pengetahuan melalui konten berkualitas
4. Memudahkan calon klien untuk terhubung

### Nilai Utama (Core Values)
| Value | Deskripsi |
|-------|-----------|
| **Kredibilitas** | Menampilkan pengalaman dan expertise yang terbukti |
| **Profesionalisme** | Desain dan konten berkualitas tinggi |
| **Aksesibilitas** | Mudah diakses dan dipahami semua pengunjung |
| **Keamanan** | Perlindungan data pengunjung dan sistem |

---

## 👥 User Personas

### Persona 1: Calon Klien Pemerintah

| Atribut | Detail |
|---------|--------|
| **Nama** | Budi Santoso |
| **Jabatan** | Kepala Bidang IT Dinas Kominfo |
| **Usia** | 40-55 tahun |
| **Goals** | Mencari konsultan IT terpercaya untuk proyek digitalisasi |
| **Pain Points** | Sulit menemukan vendor yang paham regulasi pemerintah |
| **Behavior** | Riset online, cari referensi, bandingkan portfolio |

### Persona 2: Calon Klien Enterprise

| Atribut | Detail |
|---------|--------|
| **Nama** | Rina Wijaya |
| **Jabatan** | CTO Startup / IT Manager Perusahaan |
| **Usia** | 30-45 tahun |
| **Goals** | Mencari expert untuk implementasi Big Data/AI |
| **Pain Points** | Butuh konsultan yang bisa deliver dengan timeline ketat |
| **Behavior** | Aktif LinkedIn, baca artikel teknis, cek portfolio |

### Persona 3: Pembaca Blog Teknis

| Atribut | Detail |
|---------|--------|
| **Nama** | Andi Programmer |
| **Jabatan** | Developer / Data Engineer |
| **Usia** | 25-35 tahun |
| **Goals** | Belajar dari pengalaman praktisi senior |
| **Pain Points** | Kurang konten teknis berbahasa Indonesia yang berkualitas |
| **Behavior** | Baca blog, subscribe newsletter, share artikel |

### Persona 4: Admin Website

| Atribut | Detail |
|---------|--------|
| **Nama** | Drefan Mardiawan |
| **Jabatan** | Owner / IT Expert |
| **Usia** | - |
| **Goals** | Mengelola konten, merespon leads, track analytics |
| **Pain Points** | Butuh dashboard yang mudah dan efisien |
| **Behavior** | Update blog rutin, kelola inquiries, monitor traffic |

---

## 🎯 Tujuan Bisnis (SMART Goals)

| # | Tujuan | Specific | Measurable | Target |
|---|--------|----------|------------|--------|
| 1 | Personal Branding | Membangun presence digital sebagai IT Expert | Ranking Google page 1 untuk keyword target | 6 bulan |
| 2 | Portfolio Showcase | Menampilkan min. 10 case study berkualitas | Portfolio views > 500/bulan | 3 bulan |
| 3 | Lead Generation | Menghasilkan prospek klien via web | Min. 5 qualified leads/bulan | 6 bulan |
| 4 | Knowledge Sharing | Publikasi artikel teknis berkualitas | Min. 4 artikel/bulan, 1000 readers | Ongoing |
| 5 | Thought Leadership | Dikenal sebagai expert di bidangnya | Speaking invitation, media coverage | 12 bulan |

### User Journey Maps

#### Visitor Journey: Mencari Konsultan IT

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   DISCOVER  │───>│   EXPLORE   │───>│   EVALUATE  │───>│   CONTACT   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
      ▼                  ▼                  ▼                  ▼
 Google Search      Homepage           Portfolio          Contact Form
 Social Media       About Section      Case Studies       Web Assessment
 Referral           Services           Blog Articles      Email/Phone
```

#### Admin Journey: Mengelola Konten

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    LOGIN    │───>│  DASHBOARD  │───>│   MANAGE    │───>│   PUBLISH   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
      ▼                  ▼                  ▼                  ▼
 Secure Auth        View Stats         Create/Edit        Review
 Remember Me        Quick Actions      Upload Media       Publish
 CSRF Token         Recent Activity    Preview            Notify
```

---

# 📖 USER STORIES

Berikut adalah daftar lengkap user stories yang menjadi dasar pengembangan website. Setiap story dilengkapi dengan acceptance criteria, fitur yang dibutuhkan, dan implementasi teknis.

---

## EPIC 1: Mengenal Drefan & Kredibilitas

### US-01: Melihat Profil Profesional

> **Sebagai** calon klien,
> **Saya ingin** melihat profil lengkap Drefan Mardiawan
> **Agar** saya dapat menilai kredibilitas dan pengalamannya sebelum memutuskan untuk bekerja sama.

| Atribut | Detail |
|---------|--------|
| **Persona** | Calon Klien Pemerintah, Calon Klien Enterprise |
| **Priority** | 🔴 High |
| **Story Points** | 5 |
| **Sprint** | 1 |

#### Acceptance Criteria

- [ ] Foto profesional ditampilkan dengan kualitas tinggi
- [ ] Bio singkat yang menjelaskan expertise dan pengalaman
- [ ] Statistik karir (tahun pengalaman, jumlah proyek, klien)
- [ ] Timeline karir yang interaktif
- [ ] Daftar expertise dengan visualisasi yang jelas
- [ ] Link ke LinkedIn dan sosial media profesional

#### Fitur yang Dibutuhkan

| Fitur | Deskripsi | Halaman |
|-------|-----------|---------|
| Hero Section | Perkenalan singkat dengan foto dan tagline | Homepage |
| About Section | Bio detail dengan statistik | Homepage |
| Timeline | Perjalanan karir interaktif | Homepage |
| Expertise Cards | 8 bidang keahlian dengan icons | Homepage |

#### User Flow

```
User mengunjungi homepage
    ↓
Melihat Hero Section dengan foto dan tagline
    ↓
Scroll ke About Section → Baca bio dan lihat statistik
    ↓
Scroll ke Timeline → Lihat perjalanan karir
    ↓
Scroll ke Expertise → Pahami bidang keahlian
    ↓
Klik CTA "Lihat Portfolio" atau "Hubungi Saya"
```

#### Implementasi Teknis

| Komponen | File | Teknologi |
|----------|------|-----------|
| Hero | `components/home/Hero.tsx` | Framer Motion, Typed.js |
| About | `components/home/About.tsx` | React, Tailwind |
| Timeline | `components/home/Timeline.tsx` | Framer Motion |
| Expertise | `components/home/Expertise.tsx` | JSON data, Icons |

---

### US-02: Melihat Portfolio Proyek

> **Sebagai** calon klien,
> **Saya ingin** melihat portfolio proyek-proyek sebelumnya
> **Agar** saya dapat menilai kualitas pekerjaan dan relevansi pengalaman.

| Atribut | Detail |
|---------|--------|
| **Persona** | Calon Klien Pemerintah, Calon Klien Enterprise |
| **Priority** | 🔴 High |
| **Story Points** | 8 |
| **Sprint** | 1-2 |

#### Acceptance Criteria

- [ ] Minimal 5 proyek unggulan ditampilkan
- [ ] Setiap proyek memiliki case study lengkap
- [ ] Filter berdasarkan kategori (Big Data, AI, Security, E-Gov)
- [ ] Thumbnail visual yang menarik
- [ ] Detail: klien, durasi, peran, tim, teknologi
- [ ] Hasil terukur dengan metrik konkret

#### Fitur yang Dibutuhkan

| Fitur | Deskripsi | Halaman |
|-------|-----------|---------|
| Featured Projects | 3 proyek unggulan di homepage | Homepage |
| Project Grid | Daftar semua proyek dengan filter | /projects |
| Case Study | Detail lengkap proyek | /projects/[slug] |

#### User Flow

```
User di homepage → Lihat Featured Projects
    ↓
Tertarik → Klik "Lihat Semua Proyek"
    ↓
Halaman Projects → Filter berdasarkan kategori
    ↓
Klik project card → Halaman case study
    ↓
Baca detail: Problem → Solution → Technologies → Results
    ↓
Terkesan → Klik CTA "Hubungi untuk Proyek Serupa"
```

#### Implementasi Teknis

| Komponen | File | Teknologi |
|----------|------|-----------|
| Featured Projects | `components/home/FeaturedProjects.tsx` | React, Framer Motion |
| Project Grid | `app/(public)/projects/page.tsx` | Next.js, Filter logic |
| Case Study | `app/(public)/projects/[slug]/page.tsx` | MDX/JSON, Dynamic route |

#### Data Structure

```typescript
interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  coverImage: string
  images: string[]
  category: "Big Data" | "AI/ML" | "E-Government" | "Security"
  clientType: "Government" | "Enterprise" | "Startup"
  duration: string
  role: string
  teamSize: number
  year: string
  technologies: { name: string; icon: string }[]
  problem: string
  solution: string
  results: { metric: string; value: string; description: string }[]
  featured: boolean
}
```

---

## EPIC 2: Belajar & Mendapat Insight

### US-03: Membaca Artikel Blog

> **Sebagai** pembaca teknis,
> **Saya ingin** membaca artikel berkualitas tentang teknologi
> **Agar** saya dapat belajar dari pengalaman dan insight praktisi.

| Atribut | Detail |
|---------|--------|
| **Persona** | Pembaca Blog Teknis, Calon Klien |
| **Priority** | 🔴 High |
| **Story Points** | 8 |
| **Sprint** | 2 |

#### Acceptance Criteria

- [ ] Daftar artikel dengan thumbnail, judul, excerpt
- [ ] Kategori: Big Data, AI, Security, E-Government, Tutorial
- [ ] Search functionality (full-text)
- [ ] Estimasi waktu baca
- [ ] Tanggal publikasi
- [ ] Syntax highlighting untuk code blocks
- [ ] Responsive reading experience

#### Fitur yang Dibutuhkan

| Fitur | Deskripsi | Halaman |
|-------|-----------|---------|
| Recent Posts | 3 artikel terbaru di homepage | Homepage |
| Blog Grid | Daftar artikel dengan filter/search | /blog |
| Blog Detail | Artikel lengkap dengan MDX | /blog/[slug] |

#### User Flow

```
User mencari informasi di Google
    ↓
Menemukan artikel blog → Klik link
    ↓
Membaca artikel → Scroll konten
    ↓
Tertarik artikel lain → Lihat Related Posts
    ↓
Ingin update rutin → Subscribe Newsletter
```

#### Implementasi Teknis

| Komponen | File | Teknologi |
|----------|------|-----------|
| Recent Posts | `components/home/RecentPosts.tsx` | React |
| Blog List | `components/blog/BlogList.tsx` | Next.js, MDX |
| Blog Detail | `app/(public)/blog/[slug]/page.tsx` | MDX, Prism.js |
| Category Filter | `components/blog/CategoryFilter.tsx` | React State |
| Search | `components/blog/SearchBar.tsx` | Full-text search |


---

### US-04: Berinteraksi dengan Artikel

> **Sebagai** pembaca,
> **Saya ingin** memberikan komentar dan share artikel
> **Agar** saya dapat berdiskusi dan berbagi dengan komunitas.

| Atribut | Detail |
|---------|--------|
| **Persona** | Pembaca Blog Teknis |
| **Priority** | 🟡 Medium |
| **Story Points** | 5 |
| **Sprint** | 3 |

#### Acceptance Criteria

- [ ] Form komentar dengan nama dan email
- [ ] Komentar dimoderasi sebelum tampil
- [ ] Share buttons (Twitter, LinkedIn, WhatsApp, Copy Link)
- [ ] Notifikasi sukses setelah submit komentar
- [ ] Anti-spam protection (rate limiting)

#### Fitur yang Dibutuhkan

| Fitur | Deskripsi | Halaman |
|-------|-----------|---------|
| Comment Form | Form input komentar | /blog/[slug] |
| Comment List | Daftar komentar yang disetujui | /blog/[slug] |
| Share Buttons | Social sharing icons | /blog/[slug] |

#### Implementasi Teknis

| Komponen | File | API Endpoint |
|----------|------|--------------|
| Comment Section | `components/blog/CommentSection.tsx` | POST /api/comments |
| Share Buttons | `components/blog/ShareButtons.tsx` | - |
| Comment Moderation | Admin Dashboard | GET/PUT /api/admin/comments |

---

### US-05: Subscribe Newsletter

> **Sebagai** pembaca,
> **Saya ingin** subscribe newsletter
> **Agar** saya mendapat notifikasi artikel baru dan update.

| Atribut | Detail |
|---------|--------|
| **Persona** | Pembaca Blog Teknis |
| **Priority** | 🟡 Medium |
| **Story Points** | 3 |
| **Sprint** | 2 |

#### Acceptance Criteria

- [ ] Form input email yang simpel
- [ ] Validasi email format
- [ ] Konfirmasi subscription sukses
- [ ] Tidak ada duplikat subscriber
- [ ] Opsi unsubscribe

#### Fitur yang Dibutuhkan

| Fitur | Deskripsi | Halaman |
|-------|-----------|---------|
| Newsletter Form | Input email di footer | Semua halaman |
| Thank You Message | Konfirmasi setelah subscribe | Inline |

#### Implementasi Teknis

| Komponen | File | API Endpoint |
|----------|------|--------------|
| Newsletter Form | `components/forms/NewsletterForm.tsx` | POST /api/newsletter |
| Footer | `components/layout/Footer.tsx` | - |

---

## EPIC 3: Menghubungi & Konsultasi

### US-06: Melihat Layanan yang Ditawarkan

> **Sebagai** calon klien,
> **Saya ingin** melihat daftar layanan yang ditawarkan
> **Agar** saya dapat memilih layanan yang sesuai kebutuhan.

| Atribut | Detail |
|---------|--------|
| **Persona** | Calon Klien Pemerintah, Calon Klien Enterprise |
| **Priority** | 🔴 High |
| **Story Points** | 5 |
| **Sprint** | 1 |

#### Acceptance Criteria

- [ ] Minimal 6 layanan ditampilkan
- [ ] Setiap layanan: icon, nama, deskripsi singkat
- [ ] Klik untuk detail layanan
- [ ] Informasi pricing (range atau "hubungi untuk quote")
- [ ] CTA untuk konsultasi

#### Daftar Layanan

| ID | Layanan | Kategori | Target Market |
|----|---------|----------|---------------|
| 1 | Professional Web Development | Development | Enterprise, Startup |
| 2 | Big Data & Analytics Consulting | Consulting | Enterprise, Government |
| 3 | AI & Machine Learning Solutions | Solution | Enterprise |
| 4 | Cyber Security Services | Security | All |
| 5 | E-Government Digital Transformation | Government | Government |
| 6 | Government IT Governance | Consulting | Government |

#### User Flow

```
User mengunjungi /services
    ↓
Melihat grid layanan dengan icons
    ↓
Tertarik → Klik service card untuk detail
    ↓
Baca deskripsi, scope, pricing
    ↓
Klik CTA "Request Konsultasi" atau isi Web Assessment Form
```

#### Implementasi Teknis

| Komponen | File | Data Source |
|----------|------|-------------|
| Services Grid | `app/(public)/services/page.tsx` | services.json |
| Service Card | `components/ui/Card.tsx` | - |
| Web Assessment | `components/forms/WebAssessmentForm.tsx` | - |

---

### US-07: Menghubungi untuk Konsultasi

> **Sebagai** calon klien,
> **Saya ingin** menghubungi Drefan untuk konsultasi
> **Agar** saya dapat mendiskusikan kebutuhan proyek saya.

| Atribut | Detail |
|---------|--------|
| **Persona** | Calon Klien Pemerintah, Calon Klien Enterprise |
| **Priority** | 🔴 High |
| **Story Points** | 5 |
| **Sprint** | 1 |

#### Acceptance Criteria

- [ ] Form kontak dengan field: nama, email, perusahaan, pesan
- [ ] Validasi real-time pada input
- [ ] Rate limiting untuk anti-spam
- [ ] Email notifikasi ke admin
- [ ] Konfirmasi sukses ke user
- [ ] CSRF protection

#### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Nama | Text | ✅ | Min 2 karakter |
| Email | Email | ✅ | Format email valid |
| Perusahaan | Text | ❌ | - |
| Layanan | Dropdown | ❌ | Dari daftar layanan |
| Pesan | Textarea | ✅ | Min 10 karakter |

#### User Flow

```
User mengunjungi /contact
    ↓
Mengisi form kontak
    ↓
Real-time validation → Fix errors jika ada
    ↓
Submit form
    ↓
Loading state → Success message
    ↓
Email terkirim ke admin
```

#### Implementasi Teknis

| Komponen | File | API Endpoint |
|----------|------|--------------|
| Contact Form | `app/(public)/contact/page.tsx` | POST /api/contact |
| Form Validation | React Hook Form + Zod | - |
| Email Service | `lib/email.ts` | Nodemailer |


---

### US-08: Mengisi Web Assessment Form

> **Sebagai** calon klien web development,
> **Saya ingin** mengisi form assessment proyek web
> **Agar** saya bisa mendapat estimasi dan konsultasi yang lebih tepat.

| Atribut | Detail |
|---------|--------|
| **Persona** | Calon Klien Enterprise, Startup |
| **Priority** | 🔴 High |
| **Story Points** | 8 |
| **Sprint** | 2 |

#### Acceptance Criteria

- [ ] Multi-step form yang user-friendly
- [ ] Progress indicator
- [ ] Field: nama, email, telepon, perusahaan, tipe proyek
- [ ] Dropdown: budget range, timeline
- [ ] Textarea: deskripsi kebutuhan
- [ ] Save draft (opsional)
- [ ] Validasi di setiap step
- [ ] Email notifikasi ke admin

#### Form Structure

| Step | Fields |
|------|--------|
| 1. Informasi Dasar | Nama, Email, Telepon, Perusahaan |
| 2. Detail Proyek | Tipe Proyek, Budget Range, Timeline |
| 3. Deskripsi | Deskripsi lengkap kebutuhan |
| 4. Review & Submit | Preview semua data |

#### Implementasi Teknis

| Komponen | File | API Endpoint |
|----------|------|--------------|
| Assessment Form | `components/forms/WebAssessmentForm.tsx` | POST /api/assessment |
| Form State | React Hook Form | - |
| Validation | Zod Schema | - |

---

## EPIC 4: Administrasi Website

### US-09: Login Admin dengan Aman

> **Sebagai** admin,
> **Saya ingin** login ke dashboard dengan aman
> **Agar** saya dapat mengelola konten website.

| Atribut | Detail |
|---------|--------|
| **Persona** | Admin Website |
| **Priority** | 🔴 High |
| **Story Points** | 5 |
| **Sprint** | 2 |

#### Acceptance Criteria

- [ ] Halaman login yang terpisah (/admin/login)
- [ ] Username dan password authentication
- [ ] Rate limiting (max 5 attempts per 15 min)
- [ ] CSRF token protection
- [ ] JWT token dengan httpOnly cookie
- [ ] Session timeout (24 jam)
- [ ] Redirect ke dashboard setelah login

#### Security Measures

| Measure | Implementasi |
|---------|--------------|
| Password Hashing | bcrypt dengan salt rounds 12 |
| Token | JWT dengan expiry 24h |
| Cookie | httpOnly, Secure, SameSite=Strict |
| CSRF | Token di header + cookie validation |
| Rate Limit | 5 attempts / 15 minutes |

#### User Flow

```
Admin mengunjungi /admin/login
    ↓
Mengisi username dan password
    ↓
Submit → Validasi kredensial
    ↓
Success → Set JWT cookie → Redirect ke /admin
Fail → Show error + increment attempt counter
```

#### Implementasi Teknis

| Komponen | File | API Endpoint |
|----------|------|--------------|
| Login Page | `app/admin/login/page.tsx` | POST /api/auth/login |
| Auth Middleware | `middleware.ts` | - |
| JWT Handler | `lib/auth.ts` | - |
| CSRF Token | `lib/security.ts` | GET /api/auth/csrf |

---

### US-10: Mengelola Artikel Blog

> **Sebagai** admin,
> **Saya ingin** membuat, mengedit, dan menghapus artikel blog
> **Agar** saya dapat mempublikasikan konten baru.

| Atribut | Detail |
|---------|--------|
| **Persona** | Admin Website |
| **Priority** | 🔴 High |
| **Story Points** | 13 |
| **Sprint** | 3-4 |

#### Acceptance Criteria

- [ ] Daftar semua artikel (draft & published)
- [ ] Form create/edit dengan WYSIWYG editor
- [ ] Support MDX syntax
- [ ] Upload gambar cover dan inline
- [ ] Set kategori dan tags
- [ ] Preview sebelum publish
- [ ] Save as draft
- [ ] Publish/unpublish toggle
- [ ] Delete dengan konfirmasi

#### Blog CRUD Operations

| Operation | Method | Endpoint |
|-----------|--------|----------|
| List | GET | /api/admin/blog |
| Create | POST | /api/admin/blog |
| Read | GET | /api/admin/blog/[id] |
| Update | PUT | /api/admin/blog/[id] |
| Delete | DELETE | /api/admin/blog/[id] |

#### Implementasi Teknis

| Komponen | File | Deskripsi |
|----------|------|-----------|
| Blog List | `app/admin/blog/page.tsx` | Daftar artikel |
| Blog Editor | `app/admin/blog/new/page.tsx` | Form create/edit |
| MDX Preview | Custom component | Real-time preview |
| Image Upload | `components/admin/ImageUpload.tsx` | Upload & resize |

---

### US-11: Moderasi Komentar

> **Sebagai** admin,
> **Saya ingin** memoderasi komentar sebelum ditampilkan
> **Agar** saya dapat menjaga kualitas diskusi.

| Atribut | Detail |
|---------|--------|
| **Persona** | Admin Website |
| **Priority** | 🟡 Medium |
| **Story Points** | 5 |
| **Sprint** | 4 |

#### Acceptance Criteria

- [ ] Daftar komentar pending moderation
- [ ] Preview komentar dengan artikel terkait
- [ ] Approve atau reject komentar
- [ ] Bulk actions (approve/reject multiple)
- [ ] Filter: pending, approved, rejected
- [ ] Notifikasi jumlah pending comments

#### Comment States

| State | Deskripsi |
|-------|-----------|
| `pending` | Baru masuk, menunggu moderasi |
| `approved` | Disetujui, tampil di website |
| `rejected` | Ditolak, tidak tampil |

#### Implementasi Teknis

| Komponen | File | API Endpoint |
|----------|------|--------------|
| Comment List | `app/admin/comments/page.tsx` | GET /api/admin/comments |
| Moderate | - | PUT /api/admin/comments/[id] |
| Bulk Action | - | PUT /api/admin/comments/bulk |

---

### US-12: Melihat Analytics Website

> **Sebagai** admin,
> **Saya ingin** melihat statistik pengunjung website
> **Agar** saya dapat memahami performa dan mengoptimasi konten.

| Atribut | Detail |
|---------|--------|
| **Persona** | Admin Website |
| **Priority** | 🟡 Medium |
| **Story Points** | 8 |
| **Sprint** | 4 |

#### Acceptance Criteria

- [ ] Dashboard overview dengan key metrics
- [ ] Total page views (daily, weekly, monthly)
- [ ] Unique visitors
- [ ] Top pages by views
- [ ] Popular blog posts
- [ ] Traffic sources (referrer)
- [ ] Date range filter

#### Metrics Dashboard

| Metric | Deskripsi |
|--------|-----------|
| Page Views | Total kunjungan halaman |
| Unique Visitors | Berdasarkan IP/session |
| Top Pages | 10 halaman terpopuler |
| Popular Posts | 10 artikel terbanyak dibaca |
| Referrers | Sumber traffic |
| Bounce Rate | Persentase single-page visits |

#### Implementasi Teknis

| Komponen | File | Data Source |
|----------|------|-------------|
| Analytics Dashboard | `app/admin/analytics/page.tsx` | SQLite |
| Charts | Chart.js / Recharts | - |
| Tracking | `lib/analytics.ts` | Page view events |


---

### US-13: Mengelola Leads & Inquiries

> **Sebagai** admin,
> **Saya ingin** melihat dan merespon inquiries dari calon klien
> **Agar** saya dapat follow-up leads secara efektif.

| Atribut | Detail |
|---------|--------|
| **Persona** | Admin Website |
| **Priority** | 🔴 High |
| **Story Points** | 5 |
| **Sprint** | 3 |

#### Acceptance Criteria

- [ ] Daftar semua contact submissions
- [ ] Daftar web assessment submissions
- [ ] Detail view untuk setiap inquiry
- [ ] Status tracking: new, contacted, converted, closed
- [ ] Filter dan search
- [ ] Export ke CSV

#### Lead Status Flow

```
New → Contacted → In Discussion → Converted / Closed
```

#### Implementasi Teknis

| Komponen | File | API Endpoint |
|----------|------|--------------|
| Contacts List | `app/admin/contacts/page.tsx` | GET /api/admin/contacts |
| Assessments List | `app/admin/assessments/page.tsx` | GET /api/admin/assessments |
| Status Update | - | PUT /api/admin/contacts/[id] |

---

## EPIC 5: Pengalaman Pengguna (UX)

### US-14: Website Cepat & Responsive

> **Sebagai** pengunjung,
> **Saya ingin** website loading cepat di semua device
> **Agar** saya tidak frustasi menunggu dan bisa akses dari mana saja.

| Atribut | Detail |
|---------|--------|
| **Persona** | Semua Visitor |
| **Priority** | 🔴 High |
| **Story Points** | 8 |
| **Sprint** | 1-4 (Ongoing) |

#### Acceptance Criteria

- [ ] Lighthouse Performance score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Mobile responsive (breakpoints: 640, 768, 1024, 1280)
- [ ] Works offline (service worker)

#### Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Performance | > 90 | Lighthouse |
| Accessibility | > 90 | Lighthouse |
| Best Practices | > 90 | Lighthouse |
| SEO | > 90 | Lighthouse |
| LCP | < 2.5s | Core Web Vitals |
| FID | < 100ms | Core Web Vitals |
| CLS | < 0.1 | Core Web Vitals |

#### Implementasi Teknis

| Optimization | Implementasi |
|--------------|--------------|
| Image Optimization | Next/Image, WebP, lazy loading |
| Code Splitting | Dynamic imports |
| Caching | Static generation, CDN |
| Bundle Size | Tree shaking, minification |
| Font Loading | next/font, display:swap |

---

### US-15: Navigasi yang Intuitif

> **Sebagai** pengunjung,
> **Saya ingin** navigasi website yang mudah dan jelas
> **Agar** saya dapat menemukan informasi dengan cepat.

| Atribut | Detail |
|---------|--------|
| **Persona** | Semua Visitor |
| **Priority** | 🔴 High |
| **Story Points** | 3 |
| **Sprint** | 1 |

#### Acceptance Criteria

- [ ] Header sticky dengan menu utama
- [ ] Mobile hamburger menu
- [ ] Active state pada menu item
- [ ] Breadcrumbs pada halaman detail
- [ ] Footer dengan link penting
- [ ] Smooth scroll untuk anchor links

#### Menu Structure

```
Header Menu:
├── Home
├── Blog
├── Projects
├── Services
└── Contact

Footer Links:
├── Quick Links (same as header)
├── Services (list)
├── Social Media
└── Newsletter Form
```

#### Implementasi Teknis

| Komponen | File | Fitur |
|----------|------|-------|
| Header | `components/layout/Header.tsx` | Sticky, responsive |
| Mobile Menu | Inside Header | Hamburger, slide-in |
| Footer | `components/layout/Footer.tsx` | Links, newsletter |

---

### US-16: Dark Theme yang Nyaman

> **Sebagai** pengunjung,
> **Saya ingin** dark theme yang nyaman di mata
> **Agar** saya dapat browsing di malam hari atau lingkungan gelap.

| Atribut | Detail |
|---------|--------|
| **Persona** | Semua Visitor |
| **Priority** | 🟡 Medium |
| **Story Points** | 3 |
| **Sprint** | 1 |

#### Acceptance Criteria

- [ ] Default dark theme
- [ ] Warna kontras yang baik (WCAG AA)
- [ ] Accent color yang konsisten (cyan/teal)
- [ ] Tidak menyakiti mata
- [ ] Syntax highlighting yang tepat

#### Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Main background |
| Surface | `#171717` | Cards, sections |
| Border | `#262626` | Borders, dividers |
| Text Primary | `#ffffff` | Headings |
| Text Secondary | `#a3a3a3` | Body text |
| Accent | `#06b6d4` | Links, buttons |
| Accent Hover | `#22d3ee` | Hover states |

---

# 📊 RINGKASAN USER STORIES

## Story Points Summary

| Epic | Stories | Total Points | Priority Distribution |
|------|---------|--------------|----------------------|
| EPIC 1: Kredibilitas | 2 | 13 | 🔴 High: 2 |
| EPIC 2: Belajar | 3 | 16 | 🔴 High: 1, 🟡 Medium: 2 |
| EPIC 3: Konsultasi | 3 | 18 | 🔴 High: 3 |
| EPIC 4: Administrasi | 5 | 36 | 🔴 High: 3, 🟡 Medium: 2 |
| EPIC 5: UX | 3 | 14 | 🔴 High: 2, 🟡 Medium: 1 |
| **TOTAL** | **16** | **97** | |

## Sprint Planning

| Sprint | Focus | Stories | Points |
|--------|-------|---------|--------|
| Sprint 1 | Foundation | US-01, US-02, US-06, US-07, US-15, US-16 | 26 |
| Sprint 2 | Content & Auth | US-03, US-05, US-08, US-09 | 24 |
| Sprint 3 | Admin CRUD | US-10, US-13 | 18 |
| Sprint 4 | Enhancement | US-04, US-11, US-12, US-14 | 29 |

## Feature Priority Matrix

```
                    HIGH IMPACT
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │  US-07 Contact     │  US-01 Profile     │
    │  US-06 Services    │  US-02 Portfolio   │
    │                    │  US-03 Blog        │
    │                    │  US-09 Login       │
LOW EFFORT ─────────────┼─────────────── HIGH EFFORT
    │                    │                    │
    │  US-15 Navigation  │  US-10 Blog CRUD   │
    │  US-16 Dark Theme  │  US-12 Analytics   │
    │  US-05 Newsletter  │  US-14 Performance │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    LOW IMPACT
```

---

# 🏗️ ARSITEKTUR TEKNIS

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE (CDN & WAF)                        │
│  • DDoS Protection  • SSL/TLS  • Caching  • Rate Limiting       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX (Reverse Proxy)                       │
│  • Load Balancing  • SSL Termination  • Gzip  • Static Files   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS APPLICATION                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Frontend   │  │  API Routes  │  │     SSR      │          │
│  │  (React/TS)  │  │  (REST API)  │  │  (Pages)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   MDX Blog   │  │  Auth/JWT    │  │   Security   │          │
│  │   Content    │  │  Sessions    │  │   Middleware │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        ┌───────────────────┐   ┌───────────────────┐
        │   SQLite (Data)   │   │   File Storage    │
        │  • Comments       │   │  • Uploads        │
        │  • Subscribers    │   │  • Media          │
        │  • Contacts       │   │  • Blog Images    │
        │  • Analytics      │   │  • Project Images │
        │  • Sessions       │   └───────────────────┘
        │  • Blog Posts     │
        │  • Projects       │
        └───────────────────┘
```

## Tech Stack Detail

| Layer | Teknologi | Version | Justifikasi |
|-------|-----------|---------|-------------|
| **Runtime** | Node.js | 18.x LTS | Stability & long-term support |
| **Framework** | Next.js | 14.x | App Router, RSC, built-in optimization |
| **Language** | TypeScript | 5.x | Type safety, better DX |
| **Styling** | Tailwind CSS | 3.x | Utility-first, performance |
| **Animation** | Framer Motion | 10.x | React-native animation library |
| **Database** | SQLite | 3.x | Serverless, zero-config, performant |
| **DB Driver** | better-sqlite3 | 9.x | Synchronous API, faster than async |
| **Content** | MDX | 2.x | Markdown + JSX for rich content |
| **Auth** | JWT | - | Stateless authentication |
| **Email** | Nodemailer | 6.x | SMTP email sending |
| **Logging** | Winston | 3.x | Structured logging |
| **Process Mgr** | PM2 | 5.x | Production process management |
| **Web Server** | Nginx | 1.24.x | Reverse proxy, static serving |
| **Icons** | Lucide React | 0.x | Consistent icon library |

## Struktur Direktori

```
dreflabs/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public routes group
│   │   ├── blog/                  # /blog - Blog listing & detail
│   │   │   └── [slug]/            # Dynamic blog post route
│   │   ├── contact/               # /contact - Halaman kontak
│   │   ├── projects/              # /projects - Portfolio
│   │   │   └── [slug]/            # Dynamic project route
│   │   └── services/              # /services - Layanan
│   │
│   ├── admin/                     # Admin panel (protected)
│   │   ├── login/                 # Admin login page
│   │   ├── analytics/             # Analytics dashboard
│   │   ├── assessments/           # Web assessment submissions
│   │   ├── blog/                  # Blog management
│   │   │   └── new/               # Create new blog post
│   │   ├── projects/              # Project management
│   │   └── settings/              # Site settings
│   │
│   ├── api/                       # API Routes
│   │   ├── admin/                 # Admin APIs (protected)
│   │   ├── auth/                  # Authentication
│   │   ├── comments/              # Blog comments
│   │   ├── contact/               # Contact form
│   │   └── newsletter/            # Newsletter subscription
│   │
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   └── globals.css                # Global styles
│
├── components/                    # React Components
│   ├── admin/                     # Admin-specific components
│   ├── blog/                      # Blog components
│   ├── forms/                     # Form components
│   ├── home/                      # Homepage sections
│   ├── layout/                    # Layout components
│   └── ui/                        # UI primitives
│
├── content/                       # Content files
│   ├── blog/                      # MDX blog posts
│   └── data/                      # JSON data files
│
├── data/                          # Database
│   └── dreflabs.db                # SQLite database file
│
├── lib/                           # Utility libraries
│   ├── auth.ts                    # Authentication logic
│   ├── db.ts                      # Database connection
│   ├── email.ts                   # Email sending
│   └── security.ts                # Security utilities
│
├── public/                        # Static assets
│   ├── blog/                      # Blog images
│   ├── images/                    # General images
│   └── projects/                  # Project images
│
└── types/                         # TypeScript definitions
```

---

# 🗄️ DATABASE SCHEMA

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   admin_users   │     │    sessions     │     │   admin_logs    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ admin_id (FK)   │     │ id (PK)         │
│ username        │     │ id (PK)         │     │ admin_id (FK)   │
│ email           │     │ token           │     │ action          │
│ password_hash   │     │ expires_at      │     │ entity_type     │
│ role            │     │ created_at      │     │ entity_id       │
│ created_at      │     └─────────────────┘     │ ip_address      │
│ updated_at      │                             │ created_at      │
└─────────────────┘                             └─────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   blog_posts    │     │    comments     │     │   subscribers   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ post_id (FK)    │     │ id (PK)         │
│ slug (UNIQUE)   │     │ id (PK)         │     │ email (UNIQUE)  │
│ title           │     │ post_slug       │     │ subscribed_at   │
│ excerpt         │     │ author_name     │     │ active          │
│ content         │     │ author_email    │     │ unsubscribed_at │
│ cover_image     │     │ content         │     └─────────────────┘
│ category        │     │ approved        │
│ tags            │     │ created_at      │     ┌─────────────────┐
│ status          │     └─────────────────┘     │    contacts     │
│ published_at    │                             ├─────────────────┤
│ created_at      │                             │ id (PK)         │
│ updated_at      │                             │ name            │
└─────────────────┘                             │ email           │
                                                │ company         │
┌─────────────────┐     ┌─────────────────┐     │ service_interest│
│    projects     │     │   page_views    │     │ message         │
├─────────────────┤     ├─────────────────┤     │ read            │
│ id (PK)         │     │ id (PK)         │     │ created_at      │
│ slug (UNIQUE)   │     │ page_path       │     └─────────────────┘
│ title           │     │ referrer        │
│ description     │     │ user_agent      │     ┌─────────────────┐
│ category        │     │ viewed_at       │     │   assessments   │
│ technologies    │     └─────────────────┘     ├─────────────────┤
│ problem         │                             │ id (PK)         │
│ solution        │     ┌─────────────────┐     │ name            │
│ results         │     │    settings     │     │ email           │
│ featured        │     ├─────────────────┤     │ phone           │
│ status          │     │ id (PK)         │     │ company         │
│ created_at      │     │ key (UNIQUE)    │     │ project_type    │
│ updated_at      │     │ value           │     │ budget          │
└─────────────────┘     │ group           │     │ timeline        │
                        │ updated_at      │     │ description     │
                        └─────────────────┘     │ status          │
                                                │ created_at      │
                                                └─────────────────┘
```

## Table Definitions (SQL)

```sql
-- Admin users table
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK(role IN ('super_admin', 'admin', 'editor')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    tags TEXT, -- JSON array stored as text
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers
CREATE TABLE subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    active INTEGER DEFAULT 1,
    unsubscribed_at DATETIME
);

-- Contact form submissions
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service_interest TEXT,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Web assessment submissions
CREATE TABLE assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    project_type TEXT,
    budget TEXT,
    timeline TEXT,
    description TEXT,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Page views analytics
CREATE TABLE page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

# 🔌 API ENDPOINTS

## Public APIs

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|------------|
| GET | `/api/health` | Server health check | - |
| POST | `/api/contact` | Submit contact form | 3 req/10 min |
| POST | `/api/newsletter` | Subscribe newsletter | 5 req/1 min |
| GET | `/api/comments?postSlug={slug}` | Get approved comments | - |
| POST | `/api/comments` | Submit new comment | 5 req/30 min |
| POST | `/api/assessment` | Submit web assessment | 3 req/10 min |
| POST | `/api/analytics` | Track page views | 100 req/5 min |

## Authentication APIs

| Method | Endpoint | Purpose | Notes |
|--------|----------|---------|-------|
| GET | `/api/auth/csrf` | Get CSRF token | Sets httpOnly cookie |
| POST | `/api/auth/login` | Admin login | 3 attempts/30 min |
| POST | `/api/auth/logout` | Admin logout | Clears cookies |
| POST | `/api/auth/refresh` | Refresh access token | Uses refresh token |

## Admin APIs (Protected)

All admin APIs require:
- `Authorization: Bearer {accessToken}` header
- Valid CSRF token for mutations
- Appropriate role permissions

| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| `/api/admin/blog` | List posts | Create post | Update post | Delete post |
| `/api/admin/projects` | List projects | Create project | Update project | Delete project |
| `/api/admin/assessments` | List submissions | - | Update status | Delete |
| `/api/admin/comments` | List comments | - | Approve/Reject | Delete |
| `/api/admin/media` | List files | Upload file | - | Delete file |
| `/api/admin/settings` | Get settings | - | Update settings | - |

---

# 🔐 SECURITY IMPLEMENTATION

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Network Security                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Cloudflare DDoS Protection                              │  │
│  │ • Firewall (UFW) - Only ports 22, 80, 443                │  │
│  │ • Fail2ban for brute force protection                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Layer 2: Transport Security                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • TLS 1.3 (HTTPS enforced)                               │  │
│  │ • HSTS enabled                                            │  │
│  │ • SSL certificate (Let's Encrypt)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Layer 3: Application Security                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • CSRF token validation                                   │  │
│  │ • Rate limiting per IP                                    │  │
│  │ • Input sanitization (XSS prevention)                    │  │
│  │ • SQL injection prevention (parameterized queries)       │  │
│  │ • Security headers (CSP, X-Frame-Options, etc.)          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Layer 4: Authentication Security                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • JWT with short expiration (1 hour)                     │  │
│  │ • Refresh token rotation                                  │  │
│  │ • HttpOnly + Secure + SameSite cookies                   │  │
│  │ • Password hashing (bcrypt)                               │  │
│  │ • Login rate limiting (3 attempts/30 min)                │  │
│  │ • Account lockout after failed attempts                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Security Headers (Nginx)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Rate Limiting Configuration

| Endpoint | Limit | Window | Block Duration |
|----------|-------|--------|----------------|
| `/api/auth/login` | 3 requests | 30 min | 30 min |
| `/api/contact` | 3 requests | 10 min | 30 min |
| `/api/comments` | 5 requests | 30 min | 60 min |
| `/api/newsletter` | 5 requests | 1 min | 5 min |
| `/api/analytics` | 100 requests | 5 min | 15 min |
| `/api/assessment` | 3 requests | 10 min | 30 min |

---

# 🚀 DEPLOYMENT STRATEGY

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION VPS                            │
│                    Ubuntu 22.04 LTS Server                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      NGINX                               │   │
│  │  • Port 80 → redirect to 443                            │   │
│  │  • Port 443 → SSL termination                           │   │
│  │  • Reverse proxy → localhost:3000                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   PM2 Process Manager                    │   │
│  │  • Cluster mode (2 instances)                           │   │
│  │  • Auto-restart on crash                                │   │
│  │  • Log management                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Next.js Application (3000)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┴───────────────┐                  │
│              ▼                               ▼                   │
│  ┌───────────────────────┐     ┌───────────────────────┐       │
│  │   SQLite Database     │     │    File Storage       │       │
│  │   /data/dreflabs.db   │     │    /public/uploads    │       │
│  └───────────────────────┘     └───────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB SSD | 50 GB SSD |
| Bandwidth | 1 TB/month | 2 TB/month |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

## Environment Variables

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://dreflabs.com

# Database
DATABASE_PATH=./data/dreflabs.db

# Authentication
JWT_SECRET=<random-256-bit-key>
JWT_REFRESH_SECRET=<random-256-bit-key>

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@dreflabs.com

# Security
CSRF_SECRET=<random-secret>
RATE_LIMIT_ENABLED=true
```

## Deployment Checklist

- [ ] **Pre-deployment**
  - [ ] All tests passing
  - [ ] Environment variables configured
  - [ ] Database migrated
  - [ ] SSL certificate installed
  - [ ] DNS configured

- [ ] **Deployment**
  - [ ] Pull latest code
  - [ ] Install dependencies
  - [ ] Build application
  - [ ] Restart PM2 process
  - [ ] Verify health endpoint

- [ ] **Post-deployment**
  - [ ] Verify all pages loading
  - [ ] Test contact form
  - [ ] Test admin login
  - [ ] Check error logs

---

# 📊 PERFORMANCE & MONITORING

## Performance Benchmarks

| Metric | Target | Tool |
|--------|--------|------|
| **Lighthouse Performance** | > 90 | Chrome DevTools |
| **Lighthouse Accessibility** | > 95 | Chrome DevTools |
| **Lighthouse Best Practices** | > 95 | Chrome DevTools |
| **Lighthouse SEO** | > 95 | Chrome DevTools |
| **First Contentful Paint (FCP)** | < 1.5s | Web Vitals |
| **Largest Contentful Paint (LCP)** | < 2.5s | Web Vitals |
| **First Input Delay (FID)** | < 100ms | Web Vitals |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Web Vitals |
| **Time to First Byte (TTFB)** | < 600ms | Web Vitals |
| **Uptime** | > 99.9% | UptimeRobot |

## Monitoring Stack

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **PM2** | Process monitoring | Built-in with alerts |
| **Winston** | Application logging | File + Console |
| **UptimeRobot** | Uptime monitoring | 5-min checks |
| **Google Analytics** | Traffic analytics | GA4 integration |

## Log Locations

```bash
/var/log/nginx/access.log          # Nginx access logs
/var/log/nginx/error.log           # Nginx error logs
/var/www/dreflabs/logs/*.log       # Application logs
~/.pm2/logs/dreflabs-*.log         # PM2 process logs
```

---

# 📅 ROADMAP

## Phase 1: Foundation ✅ (Completed)

| Feature | Status | Notes |
|---------|--------|-------|
| Core website structure | ✅ Done | All pages implemented |
| Blog system with MDX | ✅ Done | Full CRUD via admin |
| Admin panel | ✅ Done | Complete dashboard |
| Contact form | ✅ Done | Email notifications |
| Newsletter subscription | ✅ Done | Database storage |
| Comment system | ✅ Done | Moderation enabled |
| SEO optimization | ✅ Done | Structured data, sitemap |
| Production deployment | ✅ Done | VPS with PM2 |
| Security implementation | ✅ Done | CSRF, rate limiting, auth |

## Phase 2: Enhancement (Q1 2026)

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Multi-language (ID/EN) | High | 2 weeks | 🔲 Planned |
| Dark/Light theme toggle | Medium | 1 week | 🔲 Planned |
| Advanced analytics dashboard | High | 2 weeks | 🔲 Planned |
| Comment email notifications | Medium | 3 days | 🔲 Planned |
| Social sharing optimization | Medium | 1 week | 🔲 Planned |
| RSS feed | Low | 2 days | 🔲 Planned |

## Phase 3: Growth (Q2-Q3 2026)

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Client portal | High | 4 weeks | 🔲 Planned |
| Project inquiry system | High | 2 weeks | 🔲 Planned |
| Testimonial management | Medium | 1 week | 🔲 Planned |
| Case study generator | Medium | 2 weeks | 🔲 Planned |
| Email marketing integration | Medium | 1 week | 🔲 Planned |
| CRM integration | Low | 2 weeks | 🔲 Planned |

## Phase 4: Expansion (Q4 2026+)

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Online course platform | High | 8 weeks | 🔲 Planned |
| Webinar/event management | Medium | 3 weeks | 🔲 Planned |
| API documentation portal | Medium | 2 weeks | 🔲 Planned |
| Community forum | Low | 4 weeks | 🔲 Planned |

---

# 📈 SUCCESS METRICS & KPIs

## Website Performance KPIs

| Metric | Current | Target (6 mo) | Target (12 mo) |
|--------|---------|---------------|----------------|
| Monthly Visitors | - | 1,000 | 5,000 |
| Page Views/Month | - | 3,000 | 15,000 |
| Bounce Rate | - | < 60% | < 50% |
| Avg. Session Duration | - | > 2 min | > 3 min |
| Pages per Session | - | > 2 | > 3 |

## Business KPIs

| Metric | Current | Target (6 mo) | Target (12 mo) |
|--------|---------|---------------|----------------|
| Contact Form Submissions | - | 10/month | 30/month |
| Qualified Leads | - | 5/month | 15/month |
| Newsletter Subscribers | - | 200 | 1,000 |
| Blog Posts Published | - | 24 | 48 |
| Project Inquiries | - | 3/month | 10/month |

## SEO KPIs

| Metric | Current | Target (6 mo) | Target (12 mo) |
|--------|---------|---------------|----------------|
| Domain Authority | - | 20 | 35 |
| Organic Traffic | - | 30% | 50% |
| Keywords Ranking (Page 1) | - | 10 | 50 |
| Backlinks | - | 20 | 100 |

---

# 📝 MAINTENANCE & SUPPORT

## Regular Maintenance Tasks

| Task | Frequency | Owner |
|------|-----------|-------|
| Security updates | Weekly | DevOps |
| Database backup | Daily | Automated |
| Log rotation | Daily | Automated |
| Performance monitoring | Daily | Automated |
| Content updates | Weekly | Admin |
| Dependency updates | Monthly | Developer |
| Security audit | Quarterly | Security |
| SSL renewal | Annually | DevOps |

## Backup Strategy

```
Daily Backups:
├── Database (SQLite) → Cloud Storage
├── Uploaded Media → Cloud Storage
└── Retention: 30 days

Weekly Backups:
├── Full application backup
├── Configuration files
└── Retention: 12 weeks

Monthly Backups:
├── Complete server snapshot
└── Retention: 12 months
```

## Disaster Recovery

| Scenario | RTO | RPO | Recovery Plan |
|----------|-----|-----|---------------|
| Database corruption | 1 hour | 24 hours | Restore from daily backup |
| Server failure | 4 hours | 24 hours | Deploy to new VPS from backup |
| Security breach | 2 hours | 1 hour | Isolate, restore clean backup |
| DDoS attack | 30 min | 0 | Cloudflare mitigation |

---

# ✅ DEFINITION OF DONE

Setiap user story dianggap selesai ketika:

1. ✅ Acceptance criteria terpenuhi semua
2. ✅ Code review passed
3. ✅ Unit tests written (jika applicable)
4. ✅ Responsive di semua breakpoints
5. ✅ Lighthouse score > 90
6. ✅ No console errors
7. ✅ Deployed ke staging
8. ✅ User acceptance testing passed

---

# 📚 GLOSSARY

| Term | Definition |
|------|------------|
| **CTA** | Call to Action - button atau link yang mengajak pengunjung melakukan aksi |
| **CSRF** | Cross-Site Request Forgery - serangan keamanan yang dicegah dengan token |
| **Epic** | Kumpulan user stories yang terkait dengan tema yang sama |
| **JWT** | JSON Web Token - standar token untuk autentikasi |
| **LCP** | Largest Contentful Paint - metrik loading performa website |
| **MDX** | Markdown dengan komponen JSX untuk konten blog |
| **MVP** | Minimum Viable Product - versi awal dengan fitur inti |
| **SEO** | Search Engine Optimization - optimasi untuk mesin pencari |
| **SSR** | Server-Side Rendering - rendering di server untuk SEO |
| **Story Points** | Estimasi kompleksitas user story (fibonacci: 1,2,3,5,8,13) |
| **WCAG** | Web Content Accessibility Guidelines - standar aksesibilitas |

---

# 📎 APPENDIX

## A. Content Guidelines

### Blog Writing Standards
- Minimum 800 kata per artikel
- Gunakan heading hierarchy (H1, H2, H3)
- Sertakan code examples dengan syntax highlighting
- Cover image dengan rasio 16:9
- Meta description 150-160 karakter

### Image Standards
- Format: WebP (dengan fallback JPG)
- Max size: 500KB
- Dimensions: 1200px max width
- Alt text wajib untuk accessibility

## B. SEO Checklist

- [ ] Title tag unik setiap halaman
- [ ] Meta description setiap halaman
- [ ] Heading hierarchy benar
- [ ] Image alt text lengkap
- [ ] Internal linking
- [ ] XML sitemap
- [ ] robots.txt configured
- [ ] Schema.org structured data
- [ ] Open Graph tags
- [ ] Canonical URLs

## C. Admin Roles & Permissions

| Role | Permissions |
|------|-------------|
| `super_admin` | Full access to all features |
| `admin` | All except user management |
| `editor` | Blog & project management only |

---

*Document Version: 4.0*
*Last Updated: November 2025*
*Next Review: February 2026*
*Status: Living Document - akan diupdate sesuai perkembangan proyek*