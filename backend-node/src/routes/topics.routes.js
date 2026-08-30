const router = require('express').Router();
const c = require('../controllers/topics.controller');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, c.list);
router.get('/:id', authRequired, c.get);

module.exports = router;
