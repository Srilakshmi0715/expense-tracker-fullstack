# 💰 Expense Tracker - Full Stack Application

A comprehensive expense tracking application built with React frontend and Node.js backend.

## 🚀 Features

### 🔐 Authentication
- User registration with secure password hashing
- JWT token-based authentication
- Session management

### 💰 Core Features
- Add/delete transactions
- Budget tracking and management
- Financial goals with progress tracking
- Balance overview and analytics

### 🚀 Advanced Features
- **AI-Powered Insights:** Spending analysis, predictions, and recommendations
- **Transaction Reminders:** Set up payment reminders with notifications
- **Expense Sharing:** Split bills with friends and track settlements
- **Data Import/Export:** Import transactions from CSV/JSON files
- **Currency Converter:** Real-time currency conversion
- **Advanced Analytics:** Monthly trends, daily spending, category comparison
- **Recurring Transactions:** Manage recurring payments
- **Transaction Tags:** Organize expenses with custom tags

### 📊 Reports & Visualization
- Basic charts (pie charts, bar graphs)
- Advanced analytics with Chart.js
- Export functionality
- Custom date ranges

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Chart.js** - Data visualization
- **CSS3** - Styling
- **LocalStorage** - Data persistence (fallback)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **JSON File Storage** - Database
- **CORS** - Cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Srilakshmi0715/expense-tracker-fullstack.git
   cd expense-tracker-fullstack
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # Start backend server (Terminal 1)
   cd backend
   node server-simple.js
   
   # Start frontend server (Terminal 2)
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### 1. Create Account
- Register with email and password
- Secure password hashing with bcryptjs

### 2. Login
- Authenticate with JWT tokens
- Session management

### 3. Track Expenses
- Add income and expense transactions
- Categorize transactions
- Add custom tags

### 4. Set Budgets
- Define budget limits by category
- Track spending against budgets

### 5. Financial Goals
- Set savings goals
- Track progress with visual indicators
- Set target dates

### 6. Advanced Features
- **AI Insights:** Get personalized spending recommendations
- **Reminders:** Set up payment notifications
- **Expense Sharing:** Split bills with friends
- **Data Import:** Bulk import from bank statements

## 📁 Project Structure

```
expense-tracker-fullstack/
├── backend/                 # Node.js backend
│   ├── server-simple.js     # Main server file
│   ├── package.json         # Backend dependencies
│   └── data.json           # Database storage
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── App.js              # Main app component
├── public/                 # Static files
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - Get budgets
- `POST /api/budgets` - Set budget

### Goals
- `GET /api/goals` - Get goals
- `POST /api/goals` - Add goal
- `PUT /api/goals/:id` - Update goal

### Reminders
- `GET /api/reminders` - Get reminders
- `POST /api/reminders` - Add reminder

### Shared Expenses
- `GET /api/shared-expenses` - Get shared expenses
- `POST /api/shared-expenses` - Add shared expense

### Data Management
- `GET /api/export` - Export all data
- `POST /api/import` - Import data

## 🎨 Features in Detail

### AI-Powered Insights
- Monthly spending trend analysis
- Category-wise spending breakdown
- Predictive budget recommendations
- Savings rate calculations
- Personalized financial advice

### Transaction Management
- Income and expense tracking
- Custom categories
- Tag-based organization
- Date-based filtering
- Search functionality

### Budget Tracking
- Category-wise budget limits
- Real-time budget utilization
- Overspending alerts
- Visual progress indicators

### Financial Goals
- Multiple goal types
- Progress tracking
- Deadline management
- Achievement notifications

### Data Visualization
- Interactive charts
- Monthly/weekly/daily views
- Category comparison
- Income vs expense analysis

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 🌐 Deployment

### Frontend Deployment
The frontend can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Heroku

### Backend Deployment
The backend can be deployed to:
- Heroku
- AWS Lambda
- Google Cloud Functions
- DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

**Sri Lakshmi Balagani**
- GitHub: [@Srilakshmi0715](https://github.com/Srilakshmi0715)
- Email: balaganisrilakshmi22@gmail.com

---

⭐ **Star this repository if you find it helpful!**
