const router = require('express').Router();
const c = require('../controllers/performance.controller');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, c.revision);

module.exports = router;
