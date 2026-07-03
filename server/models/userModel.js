const fs = require('fs');
const path = require('path');

// On Vercel, the file system is read-only except for /tmp
const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');

function ensureStorage() {
  const dir = path.dirname(usersFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]', 'utf8');
  }
}

function readUsers() {
  ensureStorage();
  const content = fs.readFileSync(usersFile, 'utf8');
  return JSON.parse(content);
}

function writeUsers(data) {
  ensureStorage();
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2), 'utf8');
}

async function findUserByEmail(email) {
  const users = readUsers();
  return users.find((user) => user.email === email) || null;
}

async function createUser({ name, email, passwordHash }) {
  const users = readUsers();
  const existing = users.find((user) => user.email === email);

  if (existing) {
    throw new Error('User already exists');
  }

  const record = {
    id: Date.now().toString(36),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(record);
  writeUsers(users);
  
  // Return user without password hash
  const { passwordHash: _, ...safeUser } = record;
  return safeUser;
}

module.exports = {
  findUserByEmail,
  createUser,
};
