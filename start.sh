#!/bin/bash

# AILISTING Quick Start Script for macOS/Linux
# Launches backend and frontend

echo "======================================"
echo "AILISTING - Automated Listing System"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "ERROR: Please run this script from the AILISTING root directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo "Checking prerequisites..."
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not installed"
    exit 1
else
    python3 --version
    echo "[OK] Python is installed"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not installed"
    exit 1
else
    node --version
    echo "[OK] Node.js is installed"
fi

# Check Yarn or npm
if command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    echo "[OK] Yarn is installed"
else
    PACKAGE_MANAGER="npm"
    echo "[OK] npm is available"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install backend dependencies
echo "[1/2] Installing backend dependencies..."
cd backend
pip install -q -r requirements.txt || { echo "ERROR: Failed to install backend dependencies"; exit 1; }
cd ..

# Install frontend dependencies
echo "[2/2] Installing frontend dependencies..."
cd frontend
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install --silent
else
    npm install --silent
fi
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "[OK] All dependencies installed successfully"
echo ""
echo "======================================"
echo "Starting Services..."
echo "======================================"
echo ""
echo "Backend will start on:  http://localhost:8000"
echo "Frontend will start on: http://localhost:3000"
echo "API Docs will be at:    http://localhost:8000/docs"
echo ""
echo "Press Enter to continue..."
read

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Start Backend
echo "Starting Backend (FastAPI)..."
cd backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend (React)..."
cd frontend
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn start &
else
    npm start &
fi
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================"
echo "Services Started!"
echo "======================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
