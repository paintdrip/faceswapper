# DiminSwap

🎭 **Локальный AI Face Swap** — Современное веб-приложение для замены лиц на фотографиях. Вся обработка происходит локально на твоём компьютере. Никаких облачных API, никакая фотография не покидает твой ПК.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react)
![Tech Stack](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tech Stack](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Tech Stack](https://img.shields.io/badge/InsightFace-local-green)

## Возможности

- 🖼️ **Drag & Drop** загрузка фото с предпросмотром
- 🔍 **Автоматическое распознавание** лиц через InsightFace
- 🎭 **Замена лиц** на лицо Димы Данилина из `face.png`
- 👥 **Поддержка групповых фото** — заменяет все найденные лица
- 🏠 **100% локально** — не требуется интернет после установки
- 🎨 **Современный интерфейс** — тёмная тема, glassmorphism, анимации
- 📱 **Адаптивный дизайн** — работает на компьютере и телефоне
- ⚡ **Быстрая обработка** — оптимизированный локальный инференс

## Архитектура

```
diminSwap/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express + TypeScript REST API
├── ai-service/        # Python FastAPI + InsightFace
├── face.png           # Лицо Димы Данилина (автозагрузка)
└── start.sh           # Запуск всех сервисов одной командой
```

## Требования

- **Node.js** 18+ с npm
- **Python** 3.10+ с pip
- **Linux/macOS/Windows** (CPU; GPU опционально)

## Быстрый старт

### 1. Перейди в папку проекта

```bash
cd diminSwap
```

### 2. Запуск одной командой

```bash
./start.sh
```

Скрипт автоматически:
- Установит все Node.js зависимости
- Создаст Python виртуальное окружение
- Установит Python модели
- Запустит все 3 сервиса

После этого открой **http://localhost:5173**

### 3. Ручной запуск (если нужно)

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

## Как это работает

1. **Загрузи** любое фото с лицами через drag & drop
2. **AI Service** находит все лица с помощью InsightFace (`buffalo_l`)
3. **Face Swap** заменяет каждое найденное лицо на лицо Димы Данилина из `face.png` через `inswapper_128.onnx`
4. **Скачай** результат в максимальном PNG качестве

## Структура проекта

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + Glassmorphism UI
- Zustand для управления состоянием
- TanStack Query для серверного состояния
- Framer Motion анимации
- React Router навигация

### Backend
- Express + TypeScript
- REST API для загрузки изображений
- Multer для работы с файлами
- Проксирование к AI Service

### AI Service
- FastAPI + Python
- InsightFace для детекции и выравнивания лиц
- ONNX Runtime для инференса face swap
- Автоматическая загрузка моделей при первом запуске

## Тестирование

```bash
# Frontend тесты
npm run test:frontend

# Backend тесты
npm run test:backend

# AI Service тесты
npm run test:ai

# Все тесты
npm test
```

## Референсное лицо

Файл `face.png` в корне проекта — это лицо Димы Данилина, которое используется для замены всех найденных лиц на загруженных фотографиях.

## Конфигурация

| Переменная окружения | Значение по умолчанию | Описание |
|---------------------|----------------------|----------|
| `PORT` | `3001` | Порт backend API |
| `AI_SERVICE_URL` | `http://localhost:8000` | Адрес AI сервиса |

## Технологии

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, React Router, Framer Motion

**Backend:** Node.js, Express, TypeScript, Multer

**AI:** Python, FastAPI, InsightFace, ONNX Runtime, OpenCV

## Лицензия

MIT

## Благодарности

- [InsightFace](https://github.com/deepinsight/insightface) — Анализ и замена лиц
- [FaceFusion](https://github.com/facefusion/facefusion) — Вдохновение для локального face swap
