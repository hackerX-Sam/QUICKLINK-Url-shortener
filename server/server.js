const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'URL shortener is running' });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'welcome.html'));
});

app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'login.html'));
});

app.get('/app', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use('/', urlRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
