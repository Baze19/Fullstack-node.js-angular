#!/bin/bash

# Nonprofit Compliance Checker Setup Script
# This script sets up the development environment for the application

set -e

echo "🚀 Setting up Nonprofit Compliance Checker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment file for backend
echo "⚙️  Setting up environment variables..."
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file"
    echo "📝 Please edit backend/.env with your API key"
else
    echo "✅ backend/.env already exists"
fi

# Check if Docker is installed (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker detected - you can use 'npm run docker:up' to run with Docker"
else
    echo "ℹ️  Docker not detected - you can still run locally with 'npm run dev'"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your Nonprofit Check Plus API key"
echo "2. Run 'npm run dev' to start the development servers"
echo "3. Open http://localhost:4200 in your browser"
echo ""
echo "🐳 Docker users:"
echo "1. Run 'npm run docker:up' to start with Docker"
echo "2. Open http://localhost:4200 in your browser"
echo ""
echo "🔐 Default login credentials:"
echo "   Admin: admin / admin123"
echo "   User: user / user123"
echo ""
echo "📚 For more information, see README.md"


