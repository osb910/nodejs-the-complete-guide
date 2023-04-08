import {body} from "express-validator";
import User from "./user.model.js";

const signupValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 5})
        .withMessage('Password must be at least 5 characters long.'),
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please enter a name.'),
    body('status')
        .trim()
        // .not()
        // .isEmpty()
        // .withMessage('Please enter a status.'),
];

const loginValidator = [
    body('email')
];

export {signupValidator, loginValidator};