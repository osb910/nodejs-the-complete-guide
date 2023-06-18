import {expect} from 'chai';
import authMiddleware from '../middleware/is-auth.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    const req = {
      get: () => null,
    };
    expect(() => authMiddleware(req, {}, () => {})).to.throw(
      'Not Authenticated.'
    );
  });

  it('should throw an error if the authorization header is only one string', () => {
    const req = {
      get: () => 'abc',
    };

    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });

  it('should throw an error if the token cannot be verified', () => {
    const req = {
      get: () => 'Bearer abc',
    };
    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', () => {
    const req = {
      get: () => 'Bearer djfk',
    };
    expect(() => authMiddleware(req, {}, () => {})).to.have.property('userId');
  });
});
