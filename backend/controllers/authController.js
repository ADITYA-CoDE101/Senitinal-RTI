const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        phone:   user.phone   || '',
        gender:  user.gender  || 'M',
        address: user.address || '',
        pincode: user.pincode || '',
        state:   user.state   || '',
        isBPL:   user.isBPL  || false,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, gender, address, pincode, state, isBPL } = req.body;

    const user = await User.create({
      name, email, password,
      phone:   phone   || '',
      gender:  gender  || 'M',
      address: address || '',
      pincode: pincode || '',
      state:   state   || '',
      isBPL:   isBPL   || false,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        phone:   user.phone,
        gender:  user.gender,
        address: user.address,
        pincode: user.pincode,
        state:   user.state,
        isBPL:   user.isBPL,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { login, getMe, register };

