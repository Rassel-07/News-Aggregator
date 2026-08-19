const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    avatar: {
      type: String,
      default: ''
    },
    preferences: {
      categories: {
        type: [String],
        default: ['Technology', 'AI', 'World', 'Science', 'Business']
      },
      countries: {
        type: [String],
        default: ['US', 'GB', 'IN']
      },
      languages: {
        type: [String],
        default: ['en']
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      }
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
