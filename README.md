# PELET Backend API (CC26-PSU060)

Backend RESTful API untuk platform pencarian kerja dengan fitur AI Job Matching dan Mock Interview berbasis CV.

---

## Deskripsi Singkat Proyek

PELET Backend adalah REST API yang dibangun dengan **Node.js**, **Express.js**, dan **PostgreSQL**. API ini mendukung autentikasi JWT, manajemen lowongan kerja, upload resume dengan ekstraksi CV otomatis, serta fitur rekomendasi pekerjaan dan mock interview berbasis kecerdasan buatan (AI).

Arsitektur proyek menggunakan **Service & Repository Pattern** untuk memisahkan logika bisnis dari akses database, sehingga kode lebih terstruktur dan mudah dikembangkan.

### Fitur Utama

- JWT Authentication & Refresh Token
- Role-based Access (`user` & `hrd`)
- CRUD Lowongan Kerja dengan filter & pagination
- Profile Management (Applicant & HRD)
- Resume Upload (PDF/DOC/DOCX) dengan ekstraksi teks otomatis via `pdf-parse`
- **AI Job Matching** — rekomendasi pekerjaan berdasarkan isi CV
- **AI Mock Interview** — simulasi wawancara kerja berdasarkan CV dan lowongan
- Database Migration dengan `node-pg-migrate`
- Validasi request dengan Joi

---

## Struktur Project

```text
backend-main/
├── migrations/                  # File migrasi database
├── src/
│   ├── database/
│   │   └── index.js             # Koneksi PostgreSQL
│   ├── exceptions/              # Custom error classes
│   ├── middlewares/             # Auth, error handler, validasi
│   ├── routes/
│   │   └── index.js             # Router utama
│   ├── security/
│   │   └── token-manager.js     # JWT utilities
│   ├── services/
│   │   ├── ai/                  # AI job matching & mock interview
│   │   ├── applications/        # Lamaran pekerjaan
│   │   ├── authentications/     # Login, logout, refresh token
│   │   ├── jobs/                # CRUD lowongan kerja
│   │   ├── profiles/            # Profile user & HRD
│   │   ├── resumes/             # Upload & manajemen resume
│   │   └── users/               # Registrasi & data user
│   ├── utils/
│   │   ├── extractCv.js         # Ekstraksi teks dari file CV
│   │   └── extractSkillSection.js
│   └── server.js                # Entry point aplikasi
├── .env.example                 # Contoh konfigurasi environment
├── .gitignore
├── eslint.config.mjs
└── package.json
```

---

## Petunjuk Setup Environment

### Prasyarat

Pastikan perangkat Anda telah menginstal:

- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru
- **PostgreSQL** v14 atau lebih baru

### Langkah-langkah Setup

**1. Clone Repository**

```bash
git clone <url-repository>
cd backend-main
```

**2. Install Dependencies**

```bash
npm install
```

**3. Buat File `.env`**

Salin file contoh dan isi sesuai konfigurasi lokal Anda:

```bash
cp .env.example .env
```

Kemudian edit file `.env`:

```ini
HOST=localhost
PORT=3000

# Konfigurasi PostgreSQL (lokal)
PGUSER=dev
PGHOST=localhost
PGPASSWORD=password
PGDATABASE=postgres
PGPORT=5432

# Jika deploy menggunakan Railway, gunakan:
# DATABASE_URL=isikan_database_url_dari_railway

# JWT Secret Keys (isi dengan string acak yang panjang)
ACCESS_TOKEN_KEY=your_access_token_secret_here
REFRESH_TOKEN_KEY=your_refresh_token_secret_here
```

**4. Buat Database PostgreSQL**

```bash
psql -U postgres -c "CREATE DATABASE pelet;"
```

**5. Jalankan Migrasi Database**

```bash
npm run migrate up
```

Perintah ini akan membuat tabel-tabel berikut secara otomatis:
`users`, `profiles`, `authentications`, `categories`, `jobs`, `documents`, `applications`, `recommendations_jobs`

**6. Jalankan Server**

Mode development (dengan auto-reload):

```bash
npm run dev
```

Mode production:

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`.

---

## Model AI

Fitur AI pada proyek ini menggunakan model yang di-deploy di **Hugging Face Spaces** dan diakses melalui HTTP API. Tidak diperlukan download model secara lokal.

**Endpoint AI yang digunakan:**

| Fitur          | Endpoint                                                         |
| -------------- | ---------------------------------------------------------------- |
| Job Matching   | `https://egoekosetio-ai-capstone.hf.space/api/v1/match-multi`    |
| Mock Interview | `https://egoekosetio-ai-capstone.hf.space/api/v1/mock-interview` |

> Pastikan server memiliki akses internet agar fitur AI dapat berfungsi.

---

## Cara Menjalankan Aplikasi

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Linting

```bash
npm run lint
```

### Migrasi Database

```bash
# Jalankan semua migrasi
npm run migrate up

# Rollback migrasi terakhir
npm run migrate down

# Buat file migrasi baru
npm run migrate create nama-migrasi
```

---

## Endpoint API

**Base URL:** `http://localhost:3000`

### Authentication

| Method   | Endpoint           | Deskripsi                                 |
| -------- | ------------------ | ----------------------------------------- |
| `POST`   | `/authentications` | Login, mendapatkan access & refresh token |
| `PUT`    | `/authentications` | Refresh access token                      |
| `DELETE` | `/authentications` | Logout                                    |

### Users

| Method | Endpoint    | Deskripsi                      |
| ------ | ----------- | ------------------------------ |
| `POST` | `/users`    | Registrasi user baru           |
| `GET`  | `/users/me` | Mendapatkan data user saat ini |

### Profiles

| Method | Endpoint       | Deskripsi                     |
| ------ | -------------- | ----------------------------- |
| `GET`  | `/profiles/me` | Mendapatkan profil sendiri    |
| `PUT`  | `/profiles/me` | Update profil (applicant/HRD) |

### Jobs

| Method   | Endpoint     | Deskripsi                                           |
| -------- | ------------ | --------------------------------------------------- |
| `GET`    | `/jobs`      | Daftar semua lowongan (support filter & pagination) |
| `GET`    | `/jobs/:id`  | Detail lowongan                                     |
| `GET`    | `/jobs/mine` | Lowongan milik HRD yang login                       |
| `POST`   | `/jobs`      | Buat lowongan baru (HRD)                            |
| `PUT`    | `/jobs/:id`  | Update lowongan (HRD)                               |
| `DELETE` | `/jobs/:id`  | Hapus lowongan (HRD)                                |

### Resumes

| Method   | Endpoint        | Deskripsi                               |
| -------- | --------------- | --------------------------------------- |
| `POST`   | `/resumes`      | Upload resume (PDF/DOC/DOCX, maks. 5MB) |
| `GET`    | `/resumes/mine` | Daftar resume milik user                |
| `GET`    | `/resumes/:id`  | Detail resume                           |
| `DELETE` | `/resumes/:id`  | Hapus resume                            |

### Applications

| Method | Endpoint             | Deskripsi                 |
| ------ | -------------------- | ------------------------- |
| `POST` | `/applications`      | Melamar pekerjaan         |
| `GET`  | `/applications/mine` | Daftar lamaran milik user |
| `GET`  | `/applications/:id`  | Detail lamaran            |

### AI Features

| Method | Endpoint                       | Deskripsi                                  |
| ------ | ------------------------------ | ------------------------------------------ |
| `GET`  | `/recommendations/jobs`        | Rekomendasi pekerjaan berdasarkan CV       |
| `GET`  | `/recommendations`             | Daftar rekomendasi yang tersimpan          |
| `GET`  | `/recommendations/:documentId` | Rekomendasi berdasarkan dokumen tertentu   |
| `GET`  | `/jobs/:id/interview`          | Simulasi wawancara untuk lowongan tertentu |

Semua endpoint (kecuali registrasi dan login) memerlukan header:

```
Authorization: Bearer <access_token>
```

---

## Dependensi

### Production

| Package           | Versi   | Fungsi                     |
| ----------------- | ------- | -------------------------- |
| `express`         | ^5.2.1  | Web framework              |
| `pg`              | ^8.20.0 | PostgreSQL client          |
| `node-pg-migrate` | ^8.0.4  | Database migration         |
| `jsonwebtoken`    | ^9.0.3  | JWT authentication         |
| `bcrypt`          | ^6.0.0  | Password hashing           |
| `joi`             | ^18.2.1 | Request validation         |
| `multer`          | ^2.1.1  | File upload                |
| `pdf-parse`       | ^1.1.4  | Ekstraksi teks PDF         |
| `axios`           | ^1.16.1 | HTTP client (untuk AI API) |
| `dotenv`          | ^17.4.2 | Environment variables      |
| `cors`            | ^2.8.6  | CORS middleware            |
| `nanoid`          | ^5.1.11 | ID generator               |

### Development

| Package   | Versi   | Fungsi                         |
| --------- | ------- | ------------------------------ |
| `nodemon` | ^3.1.14 | Auto-reload development server |
| `eslint`  | ^10.3.0 | Linting                        |

---

## Konfigurasi Pendukung

- **`.gitignore`** — mengecualikan `node_modules/`, `.env`, folder `uploads/`, dan file build
- **`eslint.config.mjs`** — konfigurasi ESLint menggunakan `eslint-config-dicodingacademy`

---

## Troubleshooting

| Error                                                | Solusi                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------- |
| `Cannot read properties of undefined (reading 'id')` | Pastikan endpoint sudah menggunakan middleware `authenticateToken`   |
| `MulterError: Unexpected field`                      | Pastikan key form-data menggunakan nama `resume`                     |
| `pdf-parse ENOENT`                                   | Jalankan `npm install pdf-parse@1.1.1`                               |
| `PostgreSQL connection error`                        | Pastikan service PostgreSQL aktif dan konfigurasi `.env` sudah benar |
| AI endpoint tidak merespons                          | Periksa koneksi internet; model di-host di Hugging Face Spaces       |
