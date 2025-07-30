const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const chatSubSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
  },
  chatsystem: {
    type: String,
    default: '',
  },
  chatuser: {
    type: String,
    default: '',
  }
}, { _id: false }); // Prevent Mongoose from auto-generating _id for subdocs

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customerId: {
    type: String,
    default: '',
  },
  subscription: {
    type: String,
    default: '',
  },
  chat: [chatSubSchema],
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);