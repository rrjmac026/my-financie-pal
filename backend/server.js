const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8081',
  'https://my-financie-pal-1.onrender.com'
];

if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/debts', require('./routes/debts'));
app.use('/api/wallets', require('./routes/wallets'));
app.use('/api/savings', require('./routes/savings'));
app.use('/api/categories', require('./routes/categories'));

app.get('/', (req, res) => res.send('BudgetTracker API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));