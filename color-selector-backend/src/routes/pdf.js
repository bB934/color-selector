const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// 合并 PDF
router.post('/merge', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: '至少需要上传2个PDF文件' });
    }
    
    const mergedPdf = await PDFDocument.create();
    
    for (const file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    
    const outputPath = path.join(__dirname, '../../outputs', `merged_${Date.now()}.pdf`);
    const mergedBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedBytes);
    
    // 清理上传的文件
    req.files.forEach(file => fs.unlinkSync(file.path));
    
    const fileUrl = `http://localhost:3000/outputs/${path.basename(outputPath)}`;
    
    res.json({ 
      message: 'PDF合并成功',
      downloadUrl: fileUrl
    });
  } catch (error) {
    console.error('PDF merge error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'PDF routes (merge)', features: ['merge'] });
});

module.exports = router;
