import express from 'express';

import {getPosts, createPost} from './feed.controller.js';

const router = express.Router();

router.get('/posts', getPosts);
router.post('/post', createPost);

export default router;