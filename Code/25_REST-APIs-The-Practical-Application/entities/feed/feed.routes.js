import express from 'express';

import {createPost, getPost, getPosts} from './feed.controller.js';
import {postValidator} from "./feed.validator.js";

const router = express.Router();

router.post('/post', postValidator, createPost);
router.get('/post/:postId', getPost);
router.get('/posts', getPosts);

export default router;