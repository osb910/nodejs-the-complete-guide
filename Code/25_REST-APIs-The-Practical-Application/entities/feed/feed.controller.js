import {getValidationErrors} from '../../utils/validation-errors.js';
import Post from '../post/post.model.js';
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        console.log({posts});
        if (!posts) {
            const error = new Error('Could not find posts.');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({message: 'Fetched posts!', posts});
    } catch (err) {
        if (!err.statusCode) (err.statusCode = 500);
        next(err);
    }
};

const createPost = async (req, res, next) => {
    const {invalid, errors} = getValidationErrors(req);
    const message = invalid ? 'Validation failed, entered data is incorrect.' : 'Post created successfully!';
    if (invalid) {
        const error = new Error(message);
        error.statusCode = 422;
        throw error;
    }
    const {title, content} = req.body;
    // Create post in db
    const post = new Post({title, content, imageUrl: 'images/duck.webp', creator: {name: 'Omar'}});
    try {
        const result = await post.save();
        res.status(201).json({
            message, post: result
        });
    } catch (err) {
        if (!err.statusCode) (err.statusCode = 500);
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
        if (!err.statusCode) (err.statusCode = 500);
        next(err);
    }
};

export {getPosts, createPost, getPost};