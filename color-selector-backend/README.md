# Color Selector Backend

Backend service for color selector and file conversion application.

## Features

- Image format conversion (PNG, JPG, WebP)
- Image to PDF conversion
- PDF merging
- Office documents to PDF (PPT, Word)
- Video format conversion
- Color extraction from images

## Prerequisites

- Node.js 14+
- LibreOffice (for Office document conversion)
- FFmpeg (for video conversion)

### Installation

```bash
brew install libreoffice
brew install ffmpeg
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. The server will run on http://localhost:3000

## API Endpoints

- **Image Conversion**: POST `/api/images/convert`
- **Image to PDF**: POST `/api/images/topdf`
- **PDF Merge**: POST `/api/pdfs/merge`
- **PPT to PDF**: POST `/api/office/ppt/to-pdf`
- **Word to PDF**: POST `/api/office/word/to-pdf`
- **Video Conversion**: POST `/api/videos/convert`
- **Color Extraction**: POST `/api/colors/extract`

## Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
UPLOAD_PATH=./uploads
OUTPUT_PATH=./outputs
MAX_FILE_SIZE=52428800  # 50MB
ALLOWED_EXTENSIONS=image/*,.pdf,.pptx,.ppt,.docx,.doc,.mp4,.mov,.avi,.mkv
CORS_ORIGIN=http://localhost:8080
```

## File Management

- Uploaded files are stored in `./uploads`
- Converted files are stored in `./outputs`
- Files are automatically deleted after 1 hour

## Security

- File size limit: 50MB
- File type validation
- Random file names to prevent path traversal
- CORS restricted to frontend origin
- Rate limiting (implement later if needed)

## Deployment

For production, use Docker or deploy with Nginx reverse proxy.

## License

MIT