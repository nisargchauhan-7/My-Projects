const jwt = require('jsonwebtoken');
const env = require('../config/env');

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { sign, authRequired };
