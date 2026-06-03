# faceswapper

🎭 **Local AI Face Swap** — Modern web application for swapping faces in photos. All processing happens locally on your machine. No cloud APIs, no photos leave your PC.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react)
![Tech Stack](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tech Stack](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Tech Stack](https://img.shields.io/badge/InsightFace-local-green)

## Features

- 🖼️ **Drag & Drop** photo upload with preview
- 🔍 **Automatic face detection** via InsightFace
- 🎭 **Face swapping** — upload any source photo and any target face
- 👥 **Group photo support** — replaces all detected faces
- 🏠 **100% local** — no internet required after setup
- 🎨 **Modern UI** — dark theme, glassmorphism, animations
- 📱 **Responsive design** — works on desktop and mobile
- ⚡ **Fast processing** — optimized local inference
- 🌐 **Multi-language** — Russian and English support

## Architecture

```
faceswapper/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express + TypeScript REST API
├── ai-service/        # Python FastAPI + InsightFace
└── start.sh           # Launch all services with one command
```

## Requirements

- **Node.js** 18+ with npm
- **Python** 3.10+ with pip
- **Linux/macOS/Windows** (CPU; GPU optional)

## Quick Start

### 1. Navigate to project folder

```bash
cd faceswapper
```

### 2. Launch with one command

```bash
./start.sh
```

The script automatically:
- Installs all Node.js dependencies
- Creates a Python virtual environment
- Installs Python models
- Launches all 3 services

Then open **http://localhost:5173**

### 3. Manual launch (if needed)

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### AI Service
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

## How It Works

1. **Upload** a source photo with faces via drag & drop
2. **Upload** a target face photo — the face you want to use
3. **AI Service** finds all faces using InsightFace (`buffalo_l`)
4. **Face Swap** replaces each detected face with the target face via `inswapper_128.onnx`
5. **Download** the result in maximum PNG quality

## Project Structure

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + Glassmorphism UI
- Zustand for state management
- TanStack Query for server state
- Framer Motion animations
- React Router navigation
- i18n (Russian / English)

### Backend
- Express + TypeScript
- REST API for image upload
- Multer for file handling
- Proxying to AI Service

### AI Service
- FastAPI + Python
- InsightFace for face detection and alignment
- ONNX Runtime for face swap inference
- Automatic model download on first launch

## Testing

```bash
# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# AI Service tests
npm run test:ai

# All tests
npm test
```

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `3001` | Backend API port |
| `AI_SERVICE_URL` | `http://localhost:8000` | AI service address |

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, React Router, Framer Motion

**Backend:** Node.js, Express, TypeScript, Multer

**AI:** Python, FastAPI, InsightFace, ONNX Runtime, OpenCV

## License

MIT

## Credits

- [InsightFace](https://github.com/deepinsight/insightface) — Face analysis and swapping
- [FaceFusion](https://github.com/facefusion/facefusion) — Inspiration for local face swap
