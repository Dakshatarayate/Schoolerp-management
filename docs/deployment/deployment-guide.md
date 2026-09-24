# SchoolERP — Deployment Guide

Instructions for deploying the frontend and backend applications to cloud infrastructure.

---

## 1. Frontend Deployment (Static Hosting)

The frontend is a pure Single Page Application (SPA) built with Vite and React. It compiles into static HTML/CSS/JS bundles in `frontend/dist`.

### Recommended Providers
* **Vercel** / **Netlify** / **Cloudflare Pages** / **AWS S3 + CloudFront**

### Build Configuration
* **Root Directory**: `frontend`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**:
  * `VITE_API_URL`: URL of the deployed Express backend (e.g., `https://api.schoolerp.com/api`)

---

## 2. Backend Deployment (Node.js Container/Server)

The backend is an Express.js Node server communicating with MongoDB Atlas.

### Recommended Providers
* **Render** / **Railway** / **DigitalOcean App Platform** / **AWS ECS / EC2**

### Build Configuration
* **Root Directory**: `backend`
* **Start Command**: `npm start` (runs `node server.js`)
* **Environment Variables**:
  * `NODE_ENV`: `production`
  * `PORT`: `5000` (or injected provider port)
  * `MONGODB_URI`: Production MongoDB Atlas connection URI
  * `JWT_SECRET`: 64+ character cryptographically random string
  * `CLIENT_URL`: HTTPS URL of the deployed frontend

---

## 3. Database Deployment (MongoDB Atlas)

1. Create a cluster on MongoDB Atlas (AWS / GCP region closest to target users).
2. Create database user with Read/Write permissions on `schoolerp` database.
3. Configure IP Access List: whitelist backend servers or allow trusted CIDR blocks.
4. Copy the connection string to `MONGODB_URI` in backend environment variables.
