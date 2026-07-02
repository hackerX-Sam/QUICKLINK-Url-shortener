const fs = require('fs');
const path = require('path');

// On Vercel, the file system is read-only except for /tmp
const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'data');
const storageFile = path.join(dataDir, 'urls.json');
const statsFile = path.join(dataDir, 'stats.json');

function ensureStorage() {
  const dir = path.dirname(storageFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(storageFile)) {
    fs.writeFileSync(storageFile, '[]', 'utf8');
  }

  if (!fs.existsSync(statsFile)) {
    fs.writeFileSync(statsFile, JSON.stringify({ totalVisits: 0 }), 'utf8');
  }
}

function readStats() {
  ensureStorage();
  const content = fs.readFileSync(statsFile, 'utf8');
  return JSON.parse(content);
}

function writeStats(data) {
  ensureStorage();
  fs.writeFileSync(statsFile, JSON.stringify(data, null, 2), 'utf8');
}

function readStorage() {
  ensureStorage();
  const content = fs.readFileSync(storageFile, 'utf8');
  return JSON.parse(content);
}

function writeStorage(data) {
  ensureStorage();
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
}

async function createShortUrl({ originalUrl, shortCode }) {
  const links = readStorage();
  const existing = links.find((entry) => entry.shortCode === shortCode);

  if (existing) {
    return existing;
  }

  const record = {
    id: Date.now().toString(36),
    originalUrl,
    shortCode,
    createdAt: new Date().toISOString(),
    clickCount: 0,
  };

  links.push(record);
  writeStorage(links);
  return record;
}

async function findByCode(shortCode) {
  const links = readStorage();
  return links.find((entry) => entry.shortCode === shortCode) || null;
}

async function incrementClick(shortCode) {
  const links = readStorage();
  const index = links.findIndex((entry) => entry.shortCode === shortCode);

  if (index === -1) {
    return null;
  }

  links[index].clickCount += 1;
  writeStorage(links);
  return links[index];
}

async function listUrls() {
  return readStorage();
}

async function getUrlStats(shortCode) {
  return findByCode(shortCode);
}

async function incrementSiteVisits() {
  const stats = readStats();
  stats.totalVisits += 1;
  writeStats(stats);
  return stats;
}

async function getGlobalAnalytics() {
  const stats = readStats();
  const links = readStorage();
  
  const totalUrls = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  
  return {
    totalVisits: stats.totalVisits,
    totalUrls,
    totalClicks
  };
}

module.exports = {
  createShortUrl,
  findByCode,
  incrementClick,
  listUrls,
  getUrlStats,
  incrementSiteVisits,
  getGlobalAnalytics,
};
