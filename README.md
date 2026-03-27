# petstore-react

React CRUD application using Petstore API (migrated from petstore-angular)

---

# React vs Angular - Overview

## Apa itu React?

React adalah library JavaScript untuk membangun user interface (UI), khususnya berbasis component. React dikembangkan oleh Meta dan berfokus pada fleksibilitas, performa, serta kemudahan integrasi dengan berbagai library lain.

---

## Kesamaan React dan Angular

Meskipun berbeda pendekatan, Angular dan React memiliki banyak konsep yang sebenarnya mirip:

### 1. Component-Based Architecture

- Angular → `@Component`
- React → Functional / Class Component

Keduanya membangun UI dari komponen reusable.

---

### 2. Data Binding

- Angular → Two-way binding (`[(ngModel)]`)
- React → One-way binding + state (`useState`)

Sama-sama menghubungkan data ke UI, hanya mekanismenya berbeda.

---

### 3. Handling Event

- Angular → `(click)="onClick()"`
- React → `onClick={handleClick}`

Sama-sama declarative event handling.

---

### 4. Routing

- Angular → Angular Router
- React → React Router

Sama-sama mendukung SPA (Single Page Application).

---

### 5. Forms Handling

- Angular → Template-driven & Reactive Forms
- React → Controlled & Uncontrolled Components (React Hook Form, Formik, dll)

Sama-sama mendukung validasi dan manajemen form.

---

### 6. HTTP Request

- Angular → HttpClient + RxJS
- React → fetch / axios / react-query

Sama-sama untuk komunikasi API.

---

## Perbedaan React dan Angular

| Aspek                | Angular            | React                                  |
| -------------------- | ------------------ | -------------------------------------- |
| Tipe                 | Framework          | Library                                |
| Bahasa utama         | TypeScript (wajib) | JavaScript / TypeScript                |
| Data Binding         | Two-way            | One-way                                |
| State Management     | Built-in + RxJS    | External (Redux, Zustand, React Query) |
| Struktur             | Opinionated        | Flexible                               |
| Learning Curve       | Lebih tinggi       | Lebih mudah                            |
| Dependency Injection | Built-in           | Manual / custom                        |
| Ukuran bundle        | Lebih besar        | Lebih kecil                            |

---

## Tips Migrasi Angular ke React

### 1. Ubah Mindset (Framework → Library)

Angular sudah menyediakan semua, sedangkan React:

- Harus memilih sendiri tools (router, state, dll)
- Lebih fleksibel tapi perlu struktur sendiri

---

### 2. Pecah Component Secara Bertahap

- Migrasi per halaman (page-based)
- Jangan langsung semua sekaligus
- Fokus ke reusable component

---

### 3. Struktur Folder

Karena React bersifat fleksibel (tidak opinionated), struktur folder dapat disesuaikan sesuai kebutuhan.

Untuk mempermudah proses migrasi dari Angular, struktur folder React bisa dibuat mirip dengan Angular, misalnya:

Angular:

```
core/
shared/
features/
```

React:

```
core/
shared/
features/
```

Dengan pendekatan ini:

- Developer tidak perlu beradaptasi ulang dengan struktur baru
- Proses migrasi menjadi lebih cepat dan terarah
- Konsistensi antar project tetap terjaga

---

## Kelebihan React dibanding Angular

- Lebih ringan dan fleksibel
- Ecosystem luas
- Lebih cepat untuk development kecil-menengah
- Tidak terlalu banyak boilerplate

---

## Kekurangan React dibanding Angular

- Tidak opinionated (harus setup sendiri)
- Banyak pilihan library sehingga bisa membingungkan
- Tidak ada built-in DI, HTTP, dll
- Struktur project bisa tidak konsisten antar developer

---

## Kesimpulan

- Angular cocok untuk enterprise-scale app dengan struktur ketat
- React cocok untuk flexible dan scalable UI development

Migrasi dari Angular ke React sebenarnya tidak sulit jika memahami bahwa:
Sebagian besar konsep sama, hanya berbeda cara implementasi

---

_Dokumen ini merupakan bagian dari proses migrasi aplikasi dari Angular ke React menggunakan API dari https://petstore.swagger.io/_

_Link Demo: https://youtu.be/sQI8DWzpUD4_
