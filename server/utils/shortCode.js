const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 7);

function generateCode() {
  return nanoid();
}

module.exports = { generateCode };
