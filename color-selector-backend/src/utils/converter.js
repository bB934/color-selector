const sharp = require('sharp');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

// 图片格式转换
async function convertImageFormat(inputPath, outputFormat) {
  const outputPath = inputPath.replace(/\.[^.]+$/, '') + '.' + outputFormat;
  
  switch (outputFormat) {
    case 'jpg':
      return sharp(inputPath).jpeg().toFile(outputPath);
    case 'png':
      return sharp(inputPath).png().toFile(outputPath);
    case 'webp':
      return sharp(inputPath).webp().toFile(outputPath);
    default:
      throw new Error('Unsupported image format');
  }
}

// 图片转PDF
async function imageToPdf(imagePath, outputPath) {
  return sharp(imagePath).pdf().toFile(outputPath);
}

// PDF合并
async function mergePdfs(pdfPaths, outputPath) {
  const pdfDoc = await PDFDocument.create();
  
  for (const pdfPath of pdfPaths) {
    const existingPdf = await PDFDocument.load(await fs.readFile(pdfPath));
    const pages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
    pages.forEach(page => {
      pdfDoc.addPage(page);
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, pdfBytes);
}

// 颜色提取
async function extractColors(imagePath, colorCount = 6) {
  const ColorThief = require('color-thief');
  const colorThief = new ColorThief();
  const image = colorThief.getColor(imagePath);
  return image;
}

module.exports = {
  convertImageFormat,
  imageToPdf,
  mergePdfs,
  extractColors
};