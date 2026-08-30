const router = require('express').Router();
const c = require('../controllers/quizzes.controller');
const { authRequired } = require('../middleware/auth');

router.post('/generate', authRequired, c.generate);
router.post('/submit', authRequired, c.submit);

module.exports = router;
