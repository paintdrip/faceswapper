#!/bin/bash
set -e

echo "🚀 faceswapper Launcher"
echo "========================"

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Install AI service dependencies if needed
if [ ! -d "ai-service/.venv" ]; then
    echo "📦 Creating Python virtual environment..."
    cd ai-service && python3 -m venv .venv && cd ..
fi

if ! source ai-service/.venv/bin/activate && python -c "import insightface" 2>/dev/null; then
    echo "📦 Installing AI service Python dependencies..."
    source ai-service/.venv/bin/activate
    cd ai-service && pip install -r requirements.txt && cd ..
fi

echo ""
echo "🟢 Starting AI Service on port 8000..."
source ai-service/.venv/bin/activate
cd ai-service && python src/main.py &
AI_PID=$!
cd ..

echo "🟢 Starting Backend on port 3001..."
cd backend && npm run dev &
BACK_PID=$!
cd ..

echo "🟢 Starting Frontend on port 5173..."
cd frontend && npm run dev &
FRONT_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   AI:       http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

trap "echo 'Stopping services...'; kill $AI_PID $BACK_PID $FRONT_PID 2>/dev/null; exit 0" INT

wait
