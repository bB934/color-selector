const fs = require('fs');
const path = require('path');

// 自动清理文件：保留1小时
function scheduleCleanup(uploadDir, outputDir) {
  // 每分钟检查一次
  setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    // 清理上传目录
    cleanDirectory(uploadDir, oneHourAgo);
    // 清理输出目录
    cleanDirectory(outputDir, oneHourAgo);
  }, 60 * 1000);
}

function cleanDirectory(dirPath, olderThan) {
  try {
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs < olderThan) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error(`Error cleaning directory ${dirPath}:`, err);
  }
}

// 生成唯一文件名
function generateFilename(originalName, prefix = '') {
  const ext = path.extname(originalName);
  const name = Date.now().toString(36) + Math.random().toString(36).substr(2);
  return `${prefix}${name}${ext}`;
}

module.exports = {
  scheduleCleanup,
  generateFilename
};