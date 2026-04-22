const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize Express app
const app = express();

// ── MIDDLEWARE ────────────────────────────────────────────────────
// Parse incoming JSON data (so req.body works)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from the frontend (running on a different port)
app.use(cors());

// Serve uploaded files as static assets
app.use('/uploads', express.static(uploadsDir));

// ── ROUTES ───────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Seed admin user
const User = require('./models/User');
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@sentinel.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@sentinel.com',
        password: 'admin123',
      });
      console.log('✅ Admin user seeded: admin@sentinel.com / admin123');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};
seedAdmin();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sentinel-RTI Backend is running 🚀' });
});

// ── START SERVER ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Sentinel-RTI Backend running on http://localhost:${PORT}`);
  console.log(`   Health check:   http://localhost:${PORT}/api/health`);
  console.log(`   Contact API:    http://localhost:${PORT}/api/contact`);
  console.log(`   Complaints API: http://localhost:${PORT}/api/complaints`);
  console.log(`   Dashboard API:  http://localhost:${PORT}/api/dashboard/stats\n`);
});
