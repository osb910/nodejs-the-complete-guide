import express from 'express';

import {getPosts, createPost} from './feed.controller.js';
import {postValidator} from "./feed.validator.js";

const router = express.Router();

router.get('/posts', getPosts);
router.post('/post', postValidator, createPost);

export default router;