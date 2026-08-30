const router = require('express').Router();
const c = require('../controllers/performance.controller');
const t = require('../controllers/topics.controller');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, c.overview);
router.get('/topics', authRequired, c.topics);
router.get('/dashboard', authRequired, t.dashboard);

module.exports = router;
