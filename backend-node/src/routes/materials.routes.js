const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const c = require('../controllers/materials.controller');
const { authRequired } = require('../middleware/auth');

const upload = multer({
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 20 * 1024 * 1024 }
});

router.post('/upload', authRequired, upload.single('file'), c.upload);
router.get('/', authRequired, c.list);

module.exports = router;
