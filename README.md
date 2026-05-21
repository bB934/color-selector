# 🎨 Color Selector - 全功能文件转换与颜色提取平台

一个完整的全栈应用，包含图片像素色块提取、文件格式转换等功能。支持前后端分离架构，提供丰富的API接口和现代化的用户界面。

## 🚀 功能特性

### 前端功能
- **图片像素色块提取器**
  - 支持 PNG, JPG, WebP, GIF, BMP, SVG 格式（最大 10MB）
  - 点击图片任意位置获取像素颜色
  - 多格式颜色显示：HEX, RGB, RGBA, HSL, HSV, CMYK
  - 实时预览与十字准星
  - 一键复制颜色值

- **文件转换工具**
  - Word 转 PDF
  - 图片 转 PDF
  - PDF 拼接
  - PPT 转 PDF

### 后端功能
- 图片格式转换（PNG, JPG, WebP）
- 图片转 PDF
- PDF 合并
- Office 文档转 PDF（PPT, Word）
- 视频格式转换
- 颜色提取功能

## 📦 技术栈

### 前端
- **Vue 3** (Composition API)
- **Vite** (构建工具)
- **TypeScript** (类型安全)
- **Vue Router 4** (路由管理)
- **Pinia** (状态管理)
- **Three.js** (3D 粒子背景)
- **SCSS** (样式预处理器)

### 后端
- **Node.js** + **Express**
- **TypeScript**
- **FFmpeg** (视频转换)
- **LibreOffice** (Office文档转换)

## 🎯 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/bB934/color-selector.git
cd color-selector

# 安装前端依赖并启动
cd color-selector-fronted
npm install
npm run dev

# 在另一个终端，安装后端依赖并启动
cd ../color-selector-backend
npm install
npm run dev

# 访问应用
打开浏览器访问 http://localhost:5173
```

### 构建生产版本

```bash
# 前端构建
cd color-selector-fronted
npm run build

# 后端构建
cd ../color-selector-backend
npm run build
```

## 📁 项目结构

```
color-selector/
├── color-selector-backend/  # 后端服务
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── routes/          # 路由配置
│   │   ├── utils/           # 工具函数
│   │   └── app.ts           # 应用入口
│   ├── uploads/             # 上传文件存储
│   ├── outputs/             # 转换结果输出
│   ├── package.json
│   └── README.md
├── color-selector-fronted/  # 前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── stores/          # Pinia 状态管理
│   │   ├── router/          # 路由配置
│   │   ├── views/           # 页面组件
│   │   ├── utils/           # 工具函数
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── README.md               # 项目总览
└── package.json            # 根目录 package.json (可选)
```

## 🔧 环境要求

### 前端
- Node.js 16+
- npm 或 yarn

### 后端
- Node.js 14+
- LibreOffice (Office转换)
- FFmpeg (视频转换)

### 安装依赖

```bash
# macOS
brew install libreoffice
brew install ffmpeg
```

## 🌐 API 接口

后端提供以下API端点：

- **图片转换**: POST `/api/images/convert`
- **图片转PDF**: POST `/api/images/topdf`
- **PDF合并**: POST `/api/pdfs/merge`
- **PPT转PDF**: POST `/api/office/ppt/to-pdf`
- **Word转PDF**: POST `/api/office/word/to-pdf`
- **视频转换**: POST `/api/videos/convert`
- **颜色提取**: POST `/api/colors/extract`

## 📋 环境变量配置

在 `color-selector-backend` 目录创建 `.env` 文件：

```
PORT=3000
UPLOAD_PATH=./uploads
OUTPUT_PATH=./outputs
MAX_FILE_SIZE=52428800  # 50MB
ALLOWED_EXTENSIONS=image/*,.pdf,.pptx,.ppt,.docx,.doc,.mp4,.mov,.avi,.mkv
CORS_ORIGIN=http://localhost:5173
```

## 🚀 部署

### Docker 部署

```bash
# 构建镜像
docker build -t color-selector .

# 运行容器
docker run -p 3000:3000 color-selector
```

### Nginx 反向代理

配置 Nginx 反向代理到前端和后端服务。

## 🤝 贡献

欢迎提交 PR 或提 issue！

1.  Fork 该项目
2.  Create 一个 feature 分支
3.  Commit 你的修改
4.  Push 到分支
5.  Open 一个 PR

## 📝 许可

MIT © [bB934](https://github.com/bB934)

## 📞 联系

- GitHub: https://github.com/bB934
- 问题反馈: 提交 GitHub Issue

## 📦 版本

- Vue 3.5.0+
- Vite 6.4.2+
- TypeScript 5.0+