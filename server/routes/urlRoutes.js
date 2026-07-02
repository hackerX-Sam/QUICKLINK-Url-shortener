const express = require('express');
const {
  shortenUrl,
  redirectUrl,
  listUrls,
  getStats,
  recordVisit,
  getDashboardStats,
} = require('../controllers/urlController');

const router = express.Router();

router.post('/api/shorten', shortenUrl);
router.post('/api/visit', recordVisit);
router.get('/api/analytics', getDashboardStats);
router.get('/api/links', listUrls);
router.get('/api/links/:shortCode', getStats);
router.get('/:shortCode', redirectUrl);

module.exports = router;
