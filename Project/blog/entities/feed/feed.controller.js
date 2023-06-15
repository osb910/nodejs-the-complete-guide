import path from 'path';
import {deleteFile} from '../../utils/file.js';
import rootDir from '../../utils/path.js';
import {getValidationErrors} from '../../utils/validation-errors.js';
import Post from '../post/post.model.js';
import User from '../user/user.model.js';

const createPost = async (req, res, next) => {
  const {invalid, errors} = getValidationErrors(req);
  let message = invalid
    ? 'Validation failed, entered data is incorrect.'
    : !req.file
    ? 'No image provided.'
    : 'Post created successfully!';
  if (invalid || !req.file) {
    const error = new Error(message);
    error.statusCode = 422;
    throw error;
  }
  const {title, content} = req.body;
  const imageUrl = req.file.path;
  const post = new Post({title, content, imageUrl, creator: req.userId});
  console.log({post});
  try {
    const result = await post.save();
    await User.findByIdAndUpdate(req.userId, {$push: {posts: result._id}});
    res.status(201).json({message, post: result});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const getPost = async (req, res, next) => {
  const {postId} = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message: 'Post fetched.', post});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  const {page} = req.query || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .skip((page - 1) * perPage)
      .limit(perPage);
    if (!posts) {
      const error = new Error('Could not find posts.');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({message: 'Fetched posts!', posts, totalItems});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  const {postId} = req.params;
  const {invalid, errors} = getValidationErrors(req);
  let {imageUrl} = req.body;
  if (req.file) imageUrl = req.file.path;
  let message = invalid
    ? 'Validation failed, entered data is incorrect.'
    : !imageUrl
    ? 'No image provided.'
    : 'Post updated successfully!';
  if (invalid || !imageUrl) {
    const error = new Error(message);
    error.statusCode = 422;
    throw error;
  }
  const {title, content} = req.body;
  try {
    const post = await Post.findById(postId).populate('creator');
    // Check logged in user
    if (post.creator.toString() !== req.userId?.toString()) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      title,
      content,
      imageUrl,
    });
    if (!updatedPost) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (imageUrl !== updatedPost.imageUrl)
      deleteFile(path.join(rootDir(), updatedPost.imageUrl));
    res.status(200).json({message, post: updatedPost});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  const {postId} = req.params;
  try {
    const post = await Post.findById(postId).populate('creator');
    // Check logged in user
    if (post.creator.toString() !== req.userId?.toString()) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    deleteFile(path.join(rootDir(), post.imageUrl));
    const deletedPost = await Post.findByIdAndRemove(postId);
    await User.findByIdAndUpdate(req.userId, {$pull: {posts: postId}});
    res.status(200).json({message: 'Deleted post.', post: deletedPost});
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export {createPost, getPost, getPosts, updatePost, deletePost};
