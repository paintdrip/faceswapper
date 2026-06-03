<div align="center">

# 🎭 faceswapper

**Local AI Face Swap** — Modern web application for swapping faces in photos. All processing happens locally on your machine.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![InsightFace](https://img.shields.io/badge/InsightFace-local-green)](https://github.com/deepinsight/insightface)

</div>

<div align="center">

**🌐 Language / Язык / 语言:**

[🇺🇸 English](#english) &nbsp;|&nbsp; [🇷🇺 Русский](#русский) &nbsp;|&nbsp; [🇨🇳 中文](#中文)

</div>

---

<a id="english"></a>
<div align="right"><a href="#english">🇺🇸 EN</a> | <a href="#русский">🇷🇺 RU</a> | <a href="#中文">🇨🇳 CN</a></div>

## 🇺🇸 English

### Features

- 🖼️ **Drag & Drop** photo upload with preview
- 🔍 **Automatic face detection** via InsightFace
- 🎭 **Face swapping** — upload any source photo and any target face
- 👥 **Group photo support** — replaces all detected faces
- 🏠 **100% local** — no internet required after setup
- 🎨 **Modern UI** — dark theme, glassmorphism, animations
- 📱 **Responsive design** — works on desktop and mobile
- ⚡ **Fast processing** — optimized local inference
- 🌐 **Multi-language** — Russian and English support

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

1. **Upload** a source photo with faces
2. **Upload** a target face photo — the face you want to use
3. **AI Service** finds all faces using InsightFace (`buffalo_l`)
4. **Face Swap** replaces each face with the target via `inswapper_128.onnx`
5. **Download** the result in PNG quality

### Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion  
**Backend:** Node.js, Express, TypeScript, Multer  
**AI:** Python, FastAPI, InsightFace, ONNX Runtime, OpenCV

---

<a id="русский"></a>
<div align="right"><a href="#english">🇺🇸 EN</a> | <a href="#русский">🇷🇺 RU</a> | <a href="#中文">🇨🇳 CN</a></div>

## 🇷🇺 Русский

### Возможности

- 🖼️ **Drag & Drop** загрузка фото с предпросмотром
- 🔍 **Автоматическое распознавание** лиц через InsightFace
- 🎭 **Замена лиц** — загрузи любое исходное фото и любое лицо
- 👥 **Поддержка групповых фото** — заменяет все найденные лица
- 🏠 **100% локально** — не требуется интернет после установки
- 🎨 **Современный интерфейс** — тёмная тема, glassmorphism, анимации
- 📱 **Адаптивный дизайн** — работает на компьютере и телефоне
- ⚡ **Быстрая обработка** — оптимизированный локальный инференс
- 🌐 **Мультиязычность** — поддержка русского и английского

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

1. **Загрузи** исходное фото с лицами
2. **Загрузи** фото с лицом для замены — то лицо, которым хочешь заменить
3. **AI Service** находит все лица с помощью InsightFace (`buffalo_l`)
4. **Face Swap** заменяет каждое лицо на выбранное через `inswapper_128.onnx`
5. **Скачай** результат в PNG-качестве

### Технологии

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion  
**Backend:** Node.js, Express, TypeScript, Multer  
**AI:** Python, FastAPI, InsightFace, ONNX Runtime, OpenCV

---

<a id="中文"></a>
<div align="right"><a href="#english">🇺🇸 EN</a> | <a href="#русский">🇷🇺 RU</a> | <a href="#中文">🇨🇳 CN</a></div>

## 🇨🇳 中文

### 功能特点

- 🖼️ **拖拽上传** 照片并预览
- 🔍 **自动人脸检测** 通过 InsightFace
- 🎭 **人脸替换** — 上传任意源照片和目标人脸
- 👥 **支持合影** — 替换所有检测到的人脸
- 🏠 **100% 本地处理** — 安装后无需联网
- 🎨 **现代化界面** — 深色主题、毛玻璃效果、动画
- 📱 **响应式设计** — 支持桌面端和移动端
- ⚡ **快速处理** — 优化的本地推理
- 🌐 **多语言支持** — 俄语和英语

### 项目架构

```
faceswapper/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express + TypeScript REST API
├── ai-service/        # Python FastAPI + InsightFace
└── start.sh           # 一键启动所有服务
```

### 环境要求

- **Node.js** 18+ 和 npm
- **Python** 3.10+ 和 pip
- **Linux / macOS / Windows** (CPU; GPU 可选)

### 快速开始

```bash
cd faceswapper
./start.sh
```

然后打开 **http://localhost:5173**

### 手动启动

```bash
# 前端
cd frontend && npm install && npm run dev

# 后端
cd backend && npm install && npm run dev

# AI 服务
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### 工作原理

1. **上传** 包含人脸的源照片
2. **上传** 目标人脸照片 — 你想使用的人脸
3. **AI 服务** 使用 InsightFace (`buffalo_l`) 检测所有人脸
4. **人脸替换** 通过 `inswapper_128.onnx` 替换每个人脸
5. **下载** PNG 格式的结果

### 技术栈

**前端:** React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion  
**后端:** Node.js, Express, TypeScript, Multer  
**AI:** Python, FastAPI, InsightFace, ONNX Runtime, OpenCV

---

## License / Лицензия / 许可证

MIT

## Credits

- [InsightFace](https://github.com/deepinsight/insightface) — Face analysis and swapping
- [FaceFusion](https://github.com/facefusion/facefusion) — Inspiration for local face swap
