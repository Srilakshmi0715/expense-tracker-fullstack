const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'your-secret-key-here';

// Data storage (using JSON files for simplicity)
const DB_FILE = path.join(__dirname, 'data.json');

// Initialize database file
let db = {
  users: [],
  transactions: [],
  budgets: [],
  goals: [],
  reminders: [],
  sharedExpenses: []
};

// Load data from file
function loadData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
    } else {
      // Create initial data file
      saveData();
    }
  } catch (error) {
    console.log('Error loading data:', error.message);
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.log('Error saving data:', error.message);
  }
}

// Load initial data
loadData();

// Helper functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    saveData();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Transaction Routes
app.get('/api/transactions', authenticateToken, (req, res) => {
  try {
    const transactions = db.transactions.filter(t => t.userId === req.user.userId);
    res.json(transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const transaction = {
      id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    
    db.transactions.push(transaction);
    saveData();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  try {
    const index = db.transactions.findIndex(t => t.id === req.params.id && t.userId === req.user.userId);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    db.transactions.splice(index, 1);
    saveData();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Budget Routes
app.get('/api/budgets', authenticateToken, (req, res) => {
  try {
    const budgets = db.budgets.filter(b => b.userId === req.user.userId);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/budgets', authenticateToken, (req, res) => {
  try {
    const budget = {
      id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    
    db.budgets.push(budget);
    saveData();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Goals Routes
app.get('/api/goals', authenticateToken, (req, res) => {
  try {
    const goals = db.goals.filter(g => g.userId === req.user.userId);
    res.json(goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/goals', authenticateToken, (req, res) => {
  try {
    const goal = {
      id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    
    db.goals.push(goal);
    saveData();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/goals/:id', authenticateToken, (req, res) => {
  try {
    const index = db.goals.findIndex(g => g.id === req.params.id && g.userId === req.user.userId);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    db.goals[index] = { ...db.goals[index], ...req.body };
    saveData();
    res.json(db.goals[index]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reminders Routes
app.get('/api/reminders', authenticateToken, (req, res) => {
  try {
    const reminders = db.reminders.filter(r => r.userId === req.user.userId);
    res.json(reminders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/reminders', authenticateToken, (req, res) => {
  try {
    const reminder = {
      id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    
    db.reminders.push(reminder);
    saveData();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Shared Expenses Routes
app.get('/api/shared-expenses', authenticateToken, (req, res) => {
  try {
    const sharedExpenses = db.sharedExpenses.filter(se => se.userId === req.user.userId);
    res.json(sharedExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/shared-expenses', authenticateToken, (req, res) => {
  try {
    const sharedExpense = {
      id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    
    db.sharedExpenses.push(sharedExpense);
    saveData();
    res.status(201).json(sharedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Data export/import routes
app.get('/api/export', authenticateToken, (req, res) => {
  try {
    const userData = {
      transactions: db.transactions.filter(t => t.userId === req.user.userId),
      budgets: db.budgets.filter(b => b.userId === req.user.userId),
      goals: db.goals.filter(g => g.userId === req.user.userId),
      reminders: db.reminders.filter(r => r.userId === req.user.userId),
      sharedExpenses: db.sharedExpenses.filter(se => se.userId === req.user.userId),
      exportDate: new Date().toISOString()
    };
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/import', authenticateToken, (req, res) => {
  try {
    const { transactions, budgets, goals, reminders, sharedExpenses } = req.body;
    
    // Import transactions
    if (transactions && Array.isArray(transactions)) {
      transactions.forEach(t => {
        db.transactions.push({
          id: generateId(),
          ...t,
          userId: req.user.userId,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    // Import budgets
    if (budgets && Array.isArray(budgets)) {
      budgets.forEach(b => {
        db.budgets.push({
          id: generateId(),
          ...b,
          userId: req.user.userId,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    // Import goals
    if (goals && Array.isArray(goals)) {
      goals.forEach(g => {
        db.goals.push({
          id: generateId(),
          ...g,
          userId: req.user.userId,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    // Import reminders
    if (reminders && Array.isArray(reminders)) {
      reminders.forEach(r => {
        db.reminders.push({
          id: generateId(),
          ...r,
          userId: req.user.userId,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    // Import shared expenses
    if (sharedExpenses && Array.isArray(sharedExpenses)) {
      sharedExpenses.forEach(se => {
        db.sharedExpenses.push({
          id: generateId(),
          ...se,
          userId: req.user.userId,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    saveData();
    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Data stored in: ${DB_FILE}`);
});
