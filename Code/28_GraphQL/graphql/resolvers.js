import validator from 'validator';
import {compare} from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../entities/user/user.model.js';
import Post from '../entities/post/post.model.js';
import {clearImage} from '../utils/file.js';

const createUser = async ({userInput}, req) => {
  console.log(req);
  const {name, email, password} = userInput;
  const errors = [];
  !validator.isEmail(email) && errors.push({message: 'Email is invalid.'});
  (validator.isEmpty(password) || !validator.isLength(password, {min: 5})) &&
    errors.push({message: 'Password too short.'});
  if (errors.length > 0) {
    const error = new Error('Invalid input.');
    error.data = errors;
    error.code = 422;
    throw error;
  }
  const user = new User({name, email, password});
  try {
    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  } catch (err) {
    throw err;
  }
};

const login = async ({email, password}) => {
  const user = await User.findOne({email});
  if (!user) {
    const error = new Error('User not found.');
    error.code = 401;
    throw error;
  }
  const isEqual = await compare(password, user.password);
  if (!isEqual) {
    const error = new Error('Password is incorrect.');
    error.code = 401;
    throw error;
  }
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    'somesupersecretsecret',
    {expiresIn: '1h'}
  );
  return {token, userId: user._id.toString()};
};

const createPost = async ({postInput}, req) => {
  console.log(req);
  if (!req.isAuth) {
    const error = new Error('Not authenticated.');
    error.code = 401;
    throw error;
  }
  const {title, content, imageUrl} = postInput;
  const errors = [];
  (validator.isEmpty(title) || !validator.isLength(title, {min: 5})) &&
    errors.push({message: 'Title is invalid.'});
  (validator.isEmpty(content) || !validator.isLength(title, {min: 5})) &&
    errors.push({message: 'Content is invalid.'});
  console.log(errors);
  if (errors.length > 0) {
    const error = new Error('Invalid input.');
    error.data = errors;
    error.code = 422;
    throw error;
  }
  const user = await User.findById(req.userId);
  if (!user) {
    const error = new Error('Invalid user.');
    error.code = 401;
    throw error;
  }
  const post = new Post({title, content, imageUrl, creator: user});
  try {
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  } catch (err) {
    throw err;
  }
};

const posts = async ({page}, req) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated.');
    error.code = 401;
    throw error;
  }
  if (!page) page = 1;
  const perPage = 2;
  const totalPosts = await Post.find().countDocuments();
  const posts = await Post.find()
    .sort({createdAt: -1})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate('creator');
  return {
    posts: posts.map(p => ({
      ...p._doc,
      _id: p._id.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    totalPosts,
  };
};

const post = async ({id}, req) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated.');
    error.code = 401;
    throw error;
  }
  const post = await Post.findById(id).populate('creator');
  if (!post) {
    const error = new Error('Post not found.');
    error.code = 404;
    throw error;
  }

  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

const updatePost = async ({id, postInput}, req) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated.');
    error.code = 401;
    throw error;
  }
  const post = await Post.findById(id).populate('creator');
  if (!post) {
    const error = new Error('Post not found.');
    error.code = 404;
    throw error;
  }
  if (post.creator._id.toString() !== req.userId.toString()) {
    const error = new Error('Not authorized.');
    error.code = 403;
    throw error;
  }
  const {title, content, imageUrl} = postInput;
  const errors = [];
  (validator.isEmpty(title) || !validator.isLength(title, {min: 5})) &&
    errors.push({message: 'Title is invalid.'});
  (validator.isEmpty(content) || !validator.isLength(title, {min: 5})) &&
    errors.push({message: 'Content is invalid.'});
  console.log(errors);
  if (errors.length > 0) {
    const error = new Error('Invalid input.');
    error.data = errors;
    error.code = 422;
    throw error;
  }
  post.title = title;
  post.content = content;
  if (imageUrl !== 'undefined') {
    post.imageUrl = imageUrl;
  }
  const updatedPost = await post.save();
  return {
    ...updatedPost._doc,
    _id: updatedPost._id.toString(),
    createdAt: updatedPost.createdAt.toISOString(),
    updatedAt: updatedPost.updatedAt.toISOString(),
  };
};

const deletePost = async ({id}, req) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated.');
    error.code = 401;
    throw error;
  }
  const post = await Post.findById(id);
  if (!post) {
    const error = new Error('Post not found.');
    error.code = 404;
    throw error;
  }
  if (post.creator.toString() !== req.userId.toString()) {
    const error = new Error('Not authorized.');
    error.code = 403;
    throw error;
  }
  await clearImage(post.imageUrl);
  await Post.findByIdAndRemove(id);
  const user = await User.findById(req.userId);
  user.posts.pull(id);
  await user.save();
  return true;
};

const user = async (args, req) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated.');
    error.code = 401;
    throw error;
  }
  const user = await User.findById(req.userId);
  if (!user) {
    const error = new Error('User not found.');
    error.code = 404;
    throw error;
  }
  return {
    ...user._doc,
    _id: user._id.toString(),
  };
};

const updateStatus = async ({status}, req) => {
  if (!req.isAuth) {
    const error = new Error('Not authenticated.');
    error.code = 401;
    throw error;
  }

  const user = await User.findById(req.userId);
  if (!user) {
    const error = new Error('User not found.');
    error.code = 404;
    throw error;
  }

  user.status = status;
  await user.save();
  return {
    ...user._doc,
    _id: user._id.toString(),
  };
};

export {
  createUser,
  login,
  createPost,
  posts,
  post,
  updatePost,
  deletePost,
  user,
  updateStatus,
};
