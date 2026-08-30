const bcrypt = require('bcryptjs');
const store = require('../data/store');
const { sign } = require('../middleware/auth');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    if (await store.findUserByEmail(email)) return res.status(409).json({ error: 'Email already registered' });
    const user = await store.createUser({ name: name || email.split('@')[0], email, password });
    res.status(201).json({ user, token: sign(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const row = await store.findUserByEmail(email);
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = { id: row.id, name: row.name, email: row.email };
    res.json({ user, token: sign(user) });
  } catch (e) { next(e); }
};

exports.me = async (req, res) => res.json({ user: req.user });
