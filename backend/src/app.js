const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const lawnRoutes = require('./routes/lawns');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from the Yardly backend!');
});

app.use('/api/lawns', lawnRoutes);

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
