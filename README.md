# 🚀 QuickLink – Modern URL Shortener

🔗 **QuickLink** is a fast, secure, and modern URL shortening platform that transforms long URLs into clean, shareable links in seconds.

✨ **Features**

* 🔗 Generate short and customizable URLs
* 📊 Track click analytics and link performance
* 🔐 Google Sign-In and User Sessions
* 📂 Manage all your links from a personalized analytics dashboard
* ⚡ Fast, responsive, and user-friendly interface
* ☁️ Cloud-ready deployment with modern technologies

🛠️ **Tech Stack**

* ⚛️ HTML/CSS/JS (Vanilla Frontend)
* 🟢 Node.js
* 🚂 Express.js
* 🍃 File-based JSON Database (NoSQL style)
* 🔑 Google OAuth Integration

## Folder structure

```
server/
  controllers/
  data/
  middlewares/
  models/
  routes/
  utils/
  server.js
  .env
```

## API Endpoints

- `POST /api/shorten`
  - Body: `{ "url": "https://example.com", "alias": "demo" }`
- `GET /:shortCode`
  - Redirects to the original URL
- `GET /api/links`
  - Lists all shortenings
- `GET /api/links/:shortCode`
  - Gets stats for a short code
- `POST /api/visit`
  - Increments global site visit counter
- `GET /api/analytics`
  - Gets global stats for the dashboard

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)
