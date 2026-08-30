const router = require('express').Router();
const c = require('../controllers/subjects.controller');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, c.list);

module.exports = router;
