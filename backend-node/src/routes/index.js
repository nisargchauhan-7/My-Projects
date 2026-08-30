const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/materials', require('./materials.routes'));
router.use('/topics', require('./topics.routes'));
router.use('/tutor', require('./tutor.routes'));
router.use('/quizzes', require('./quizzes.routes'));
router.use('/performance', require('./performance.routes'));
router.use('/revision', require('./revision.routes'));

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'SynapseEDU API' }));

module.exports = router;
