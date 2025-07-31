# Portfolio Management System

A comprehensive portfolio management application built for the Emerging Talent Training Program. This project demonstrates modern web development practices with a Next.js frontend and a Next.js + Prisma backend.

## 🚀 Features

- **Portfolio Management**: Track and manage investment portfolios
- **Stock Monitoring**: Real-time stock data and watchlist functionality
- **Performance Analytics**: Visual charts and performance insights
- **Order Management**: Buy/sell orders with transaction history
- **User Dashboard**: Personalized user interface with portfolio overview
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: Next.js 15.4.4 (API Routes)
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Testing**: Jest
- **Environment**: Node.js

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** database server
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd emerging-talent-final-project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Create a `.env` file in the `backend` folder with the following content:

```env
DATABASE_URL="mysql://[username]:[password]@[host]:[port]/portfolio"
TEST_DATABASE_URL="mysql://[username]:[password]@[host]:[port]/portfolio_test"
```

Replace `[username]`, `[password]`, `[host]`, and `[port]` with your MySQL database credentials.

```bash
# Generate Prisma client
npx prisma generate

# Push database schema (Optional)
npx prisma db push

# Build the project
npm run build

# Start the development server
npm run dev
```

The backend will be available at `http://localhost:3500`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:users
npm run test:stocks
npm run test:orders
npm run test:login
```

For detailed testing information, see [backend/TEST_README.md](backend/TEST_README.md)

## 📚 API Documentation

The backend provides RESTful APIs for portfolio management:

- **Users**: User management and authentication
- **Stocks**: Stock data and market information
- **Orders**: Buy/sell order management
- **Portfolio**: Portfolio holdings and performance
- **Watchlist**: Stock watchlist functionality

API documentation is available via Swagger at `http://localhost:3500/api-docs` when the backend is running.

## 🏗️ Project Structure

```
emerging-talent-final-project/
├── backend/                 # Backend API server
│   ├── pages/api/v1/       # API routes
│   ├── prisma/             # Database schema and migrations
│   ├── __tests__/          # Test files
│   └── lib/                # Utility functions
├── frontend/               # Frontend application
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
└── scripts/                # Deployment scripts
```

## 🚀 Deployment

### Production Deployment

#### Backend Deployment

```bash
cd backend
npm run build
npm start
```

Or use the provided script:
```bash
sh start.sh
```

#### Frontend Deployment

```bash
cd frontend
npm run build
npm start
```

Or use the provided script:
```bash
sh start.sh
```

## 👥 Team

**Group No. 9 - Speed**

- **Angus Gan** - Team Member
- **Bendrey Zheng** - Team Member  
- **Cathy Xu** - Team Member
- **Ethan Guo** - Team Member
- **Subati** - Team Member


## 📄 License

This project is part of the HSBC Emerging Talent Training Program.

## 🤝 Contributing

This is a training project for the HSBC Emerging Talent Program. For questions or issues, please contact the development team.

## 📖 Additional Documentation

- [API Integration Guide](frontend/API_INTEGRATION_README.md)
- [Portfolio API Integration](frontend/PORTFOLIO_API_INTEGRATION.md)
- [Backend API Documentation](backend/API_README.md)
- [Project Specification](Specification.md)
