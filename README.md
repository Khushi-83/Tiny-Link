# TinyLink – URL Shortener

TinyLink is a simple URL shortener built with **Next.js**, **PostgreSQL**, and **TailwindCSS**.  
It lets users create short links, track clicks, view statistics, and delete links.

---

## 🚀 Live Demo
> https://your-vercel-url.vercel.app/  
(Replace this with your deployed URL)

---

## 📂 Features
- Create short links with optional custom code  
- Redirect using `/<code>`  
- Click tracking + last clicked time  
- View full stats on `/code/<code>`  
- Delete links  
- Built-in health endpoint `/healthz`  
- Clean dashboard UI

---

## 🛠 Tech Stack
- **Next.js (Pages Router)**
- **Neon/PostgreSQL**
- **Tailwind CSS**
- **Node.js**


## 🔧 Local Setup

### 1. Install dependencies
```bash
npm install
```
2. Add .env.local
```
DATABASE_URL=your-postgres-connection-url
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
3. Make sure the database and links table:
```
CREATE TABLE links (
  code TEXT PRIMARY KEY,
  target TEXT NOT NULL,
  total_clicks INT DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```
4. Run the Project:
```
npm run dev
```
---
##Folder Structure:
```
pages/
  index.jsx              → Dashboard
  [code].js              → Redirect handler
  code/[code].js         → Stats page
  api/links/*.js         → CRUD APIs
  api/healthz.js         → Health check
```

