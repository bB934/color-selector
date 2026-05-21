const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 临时占位 - 功能待实现
router.post('/word-to-pdf', upload.single('file'), (req, res) => {
  res.status(501).json({ 
    error: 'Word to PDF conversion not yet implemented',
    message: 'This feature requires LibreOffice to be installed'
  });
});

router.post('/ppt-to-pdf', upload.single('file'), (req, res) => {
  res.status(501).json({ 
    error: 'PPT to PDF conversion not yet implemented',
    message: 'This feature requires LibreOffice to be installed'
  });
});

router.get('/', (req, res) => {
  res.json({ message: 'Office routes (placeholder)', features: ['word-to-pdf', 'ppt-to-pdf'] });
});

module.exports = router;
