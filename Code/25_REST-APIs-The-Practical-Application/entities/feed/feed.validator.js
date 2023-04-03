import {body} from 'express-validator';

const postValidator = [
    body('title')
        .trim()
        .isLength({min: 5})
        .withMessage('Title must be at least 5 characters long')
        .isLength({max: 100}),
    body('content')
        .trim()
        .isLength({min: 5})
        .withMessage('Content must be at least 5 characters long')
        .isLength({max: 256})
        .withMessage('Content must be at most 200 characters long'),
];

export {postValidator};