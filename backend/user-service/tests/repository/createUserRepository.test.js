import UserRepository from "../../src/repository/userRepository";
import db from "../../src/config/database";
import User from '../../src/models/user.js';

jest.mock('../../src/config/database.js');
jest.mock('../../src/models/user.js');

describe('Create User - UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should insert a new user and return a User instance', async () => {
      const mockResult = { rows: [{ user_id: 1, ...userData }] };
      db.query.mockResolvedValue(mockResult);
      User.mockImplementation((data) => data);

      const result = await UserRepository.create(userData);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), [
        userData.email,
        userData.name,
        false, // is_verified default value
      ]);
      expect(result).toEqual(expect.objectContaining(userData));
    });

    it('should throw error if DB insert fails', async () => {
      const error = new Error('DB insert failed');
      db.query.mockRejectedValue(error);

      await expect(UserRepository.create(userData)).rejects.toThrow(error);
    });
  });
});
