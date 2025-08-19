import {
  validatePassword,
  validateLogin
} from '../../src/utils/validate.auth.js';

describe('Auth Validation Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('validatePassword', () => {
    it('should return error if password is missing', () => {
      req.body = {};
      validatePassword(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Password is required" });
    });

    it('should return error if password is too short', () => {
      req.body = { password: '123' };
      validatePassword(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Password must be at least 6 characters long" });
    });

    it('should call next for valid password', () => {
      req.body = { password: 'secure123' };
      validatePassword(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateLogin', () => {
    it('should return error if email or password is missing', () => {
      req.body = { email: '', password: '' };
      validateLogin(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Email and password are required" });
    });

    it('should return error for invalid email', () => {
      req.body = { email: 'bademail', password: '123456' };
      validateLogin(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid email format" });
    });

    it('should call next for valid credentials', () => {
      req.body = { email: 'user@example.com', password: 'password123' };
      validateLogin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
