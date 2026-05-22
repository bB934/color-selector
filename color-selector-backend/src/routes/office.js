const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');

const upload = multer({ dest: 'uploads/' });

// 系统Chrome的路径
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// 启动浏览器的辅助函数
async function createBrowser() {
  // 尝试使用系统Chrome
  if (fs.existsSync(CHROME_PATH)) {
    return await puppeteer.launch({ 
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  // 回退到默认（需要下载Chromium）
  return await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}

// 通用的HTML转PDF函数
async function htmlToPdf(html, outputPath) {
  const browser = await createBrowser();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ 
    path: outputPath, 
    format: 'A4',
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    printBackground: true
  });
  await browser.close();
}

// Word转PDF (使用Mammoth + Puppeteer)
router.post('/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传Word文件' });
    }

    const inputFile = req.file.path;
    const outputDir = path.join(__dirname, '../../outputs');
    const outputFilename = 'converted_' + Date.now() + '.pdf';
    const outputFile = path.join(outputDir, outputFilename);

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 使用Mammoth将Word转换为HTML
    const result = await mammoth.convertToHtml({ path: inputFile });
    
    // 构建精美的HTML页面
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${req.file.originalname || 'Word文档'}</title>
        <style>
          @page { margin: 20mm 15mm; }
          body { 
            font-family: 'Arial', 'Helvetica Neue', sans-serif; 
            padding: 0; 
            margin: 0;
            line-height: 1.6;
            color: #333;
            font-size: 12pt;
          }
          .content { padding: 40px; }
          h1 { font-size: 24pt; margin-bottom: 12pt; }
          h2 { font-size: 20pt; margin-bottom: 10pt; }
          h3 { font-size: 16pt; margin-bottom: 8pt; }
          p { margin-bottom: 6pt; }
          table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
          td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f5f5f5; font-weight: bold; }
          img { max-width: 100%; height: auto; }
          ul, ol { margin: 6pt 0; padding-left: 20pt; }
          li { margin-bottom: 3pt; }
        </style>
      </head>
      <body>
        <div class="content">${result.value}</div>
      </body>
      </html>
    `;

    // 使用Puppeteer将HTML转换为PDF
    await htmlToPdf(html, outputFile);

    // 清理上传的文件
    try { fs.unlinkSync(inputFile); } catch(e) {}

    // 返回下载URL
    const fileUrl = `http://localhost:3000/outputs/${outputFilename}`;
    res.json({ 
      message: 'Word转PDF成功',
      downloadUrl: fileUrl 
    });

  } catch (error) {
    console.error('Word to PDF error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PPT转PDF (需要额外库，暂返回提示)
router.post('/ppt-to-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传PPT文件' });
    }

    const inputFile = req.file.path;
    const outputDir = path.join(__dirname, '../../outputs');
    const outputFilename = 'converted_' + Date.now() + '.pdf';
    const outputFile = path.join(outputDir, outputFilename);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 使用Puppeteer创建简单PDF（PPT直接转换需要额外库如python-pptx）
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${req.file.originalname || 'PPT文档'}</title>
        <style>
          @page { margin: 20mm 15mm; }
          body { 
            font-family: 'Arial', sans-serif; 
            padding: 40px; 
            line-height: 1.6;
            color: #333;
          }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          .info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .note { color: #666; font-style: italic; }
        </style>
      </head>
      <body>
        <h1>PPT文件转换</h1>
        <div class="info">
          <p><strong>文件名:</strong> ${req.file.originalname}</p>
          <p><strong>文件大小:</strong> ${(req.file.size / 1024).toFixed(2)} KB</p>
          <p><strong>上传时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
        </div>
        <p class="note">提示: PPT转PDF功能需要安装python-pptx或LibreOffice后才会启用完整转换功能。</p>
        <p class="note">当前仅生成包含文件信息的基本PDF文档。</p>
      </body>
      </html>
    `;

    await htmlToPdf(html, outputFile);

    try { fs.unlinkSync(inputFile); } catch(e) {}

    const fileUrl = `http://localhost:3000/outputs/${outputFilename}`;
    res.json({ 
      message: 'PPT已转换为PDF（内容为基本信息）',
      downloadUrl: fileUrl 
    });

  } catch (error) {
    console.error('PPT to PDF error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'Office routes', features: ['word-to-pdf', 'ppt-to-pdf'] });
});

module.exports = router;
