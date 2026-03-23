require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const connectDatabase = require('./config/database');
const corsOptions = require('./config/cors');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

// Connect to MongoDB
connectDatabase();

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Luxury Watch Store API is running 🚀',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/users.routes'));
app.use('/api/v1/roles', require('./routes/roles.routes'));
app.use('/api/v1/categories', require('./routes/categories.routes'));
app.use('/api/v1/collections', require('./routes/collections.routes'));
app.use('/api/v1/products', require('./routes/products.routes'));
app.use('/api/v1/cart', require('./routes/cart.routes'));
app.use('/api/v1/orders', require('./routes/orders.routes'));
app.use('/api/v1/payments', require('./routes/payments.routes'));
app.use('/api/v1/coupons', require('./routes/coupons.routes'));
app.use('/api/v1/upload', require('./routes/upload.routes'));
app.use('/api/v1/dashboard', require('./routes/dashboard.routes'));

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl}`, 404));
});

// Error handler
app.use(errorHandler);

module.exports = app;
