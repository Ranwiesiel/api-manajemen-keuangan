# API Manajemen Keuangan

API RESTful untuk mengelola keuangan pribadi. API ini memungkinkan pengguna untuk mengurus pendapatan dan pengeluaran, mengategorikan transaksi, dan mengelola data keuangan mereka dengan aman.

## Path APP Structure

```
package.json             - File konfigurasi npm dan dependensi proyek
README.md                - Doc APP penjelasan API dan keamanan
server.js                - Main file untuk running server Express
src/                     - Main folder source code
  ├── config/            - Konfigurasi APP
  │   └── db.config.js   - Konfigurasi koneksi database MongoDB
  │
  ├── controllers/       - Logic APP
  │   ├── transaction.controller.js  - Controller transaksi keuangan
  │   └── user.controller.js         - Controller manajemen pengguna
  │
  ├── middlewares/       - Middleware untuk APP
  │   ├── auth.middleware.js         - Middleware autentikasi JWT
  │   └── cors.middleware.js         - Middleware pengaturan CORS
  │
  ├── models/            - Model data APP
  │   ├── transaction.model.js       - Model transaksi keuangan
  │   └── user.model.js              - Model pengguna
  │
  ├── routes/            - Routes API
  │   ├── index.router.js            - Route utama APP
  │   ├── transaction.router.js      - Route endpoint transaksi
  │   └── user.router.js             - Route endpoint pengguna
  │
  └── utils/             - Fungsi Utility
      └── jwt.utils.js               - Utility manajemen token JWT
```

## Sumber Referensi

* [Menyiapkan server Node.js dasar dengan Express.js & Mongoose](https://medium.com/@akhilanand.ak01/setup-a-basic-node-js-server-using-expressjs-mongoose-65f2a6dbfd58)
* [Memulai dengan MongoDB dan Mongoose](https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/)
* [Menyiapkan MongoDB dengan Mongoose dan Express](https://dev.to/franciscomendes10866/setup-mongodb-with-mongoose-and-express-4c58)

## Dokumentasi Endpoint API

### URL Dasar

```
http://localhost:3000/api
```

### Endpoint Pengguna

| Metode | Endpoint             | Deskripsi                              | Autentikasi Diperlukan |
|--------|----------------------|----------------------------------------|------------------------|
| POST   | /users/register      | Mendaftarkan pengguna baru             | Tidak                  |
| POST   | /users/login         | Autentikasi dan mendapatkan token      | Tidak                  |
| GET    | /users               | Mendapatkan semua pengguna (admin)     | Ya                     |
| GET    | /users/:id           | Mendapatkan pengguna berdasarkan ID    | Ya                     |
| PUT    | /users/:id           | Memperbarui informasi pengguna         | Ya                     |
| DELETE | /users/:id           | Menghapus pengguna                     | Ya                     |

### Endpoint Transaksi

| Metode | Endpoint              | Deskripsi                                       | Autentikasi Diperlukan |
|--------|----------------------|-------------------------------------------------|------------------------|
| POST   | /transactions        | Membuat transaksi baru                          | Ya                     |
| GET    | /transactions        | Mendapatkan semua transaksi pengguna yang login | Ya                     |
| GET    | /transactions/:id    | Mendapatkan transaksi tertentu                  | Ya                     |
| PUT    | /transactions/:id    | Memperbarui transaksi                           | Ya                     |
| DELETE | /transactions/:id    | Menghapus transaksi                             | Ya                     |

## Contoh Request & Response

### Register User

**Request:**
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2023-05-07T10:23:45.678Z",
    "updatedAt": "2023-05-07T10:23:45.678Z"
  }
}
```

### Login User

**Request:**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Create Transaksi

**Request:**
```http
POST /api/transactions
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "type": "income",
  "amount": 5000,
  "category": "Gaji",
  "date": "2023-05-01T00:00:00.000Z",
  "description": "Gaji bulanan",
  "paymentMethod": "Transfer Bank"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21c1267d0d8992e610c86",
    "userId": "60d21b4667d0d8992e610c85",
    "type": "income",
    "amount": 5000,
    "category": "Gaji",
    "date": "2023-05-01T00:00:00.000Z",
    "description": "Gaji bulanan",
    "paymentMethod": "Transfer Bank",
    "createdAt": "2023-05-07T10:25:12.345Z",
    "updatedAt": "2023-05-07T10:25:12.345Z"
  }
}
```

### Get All Transaksi by user token

**Request:**
```http
GET /api/transactions?type=expense&startDate=2023-05-01&endDate=2023-05-31
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21c5367d0d8992e610c87",
      "userId": "60d21b4667d0d8992e610c85",
      "type": "expense",
      "amount": 100,
      "category": "Belanja",
      "date": "2023-05-10T00:00:00.000Z",
      "description": "Belanja mingguan",
      "paymentMethod": "Tunai",
      "createdAt": "2023-05-07T10:26:27.123Z",
      "updatedAt": "2023-05-07T10:26:27.123Z"
    },
    {
      "_id": "60d21c7867d0d8992e610c88",
      "userId": "60d21b4667d0d8992e610c85",
      "type": "expense",
      "amount": 50,
      "category": "Transportasi",
      "date": "2023-05-15T00:00:00.000Z",
      "description": "Ongkos bus",
      "paymentMethod": "Tunai",
      "createdAt": "2023-05-07T10:27:04.456Z",
      "updatedAt": "2023-05-07T10:27:04.456Z"
    }
  ]
}
```

## Security

### 1. Autentikasi JWT

API ini mengimplementasikan autentikasi berbasis JSON Web Token (JWT) dengan mekanisme berikut:

- **Pembuatan Token**: Ketika pengguna berhasil login, token JWT dibuat menggunakan fungsi `jsonwebtoken`.
- **Penyimpanan Token**: Token yang dibuat disimpan dalam cache memori menggunakan struktur data Map untuk validasi.
- **Verifikasi Token**: Middleware `authenticate` memverifikasi token untuk protected endpoint :
  - Mengekstrak token dari header Authorization
  - Memverifikasi signature token menggunakan secret key
  - Memeriksa apakah token masih valid dalam cache token

### 2. Keamanan Password

password pengguna dikelola dengan aman dalam sistem:

- **Hashing**: Kata sandi di-hash menggunakan bcrypt sebelum disimpan di database
- **Salting**: Setiap kata sandi secara otomatis di-salt (dengan putaran salt 10)
- **Tanpa Penyimpanan Teks Biasa**: Kata sandi tidak disimpan dalam kode atau dikembalikan dalam respons API

### 3. Access Control

Aplikasi menerapkan kontrol akses:

- **Protected Routes**: Sebagian besar endpoint memerlukan autentikasi melalui middleware `authenticate`
- **Akses Terbatas**: Pengguna hanya dapat mengakses atau memodifikasi transaksi mereka sendiri
- **Pemfilteran Data**: Transaksi secara otomatis difilter berdasarkan ID pengguna yang diautentikasi

### 4. Perlindungan CORS

Cross-Origin Resource Sharing (CORS) dikonfigurasi berikut:

- **Validasi Origin**: Hanya origin atau ip tertentu yang dapat mengakses API
- **Metode yang Diizinkan**: Hanya metode HTTP tertentu (GET, POST, PUT, DELETE) yang diizinkan
- **Dukungan Kredensial**: Mendukung kredensial untuk permintaan yang diautentikasi

### 5. Header Keamanan

Header keamanan HTTP dikelola secara otomatis oleh middleware Express.js untuk perlindungan lebih baik terhadap kerentanan web umum.