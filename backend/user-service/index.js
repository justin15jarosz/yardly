const express = require('express');
const userRoutes = require('./src/routes/users');

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

module.exports = app;
