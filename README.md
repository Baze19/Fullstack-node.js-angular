# Nonprofit Compliance Checker

A full-stack web application that allows users to check the compliance status of nonprofit organizations using the Nonprofit Check Plus API.

## 🚀 Live Demo

**Frontend**: http://localhost:4200  
**Backend API**: http://localhost:3001  
**Health Check**: http://localhost:3001/health

## 📋 Features

- **Authentication System**: JWT-based login with role-based access
- **Nonprofit Search**: Search by EIN (Employer Identification Number)
- **Compliance Status**: Display BMF (Business Master File) and PUB78 verification status
- **Detailed Information**: Organization details, address, compliance flags, and additional metadata
- **Search History**: Track and export search queries
- **Responsive Design**: Modern UI built with Angular Material
- **Docker Support**: Containerized deployment with Docker Compose

## 🛠️ Tech Stack

### Frontend
- **Angular 17** - Modern frontend framework
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - Authentication
- **Axios** - HTTP client
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server (production)

## 📦 Quick Start

### TL;DR (Local)

```bash
# 1) Backend
cd backend
cp env.example .env   # add your NONPROFIT_API_KEY
npm install
node src/server.js    # http://localhost:3001/health

# 2) Frontend (new terminal)
cd frontend
npm install
npm start             # http://localhost:4200
```

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (optional)

### 🚀 One-Command Setup

**Windows:**
```cmd
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nonprofit-compliance-checker
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend)
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy backend environment file
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your API key
   NONPROFIT_API_KEY=your-actual-api-key-here
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3001

### Option 2: Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Or run in background
   docker-compose up -d --build
   ```

2. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3001

## 🔐 Authentication

### Default Users
- **Admin User**:
  - Username: `admin`
  - Password: `admin123`
  - Role: `admin`

- **Regular User**:
  - Username: `user`
  - Password: `user123`
  - Role: `user`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Validate JWT token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Nonprofit Search
- `POST /api/nonprofit/search` - Search by EIN or organization name
- `GET /api/nonprofit/:ein` - Get nonprofit by EIN

### Search History
- `GET /api/history` - Get search history
- `GET /api/history/stats` - Get search statistics
- `DELETE /api/history` - Clear search history
- `GET /api/history/export` - Export history as CSV

### Health Check
- `GET /health` - Application health status

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test
```

## 📁 Project Structure

```
nonprofit-compliance-checker/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Angular components
│   │   │   ├── services/     # Angular services
│   │   │   └── models/       # TypeScript interfaces
│   │   └── assets/           # Static assets
│   └── package.json
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business logic
│   │   └── server.js         # Main server file
│   └── package.json
├── docker-compose.yml        # Docker orchestration
├── package.json              # Root package.json
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NONPROFIT_API_BASE_URL=https://entities.pactman.org/api/entities/nonprofitcheck/v1
NONPROFIT_API_KEY=your-actual-api-key-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### API Configuration

The application integrates with the **Nonprofit Check Plus API**:
- Base URL: `https://entities.pactman.org/api/entities/nonprofitcheck/v1`
- Authentication: Bearer token
- Endpoint: `/us/ein/{ein}`

## 📊 Sample API Response

```json
{
  "success": true,
  "data": {
    "organization": {
      "name": "Sample Nonprofit",
      "ein": "123456789",
      "status": "Active",
      "bmfStatus": "Active",
      "pub78Status": "Active",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    },
    "compliance": {
      "isCompliant": true,
      "bmfCompliant": true,
      "pub78Compliant": true,
      "lastUpdated": "2024-01-01T00:00:00Z"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🚨 Assumptions Made

1. **API Integration**: 
   - Using demo API key for development
   - API supports EIN-based searches only
   - Response structure matches provided sample

2. **Authentication**:
   - JWT tokens with 24-hour expiration
   - In-memory user storage (mock data)
   - Role-based access control (admin/user)

3. **Data Storage**:
   - In-memory storage for search history
   - No persistent database (can be easily added)

4. **Security**:
   - CORS enabled for localhost development
   - Rate limiting implemented
   - Helmet security headers

5. **Deployment**:
   - Local development environment
   - Docker containers for production readiness
   - Nginx reverse proxy for frontend

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3001 and 4200
   npx kill-port 3001 4200
   ```

2. **Frontend compilation errors**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Backend connection issues**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Docker issues**
   ```bash
   # Clean up Docker containers
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

## 📸 Screenshots

### Login Page
The login page features a clean, modern design with demo credentials provided for easy testing.

### Dashboard
The main dashboard provides a tabbed interface for searching nonprofits and viewing search history.

### Search Results
Comprehensive results display showing organization information, compliance status, and source matches.

### Search History
Detailed search history with statistics, export functionality, and pagination.

*Note: Screenshots would be added here in a real deployment*

## 🔄 Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build for production
npm run build

# Run tests
npm test

# Docker commands
npm run docker:build
npm run docker:up
npm run docker:down
```

## 📝 License

This project is for demonstration purposes. Please ensure you have proper API access and licensing for production use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

**Note**: This application is designed for demonstration purposes. For production use, please implement proper security measures, database persistence, and error handling.
