# URL Shortener Server

A simple URL shortener backend built with Express.

## Folder structure

server/
  config/
  controllers/
  models/
  routes/
  middlewares/
  utils/
  server.js
  .env

## API Endpoints

- POST /api/shorten
  - Body: { "url": "https://example.com", "alias": "demo" }
- GET /:shortCode
  - Redirects to the original URL
- GET /api/links
  - Lists all shortenings
- GET /api/links/:shortCode
  - Gets stats for a short code

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000/health
