const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

// 图片格式转换
router.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片文件' });
    }
    
    const format = req.body.format || 'png';
    const outputPath = path.join(__dirname, '../../outputs', `converted_${Date.now()}.${format}`);
    
    await sharp(req.file.path)
      .toFormat(format)
      .toFile(outputPath);
    
    // 清理上传的文件
    fs.unlinkSync(req.file.path);
    
    const fileUrl = `http://localhost:3000/outputs/${path.basename(outputPath)}`;
    
    res.json({ 
      message: '图片转换成功',
      downloadUrl: fileUrl
    });
  } catch (error) {
    console.error('Image conversion error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'Image routes working', features: ['convert'] });
});

module.exports = router;
