const router = require('express').Router();
const c = require('../controllers/tutor.controller');
const { authRequired } = require('../middleware/auth');

router.post('/ask', authRequired, c.ask);

module.exports = router;
