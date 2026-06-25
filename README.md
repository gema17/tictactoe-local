# Tic Tac Toe Multiplayer Online

Aplikasi game **Tic Tac Toe Multiplayer** sederhana berbasis **Client-Server Programming** menggunakan **Node.js**, **Express**, dan **Socket.IO**.

## Features
- Multiplayer 2 pemain (Player X & Player O)
- Sinkronisasi board real-time
- Sistem lobby otomatis
- Validasi giliran bermain
- Notifikasi menang / kalah / seri
- Auto reset jika player disconnect

---

# Installation

## 1. Clone Repository
```bash
git clone https://github.com/gema17/tictactoe-local.git
```

## 2. Masuk ke folder project
```bash
cd tictactoe-local
```

## 3. Install dependency
```bash
npm install
```

## 4. Jalankan server
```bash
node server.js
```

Server akan berjalan di:

```text
http://localhost:3000
```

---

# How to Play

## 1. Buka game di browser
Buka:

```text
http://localhost:3000
```

## 2. Buka 2 tab browser
- Tab pertama otomatis menjadi **Player X**
- Tab kedua otomatis menjadi **Player O**

## 3. Mulai permainan
- Player **X** berjalan lebih dulu
- Bergantian dengan Player **O**
- Klik kotak kosong untuk menaruh simbol

## 4. Menang / Kalah / Seri
Game akan menampilkan popup hasil:
- **You Win!**
- **You Lose!**
- **Draw!**

## 5. Disconnect
Jika salah satu player keluar:
- Game otomatis reset
- Slot player kosong akan tersedia untuk player baru

---

# Technologies Used
- Node.js
- Express.js
- Socket.IO
- HTML
- CSS
- JavaScript

---

# Project Structure

```text
tictactoe-local/
│── server.js
│── package.json
│── package-lock.json
│── public/
│   │── index.html
│   │── style.css
│   │── client.js
```

---

# Author
**Gema Pratama**
