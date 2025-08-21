require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authzRoutes = require('./routes/authzRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/authz', authzRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Authorization Service is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Authorization Service running on port ${PORT}`);
});