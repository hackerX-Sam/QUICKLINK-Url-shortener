function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeAlias(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

module.exports = {
  isValidUrl,
  sanitizeAlias,
};
