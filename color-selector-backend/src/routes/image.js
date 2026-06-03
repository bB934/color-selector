const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

// 图片格式转换 (existing)
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

// 图片转PDF
router.post('/to-pdf', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '请上传至少一张图片' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      // Read the image with sharp and convert to PNG buffer
      const imageBuffer = fs.readFileSync(file.path);
      const metadata = await sharp(imageBuffer).metadata();
      
      // Convert image to PNG buffer for pdf-lib embedding
      const pngBuffer = await sharp(imageBuffer)
        .png()
        .toBuffer();

      // Embed the PNG into the PDF
      const image = await pdfDoc.embedPng(pngBuffer);
      
      // Create a page with the image dimensions
      const page = pdfDoc.addPage([image.width, image.height]);
      
      // Draw the image covering the full page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });

      // Clean up uploaded file
      fs.unlinkSync(file.path);
    }

    const outputPath = path.join(__dirname, '../../outputs', `image_to_pdf_${Date.now()}.pdf`);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    const fileUrl = `http://localhost:3000/outputs/${path.basename(outputPath)}`;

    res.json({
      message: '图片转PDF成功',
      downloadUrl: fileUrl,
      pageCount: req.files.length,
    });
  } catch (error) {
    console.error('Image to PDF error:', error);
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(f => {
        try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
      });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'Image routes working', features: ['convert', 'to-pdf'] });
});

module.exports = router;