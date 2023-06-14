import User from './user.model.js';
import {getValidationErrors} from '../../utils/validation-errors.js';
import jwt from 'jsonwebtoken';
const signup = async (req, res, next) => {
  const {email, password, name, status} = req.body;
  const {invalid, errors} = getValidationErrors(req);
  let message = invalid
    ? 'Validation failed, entered data is incorrect.'
    : 'User created successfully!';
  if (invalid) {
    const error = new Error(message);
    error.statusCode = 422;
    error.data = errors;
    throw error;
  }
  const user = new User({email, password, name, status});
  try {
    const result = await user.save();
    res.status(201).json({message, user: result});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const login = async (req, res, next) => {
  const {email, password} = req.body;
  const {invalid, errors} = getValidationErrors(req);
  let message = invalid
    ? 'Validation failed, entered data is incorrect.'
    : 'User logged in successfully!';
  if (invalid) {
    const error = new Error(message);
    error.statusCode = 422;
    error.data = errors;
    throw error;
  }
  try {
    const user = await User.findOne({email});
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await user.comparePassword(password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      'secret',
      {expiresIn: '1h'}
    );
    res.status(200).json({message, user, token, userId: user._id.toString()});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const getUserStatus = async (req, res, next) => {
  const {userId} = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({message: 'User status fetched.', status: user.status});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    const result = await user.save();
    res.status(200).json({message: 'User status updated.', user: result});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export {signup, login, getUserStatus, updateUserStatus};
