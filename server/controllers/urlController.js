const { createShortUrl, findByCode, incrementClick, listUrls, getUrlStats, incrementSiteVisits, getGlobalAnalytics } = require('../models/urlModel');
const { isValidUrl, sanitizeAlias } = require('../utils/validators');
const { generateCode } = require('../utils/shortCode');

exports.shortenUrl = async (req, res, next) => {
  try {
    const { url, alias } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A URL is required.' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Please provide a valid http or https URL.' });
    }

    const cleanedAlias = alias ? sanitizeAlias(alias) : null;
    const shortCode = cleanedAlias || generateCode();

    const existing = await findByCode(shortCode);
    if (existing) {
      if (existing.originalUrl === url) {
        const shortUrl = `${req.protocol}://${req.get('host')}/${existing.shortCode}`;
        return res.status(200).json({
          message: 'Short URL already exists',
          shortCode: existing.shortCode,
          shortUrl,
          originalUrl: existing.originalUrl,
          clickCount: existing.clickCount,
        });
      }

      return res.status(409).json({ error: 'This short code is already taken.' });
    }

    const record = await createShortUrl({ originalUrl: url, shortCode });
    const shortUrl = `${req.protocol}://${req.get('host')}/${record.shortCode}`;

    return res.status(201).json({
      message: 'Short URL created successfully',
      shortCode: record.shortCode,
      shortUrl,
      originalUrl: record.originalUrl,
      clickCount: record.clickCount,
    });
  } catch (error) {
    return next(error);
  }
};

exports.redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const record = await findByCode(shortCode);

    if (!record) {
      return res.status(404).json({ error: 'Short URL not found.' });
    }

    await incrementClick(shortCode);
    return res.redirect(record.originalUrl);
  } catch (error) {
    return next(error);
  }
};

exports.listUrls = async (_req, res, next) => {
  try {
    const urls = await listUrls();
    return res.status(200).json(urls);
  } catch (error) {
    return next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const record = await getUrlStats(shortCode);

    if (!record) {
      return res.status(404).json({ error: 'Short URL not found.' });
    }

    return res.status(200).json(record);
  } catch (error) {
    return next(error);
  }
};

exports.recordVisit = async (req, res, next) => {
  try {
    await incrementSiteVisits();
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getGlobalAnalytics();
    return res.status(200).json(stats);
  } catch (error) {
    return next(error);
  }
};
