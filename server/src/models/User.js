const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['citizen', 'university', 'industry', 'government', 'admin'],
      default: 'citizen',
    },
    phone: { type: String, trim: true },
    organization: {
      name: { type: String, trim: true },
      type: { type: String, trim: true },
      address: { type: String, trim: true },
      contactPerson: { type: String, trim: true },
    },
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0 },

    settings: {
      notifications: {
        challengeUpdates: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true },
        collaborationRequests: { type: Boolean, default: true },
        systemNotifications: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: false },
      },
      privacy: {
        profileVisibility: { type: String, enum: ['public', 'anonymous'], default: 'public' },
        showContactInfo: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);