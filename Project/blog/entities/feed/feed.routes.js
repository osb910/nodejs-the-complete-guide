import express from 'express';

import {createPost, getPost, getPosts, updatePost, deletePost} from './feed.controller.js';
import {postValidator} from "./feed.validator.js";
import {isAuth} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post('/post', isAuth, postValidator, createPost);
router.get('/post/:postId', isAuth, getPost);
router.get('/posts', isAuth, getPosts);
router.put('/post/:postId', isAuth, postValidator, updatePost);
router.delete('/post/:postId', isAuth, deletePost);

export default router;