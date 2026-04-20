const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  submitComplaint,
  getComplaints,
  searchComplaint,
  getComplaintById,
  updateComplaintStatus,
} = require('../controllers/complaintController');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPG, PNG, WebP, GIF) and PDFs are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// POST /api/complaints — submit a complaint (with optional image)
router.post('/', upload.single('image'), submitComplaint);

// GET /api/complaints/search?trackingId=SRT-2026-1001
router.get('/search', searchComplaint);

// GET /api/complaints — list all complaints
router.get('/', getComplaints);

// GET /api/complaints/:id — get single complaint
router.get('/:id', getComplaintById);

// PATCH /api/complaints/:id/status — update status
router.patch('/:id/status', updateComplaintStatus);

module.exports = router;
