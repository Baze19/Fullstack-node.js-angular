@echo off
REM Nonprofit Compliance Checker Setup Script for Windows
REM This script sets up the development environment for the application

echo 🚀 Setting up Nonprofit Compliance Checker...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm detected

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

REM Create environment file for backend
echo ⚙️  Setting up environment variables...
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo ✅ Created backend\.env file
    echo 📝 Please edit backend\.env with your API key
) else (
    echo ✅ backend\.env already exists
)

REM Check if Docker is installed (optional)
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker detected - you can use 'npm run docker:up' to run with Docker
) else (
    echo ℹ️  Docker not detected - you can still run locally with 'npm run dev'
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit backend\.env with your Nonprofit Check Plus API key
echo 2. Run 'npm run dev' to start the development servers
echo 3. Open http://localhost:4200 in your browser
echo.
echo 🐳 Docker users:
echo 1. Run 'npm run docker:up' to start with Docker
echo 2. Open http://localhost:4200 in your browser
echo.
echo 🔐 Default login credentials:
echo    Admin: admin / admin123
echo    User: user / user123
echo.
echo 📚 For more information, see README.md
pause


