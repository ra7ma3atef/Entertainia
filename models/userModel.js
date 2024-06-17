const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
      select:false,
    },
    favEvent:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event'
  }],
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    Booking:{
      type:Number,
      default:0
    },
    Review:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.generateToken = function (id) {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN
  });
}

userSchema.methods.correctPassword = async function (candidatepassword, userpassword) {
  return await bcrypt.compare(candidatepassword, userpassword)
}

const autoPopulateFavEvent = function(next) {
  this.populate({
    path: 'favEvent',
    select: 'imageCover title price from to'
  });
  next();
};

userSchema.pre('find', autoPopulateFavEvent); 
userSchema.pre('findOne', autoPopulateFavEvent);

const User = mongoose.model('User', userSchema);

module.exports = User;
