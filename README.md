# Portfolio & Admin Dashboard

A full-stack portfolio and administration system built with **React (Vite, Tailwind CSS)** and **Node.js (Express, Prisma, MySQL/PostgreSQL)**.

---

## 🚀 Features

- **Frontend**: Modern, responsive UI with multi-language support (AR/EN), dynamic hero section, project gallery, timeline experience, skill showcase, services, and FAQ.
- **Admin Dashboard**: Secure management interface for projects, certificates, messages, SEO settings, translations, and site customization.
- **Backend**: RESTful API with JWT authentication, HTTP-only cookies, Prisma ORM, Helmet security headers, rate limiting, and WebP media optimization.

---

## 🛠️ Project Structure

```text
portfolio/
├── client/           # React + Vite frontend
│   ├── src/
│   ├── .env.example
│   └── package.json
├── server/           # Express + Prisma backend
│   ├── prisma/
│   ├── src/
│   ├── uploads/      # User media uploads (git ignored)
│   ├── .env.example
│   └── package.json
├── .gitignore        # Root gitignore rules
├── package.json      # Monorepo management scripts
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd portfolio
```

### 2. Environment Configuration

#### Backend (`server/.env`):
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"
JWT_SECRET="your-strong-jwt-secret-key-here"
CLIENT_URL="http://localhost:5173"
UPLOAD_DIR="uploads"
```

#### Frontend (`client/.env`):
Create `client/.env` based on `client/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
```

---

### 3. Installation & Database Setup

#### Server:
```bash
cd server
npm install
npx prisma migrate dev
npx prisma db seed
```

#### Client:
```bash
cd ../client
npm install
```

---

### 4. Running the Application

From the root directory:
```bash
# Run both client and server concurrently
npm run dev

# Or run separately:
npm run dev:server  # Runs server on http://localhost:5000
npm run dev:client  # Runs client on http://localhost:5173
```

---

## 🔒 Security & Privacy

- All sensitive `.env` files, credentials, and user uploads are strictly excluded via `.gitignore`.
- Password hashing with `bcryptjs`.
- Secure JWT authentication stored in HTTP-only cookies.
- Helmet security headers and CORS protection enabled.
