import {validationResult} from 'express-validator';

const getValidationErrors = (req) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array();
        return {invalid: true, errors};
    }
    return {invalid: false, errors: []};
};

export {getValidationErrors};