import {getValidationErrors} from '../../utils/validation-errors.js';
import Post from '../post/post.model.js';
const getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '1',
            title: 'First Post',
            content: 'This is the first post!',
            imageUrl: 'images/duck.webp',
            creator: {name: 'Max'},
            createdAt: new Date()
        }]
    });
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
    const post = new Post({title, content, imageUrl: 'images/duck.webp',
        // creator: req.userId,
    });
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

export {getPosts, createPost};