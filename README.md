<div align="center">

# Yousef Ayoubi — Full-Stack Developer Portfolio & Custom CMS

**A modern, high-performance personal portfolio and full-stack content management platform built with React, TypeScript, Node.js, and MySQL.**

[![Live Website](https://img.shields.io/badge/Live_Site-aubi.dev-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aubi.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## Overview

**aubi.dev** is an end-to-end full-stack web platform designed to showcase software engineering projects, technical experience, and architectural work. Beyond a static showcase, it is powered by a custom-built **Admin CMS** that enables real-time management of portfolio content, dynamic theme variables, and SEO metadata without redeploying code.

---

## Key Features

- **Custom Admin Dashboard & CMS:** Full CRUD management for projects, work experience, technical skills, and services.
- **Dynamic Theme & UI Engine:** Instant Dark/Light mode switching with persistent CSS custom variables and zero flash of unstyled content (FOUC).
- **Interactive Animations:** Smooth scroll choreography and micro-interactions powered by **Framer Motion** and **GSAP**.
- **Built-in SEO & Social Hub:** Configurable OpenGraph cards, canonical URLs, Twitter metadata, and structured schema settings.
- **Bilingual Typography & RTL Support:** Seamless support for English and Arabic layouts (`Inter`, `Lora`, and `Cairo` fonts).
- **RESTful API & Relational Schema:** Type-safe database operations using **Prisma ORM** and **MySQL**.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide Icons |
| **Backend** | Node.js, Express.js, Prisma ORM |
| **Database** | MySQL |
| **Deployment** | Vercel (Frontend), Render (Backend API) |

---

## Project Structure

```text
portfolio/
├── client/                 # React + TypeScript + Vite frontend application
│   ├── public/             # Static assets, icons, and OpenGraph images
│   └── src/
│       ├── components/     # Reusable UI, layout, and motion components
│       ├── pages/          # Public portfolio views & Admin CMS pages
│       └── lib/            # API clients, utilities, and hooks
├── server/                 # Node.js + Express + Prisma backend API
│   ├── prisma/             # Database schema and migrations
│   └── src/                # Controllers, routes, middlewares, and services
├── .gitignore
├── package.json
└── README.md
```

---

## Local Development Setup

### 1. Clone the repository
```bash
git clone [https://github.com/yusufWeb44/portfolio.git](https://github.com/yusufWeb44/portfolio.git)
cd portfolio
```

### 2. Configure Backend (`server`)
```bash
cd server
npm install
```
Create a `.env` file inside `server/` (see `server/.env.example`) and configure your database connection:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=5000
CLIENT_URL="http://localhost:5173"
JWT_SECRET="your_jwt_secret"
```
Generate Prisma client and start the development server:
```bash
npx prisma generate
npm run dev
```

### 3. Configure Frontend (`client`)
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file inside `client/` pointing to your local API:
```env
VITE_API_URL="http://localhost:5000/api"
```
Start the Vite development server:
```bash
npm run dev
```

---

## Contact

**Yousef Ayoubi** — Computer Engineer & Full-Stack Developer  
- **Portfolio:** [aubi.dev](https://aubi.dev)  
- **GitHub:** [@yusufWeb44](https://github.com/yusufWeb44)