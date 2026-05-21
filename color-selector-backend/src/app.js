const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(express.json());
app.use('/outputs', express.static(path.resolve(__dirname, '../outputs')));

// 确保上传和输出目录存在
const uploadDir = path.join(__dirname, '../uploads');
const outputDir = path.join(__dirname, '../outputs');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 自动清理文件（保留1小时）
const { scheduleCleanup } = require('./utils/fileHandler');
scheduleCleanup(uploadDir, outputDir);

// 路由
app.use('/api/images', require('./routes/image'));
app.use('/api/pdfs', require('./routes/pdf'));
app.use('/api/office', require('./routes/office'));
app.use('/api/videos', require('./routes/video'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', timestamp: new Date().toISOString() });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});