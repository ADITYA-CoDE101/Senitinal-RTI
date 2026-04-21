const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    // Profile info — used to auto-fill RTI portal submissions
    phone:   { type: String, default: '' },
    gender:  { type: String, enum: ['M', 'F', 'O'], default: 'M' },
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    state:   { type: String, default: '' },
    isBPL:   { type: Boolean, default: false },
    // RTI Online Portal (rtionline.gov.in) credentials — stored AES-256 encrypted
    rtiPortalCredentials: {
      username: { type: String, select: false }, // encrypted
      password: { type: String, select: false }, // encrypted
      savedAt:  { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
