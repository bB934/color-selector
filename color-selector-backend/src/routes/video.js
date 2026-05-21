const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 临时占位 - 需要安装 ffmpeg
router.post('/convert', upload.single('video'), (req, res) => {
  res.status(501).json({ 
    error: 'Video conversion not yet implemented',
    message: 'This feature requires ffmpeg to be installed'
  });
});

router.get('/', (req, res) => {
  res.json({ message: 'Video routes (placeholder)', features: ['convert'] });
});

module.exports = router;
