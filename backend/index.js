require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('../../backend/config/db');
const { addTOwaitlist } = require('../../backend/controller/waitListController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
dbConnect();

// Routes
app.post('/api/waitlist', addTOwaitlist);


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
