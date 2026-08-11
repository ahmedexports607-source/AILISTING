@echo off
REM AILISTING Quick Start Script for Windows
REM Launches backend and frontend in separate windows

echo ======================================
echo AILISTING - Automated Listing System
echo ======================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: Please run this script from the AILISTING root directory
    echo Current directory: %cd%
    pause
    exit /b 1
)

echo Checking prerequisites...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not installed or not in PATH
    pause
    exit /b 1
) else (
    echo [OK] Python is installed
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed or not in PATH
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
)

REM Check Yarn
yarn --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Yarn not found, will use npm instead
    set PACKAGE_MANAGER=npm
) else (
    echo [OK] Yarn is installed
    set PACKAGE_MANAGER=yarn
)

echo.
echo Installing dependencies...
echo.

REM Install backend dependencies
echo [1/2] Installing backend dependencies...
cd backend
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo [2/2] Installing frontend dependencies...
cd frontend
if "%PACKAGE_MANAGER%"=="yarn" (
    yarn install --silent
) else (
    npm install --silent
)
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [OK] All dependencies installed successfully
echo.
echo ======================================
echo Starting Services...
echo ======================================
echo.
echo Backend will start on:  http://localhost:8000
echo Frontend will start on: http://localhost:3000
echo API Docs will be at:    http://localhost:8000/docs
echo.
echo Press any key to continue...
pause

REM Start Backend
echo Starting Backend (FastAPI)...
start "AILISTING Backend" cmd /k "cd backend && uvicorn server:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend (React)...
start "AILISTING Frontend" cmd /k "cd frontend && %PACKAGE_MANAGER% start"

echo.
echo ======================================
echo Services Started!
echo ======================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Close these windows to stop the application.
echo.
pause
