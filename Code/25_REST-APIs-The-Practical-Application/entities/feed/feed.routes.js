import express from 'express';

import {createPost, getPost, getPosts, updatePost, deletePost} from './feed.controller.js';
import {postValidator} from "./feed.validator.js";

const router = express.Router();

router.post('/post', postValidator, createPost);
router.get('/post/:postId', getPost);
router.get('/posts', getPosts);
router.put('/post/:postId', postValidator, updatePost);
router.delete('/post/:postId', deletePost);

export default router;