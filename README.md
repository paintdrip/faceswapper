<div align="center">

# 🎭 faceswapper

**Local AI Face Swap** — Modern web application for swapping faces in photos and videos. All processing happens locally on your machine.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![InsightFace](https://img.shields.io/badge/InsightFace-local-green)](https://github.com/deepinsight/insightface)

</div>

<div align="center">

**🌐 Language / Язык:**

[🇺🇸 English](#english) &nbsp;|&nbsp; [🇷🇺 Русский](#русский)

</div>

---

<a id="english"></a>
<div align="right"><a href="#english">🇺🇸 EN</a> | <a href="#русский">🇷🇺 RU</a></div>

## 🇺🇸 English

### Features

- 🖼️ **Photos** — Drag & Drop upload with preview
- 🎬 **Videos** — Swap faces in MP4/MOV/AVI files frame by frame
- 🔍 **Automatic face detection** via InsightFace
- 🎭 **Multi-face swap** — replace each detected face with a different target
- 🏠 **100% local** — no internet required after setup
- 🎨 **Modern UI** — dark theme, glassmorphism, green accents
- 🌐 **Multi-language** — Russian and English

### Architecture

```
faceswapper/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express + TypeScript REST API
├── ai-service/        # Python FastAPI + InsightFace
└── start.sh           # Launch all services with one command
```

### Requirements

- **Node.js** 18+ with npm
- **Python** 3.10+ with pip
- **Linux / macOS / Windows** (CPU; GPU optional)

### Quick Start

```bash
cd faceswapper
./start.sh
```

Then open **http://localhost:5173**

### Manual Launch

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev

# AI Service
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### How It Works

**Photos:**
1. Upload a source photo with faces
2. Upload a target face photo for each detected face
3. AI replaces faces using InsightFace + inswapper_128.onnx
4. Download the result

**Videos:**
1. Upload a source video
2. Upload target face(s)
3. AI processes each frame and assembles the output video
4. Download the result

### Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion  
**Backend:** Node.js, Express, TypeScript, Multer  
**AI:** Python, FastAPI, InsightFace, ONNX Runtime, OpenCV

---

<a id="русский"></a>
<div align="right"><a href="#english">🇺🇸 EN</a> | <a href="#русский">🇷🇺 RU</a></div>

## 🇷🇺 Русский

### Возможности

- 🖼️ **Фотографии** — Drag & Drop загрузка с предпросмотром
- 🎬 **Видео** — Замена лиц в MP4/MOV/AVI файлах покадрово
- 🔍 **Автоматическое распознавание** лиц через InsightFace
- 🎭 **Замена нескольких лиц** — каждое лицо на своё
- 🏠 **100% локально** — не требуется интернет после установки
- 🎨 **Современный интерфейс** — тёмная тема, glassmorphism, зелёные акценты
- 🌐 **Мультиязычность** — русский и английский

### Архитектура

```
faceswapper/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express + TypeScript REST API
├── ai-service/        # Python FastAPI + InsightFace
└── start.sh           # Запуск всех сервисов одной командой
```

### Требования

- **Node.js** 18+ с npm
- **Python** 3.10+ с pip
- **Linux / macOS / Windows** (CPU; GPU опционально)

### Быстрый старт

```bash
cd faceswapper
./start.sh
```

Затем открой **http://localhost:5173**

### Ручной запуск

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev

# AI Service
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Как это работает

**Фотографии:**
1. Загрузи фото с лицами
2. Загрузи target face для каждого найденного лица
3. AI заменяет лица через InsightFace + inswapper_128.onnx
4. Скачай результат

**Видео:**
1. Загрузи исходное видео
2. Загрузи target face
3. AI обрабатывает каждый кадр и собирает выходное видео
4. Скачай результат

### Технологии

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion  
**Backend:** Node.js, Express, TypeScript, Multer  
**AI:** Python, FastAPI, InsightFace, ONNX Runtime, OpenCV

---

## License / Лицензия

MIT

## Credits

- [InsightFace](https://github.com/deepinsight/insightface) — Face analysis and swapping
- [FaceFusion](https://github.com/facefusion/facefusion) — Inspiration for local face swap
