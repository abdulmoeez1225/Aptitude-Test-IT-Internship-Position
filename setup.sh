#!/bin/bash

echo "🚀 BMW IT Internship Test - Setup Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend setup
echo "📦 Setting up backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

# Database setup
echo "🗄️ Setting up database..."
cd ../database

# Check if MySQL is running
if ! mysqladmin ping -h localhost --silent; then
    echo "❌ MySQL is not running. Please start MySQL service first."
    exit 1
fi

echo "📊 Creating database and importing data..."
echo "Please enter your MySQL root password:"
read -s mysql_password

# Create database and import data
mysql -u root -p$mysql_password < setup.sql
node importData.js

echo "✅ Database setup completed"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Backend will be available at: http://localhost:5000"
echo "Frontend will be available at: http://localhost:5173"
echo ""
echo "Don't forget to configure your database connection in backend/config.env" 