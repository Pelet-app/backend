# SkillBridge API (CC26-PSU060)

Dokumen ini menjelaskan cara menjalankan backend RESTful API untuk OpenJob Platform.

Project ini mendukung _authentication_ JWT, _management_ lowongan kerja, _profile management_, dan _upload_ resume dengan ekstraksi CV otomatis.

> **Catatan:** Repo ini menggunakan PostgreSQL, Express.js, dan `node-pg-migrate` dengan arsitektur berbasis _service & repository pattern_.

---

## Daftar Isi

1. [Fitur Utama](#fitur Utama)
2. [Struktur Project](#struktur-project)
3. [Endpoint API](#endpoint-api)
4. [Authentication](#authentication)
5. [Database Migration](#database-migration)
6. [Menjalankan Server Lokal](#menjalankan-server-lokal)
7. [Environment Variables](#environment-variables)
8. [Upload Resume](#upload-resume)
9. [Contoh Request (cURL)](#contoh-request-curl)
10. [Troubleshooting](#troubleshooting)
11. [Lisensi & Keamanan Data](#lisensi--keamanan-data)
12. [Future Improvements](#future-improvements)

---

## Fitur Utama

- **JWT Authentication & Refresh Token**
- **Role-based Access** (`user` & `hrd`)
- **CRUD Lowongan Kerja**
- **Profile Management**
- **Resume Upload** (PDF/DOC/DOCX)
- **Extract CV Text** menggunakan `pdf-parse`
- **PostgreSQL Database**
- **Migration** dengan `node-pg-migrate`
- **Joi Validation**
- **Repository Pattern Architecture**

---

## Struktur Project

```text
src/
├── database/
│   ├── migrations/
│   └── index.js
│
├── exceptions/
├── middlewares/
├── utils/
│
├── services/
│   ├── authentications/
│   ├── jobs/
│   ├── profiles/
│   ├── resumes/
│   └── users/
│
├── app.js
└── server.js
```

`````

---

## Endpoint API

**Base URL Default:** `http://localhost:5000`

### 1) Users

- **Register User**
- **Endpoint:** `POST /users`
- **Request Body:**

````json
        {
          "name": "John Doe",
          "email": "john@example.com",
          "password": "password123",
          "role": "user"
        }
        ```
*   **Response:**
```json
        {
          "status": "success",
          "message": "User berhasil ditambahkan",
          "data": {
            "userId": "user-xxxx"
          }
        }
        ```
*   **Get Current User**
    *   **Endpoint:** `GET /users/me`
    *   **Headers:** `Authorization: Bearer access_token`

### 2) Authentications
*   **Login**
    *   **Endpoint:** `POST /authentications`
    *   **Request Body:**
```json
        {
          "email": "john@example.com",
          "password": "password123"
        }
        ```
*   **Refresh Access Token**
    *   **Endpoint:** `PUT /authentications`
    *   **Request Body:**
```json
        {
          "refreshToken": "your_refresh_token"
        }
        ```
*   **Logout**
    *   **Endpoint:** `DELETE /authentications`
    *   **Headers:** `Authorization: Bearer access_token`
    *   **Request Body:**
```json
        {
          "refreshToken": "your_refresh_token"
        }
        ```

### 3) Profiles
*   **Get My Profile**
    *   **Endpoint:** `GET /profiles/me`
*   **Update My Profile**
    *   **Endpoint:** `PUT /profiles/me`
    *   **Request Body (User):**
```json
        {
          "fullName": "John Doe",
          "phoneNumber": "08123456789",
          "address": "Indonesia",
          "applicantData": {
            "bio": "Frontend Developer",
            "education": "Bachelor Degree"
          }
        }
        ```
    *   **Request Body (HRD):**
```json
        {
          "fullName": "Jane HR",
          "hrdData": {
            "companyName": "OpenJob",
            "position": "HR Manager"
          }
        }
        ```

### 4) Jobs
*   **Get All Jobs**
    *   **Endpoint:** `GET /jobs`
    *   **Query Params:** `search=`, `category=`, `jobType=`, `locationType=`, `status=`, `page=`, `limit=`
*   **Get Job Detail**
    *   **Endpoint:** `GET /jobs/:id`
*   **Get My Jobs (HRD)**
    *   **Endpoint:** `GET /jobs/mine`
*   **Create Job**
    *   **Endpoint:** `POST /jobs`
    *   **Request Body:**
```json
        {
          "categoryId": "cat-tech01",
          "title": "Frontend Developer",
          "description": "React Developer Needed",
          "jobType": "full-time",
          "experienceLevel": "entry",
          "locationType": "remote"
        }
        ```
*   **Update Job**
    *   **Endpoint:** `PUT /jobs/:id`
*   **Delete Job**
    *   **Endpoint:** `DELETE /jobs/:id`

### 5) Resumes
*   **Upload Resume**
    *   **Endpoint:** `POST /resumes`
    *   **Headers:** `Authorization: Bearer access_token`
    *   **Form-data:**
        *   `resume` (File)
    *   **Supported Formats:** PDF, DOC, DOCX
    *   **Maximum Size:** 5 MB
*   **Get My Resumes**
    *   **Endpoint:** `GET /resumes/mine`
*   **Get All Resumes**
    *   **Endpoint:** `GET /resumes`
*   **Get Resume Detail**
    *   **Endpoint:** `GET /resumes/:id`
*   **Delete Resume**
    *   **Endpoint:** `DELETE /resumes/:id`

---

## Authentication
API menggunakan JWT Bearer Token. Masukkan token pada header request seperti berikut:
```text
Authorization: Bearer your_access_token

`````

---

## Database Migration

Project ini menggunakan `node-pg-migrate` untuk mengelola skema database.

- **Menjalankan Migration:**

````bash
    npm run migrate up
    ```
*   **Rollback Migration:**
```bash
    npm run migrate down
    ```
*   **Membuat Migration Baru:**
```bash
    npm run migrate create migration-name
    ```

### Database Tables
Berikut adalah daftar tabel yang digunakan:
*   `users`
*   `profiles`
*   `authentications`
*   `categories`
*   `jobs`
*   `documents`
*   `applications`


---

## Menjalankan Server Lokal

1.  **Install Dependencies**
```bash
    npm install
    ```
2.  **Jalankan Server Development**
```bash
    npm run dev
    ```
3.  **Jalankan Production**
```bash
    npm start
    ```

---

## Environment Variables
Buat file bernama `.env` di root project dan sesuaikan nilainya:

```ini
PORT=5000

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=openjob
PGUSER=postgres
PGPASSWORD=yourpassword

# JWT
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
ACCESS_TOKEN_AGE=1800

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

````

---

## Upload Resume

Resume diunggah menggunakan library `multer` dan teksnya akan diekstrak menggunakan `pdf-parse`.

- File yang diunggah akan disimpan di folder lokal: `/uploads`
- Ekstraksi teks CV ini digunakan untuk keperluan mendatang seperti:
- Analisis skill pendaftar
- Pencocokan pekerjaan (_job matching_)
- Fitur rekomendasi AI (_future feature_)

---

## Contoh Request (cURL)

- **Register**

````bash
    curl -X POST http://localhost:5000/users \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"John\",\"email\":\"john@mail.com\",\"password\":\"12345678\",\"role\":\"user\"}"
    ```

*   **Login**
```bash
    curl -X POST http://localhost:5000/authentications \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"john@mail.com\",\"password\":\"12345678\"}"
    ```

*   **Upload Resume**
```bash
    curl -X POST http://localhost:5000/resumes \
    -H "Authorization: Bearer TOKEN" \
    -F "resume=@cv.pdf"
    ```

---

## Troubleshooting

1.  **Error: `Cannot read properties of undefined (reading 'id')`**
    *   **Solusi:** Pastikan endpoint tersebut sudah dipasang middleware `authenticateToken`.
2.  **Error: `MulterError: Unexpected field`**
    *   **Solusi:** Pastikan key pada form-data diisi dengan nama `resume` sesuai dengan konfigurasi `upload.single('resume')`.
3.  **Error: `pdf-parse ENOENT`**
    *   **Solusi:** Gunakan versi stabil dengan menjalankan:
```bash
        npm install pdf-parse@1.1.1
        ```
4.  **Error: PostgreSQL connection error**
    *   **Solusi:** Pastikan service PostgreSQL sudah aktif, konfigurasi di `.env` sudah benar, dan database target sudah dibuat.

---

--

### Disclaimer
Dokumen ini adalah panduan teknis menjalankan backend OpenJob API menggunakan Express.js dan PostgreSQL.

````
