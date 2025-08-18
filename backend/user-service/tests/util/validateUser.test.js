import {
  requestLogger,
  validateUser,
  validatePassword,
  validateLogin,
  validateUUID,
} from '../../src/util/validateUser.js';

describe('User Validation Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('requestLogger', () => {
    it('should log request method and path and call next', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      req.method = 'GET';
      req.path = '/api/test';

      requestLogger(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('GET /api/test'));
      expect(next).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('validateUser', () => {
    it('should return error if name or email is missing', () => {
      req.body = {};
      validateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Name and Email are required" });
    });

    it('should return error if name is too short', () => {
      req.body = { name: 'A', email: 'test@example.com' };
      validateUser(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Name must be at least 2 characters long" });
    });

    it('should return error if name is too long', () => {
      req.body = { name: 'A'.repeat(101), email: 'test@example.com' };
      validateUser(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Name cannot exceed 100 characters" });
    });

    it('should return error for invalid email', () => {
      req.body = { name: 'John', email: 'invalidemail' };
      validateUser(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid email format" });
    });

    it('should call next for valid input', () => {
      req.body = { name: 'John Doe', email: 'john@example.com' };
      validateUser(req, res, next);
      expect(next).toHaveBeenCalled();
    });
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

  describe('validateUUID', () => {
    it('should return error for invalid UUID', () => {
      req.params = { user_id: 'invalid-uuid' };
      validateUUID(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid user ID format" });
    });

    it('should call next for valid UUID', () => {
      req.params = { user_id: '123e4567-e89b-12d3-a456-426614174000' };
      validateUUID(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
