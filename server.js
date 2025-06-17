require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Backend is working ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});