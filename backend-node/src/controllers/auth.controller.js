const bcrypt = require('bcryptjs');
const store = require('../data/store');
const { sign } = require('../middleware/auth');

exports.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    email = (email || '').trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'A valid email is required' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (await store.findUserByEmail(email)) return res.status(409).json({ error: 'Email already registered' });
    const user = await store.createUser({ name: (name || email.split('@')[0]).trim(), email, password });
    res.status(201).json({ user, token: sign(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = (email || '').trim().toLowerCase();
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const row = await store.findUserByEmail(email);
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    await store.ensureBaseline(row.id);
    const user = { id: row.id, name: row.name, email: row.email };
    res.json({ user, token: sign(user) });
  } catch (e) { next(e); }
};

exports.me = async (req, res) => res.json({ user: req.user });
