import {model, Schema} from 'mongoose';
import {genSalt, hash, compare} from 'bcrypt';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    // required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: [],
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const existingUser = await this.constructor.findOne({email: this.email});
    if (existingUser) {
      const error = new Error('Email already in use.');
      error.statusCode = 409;
      throw error;
    }
    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

const User = model('User', userSchema);

export default User;
