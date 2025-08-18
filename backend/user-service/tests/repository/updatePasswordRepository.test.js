import UserRepository from "../../src/repository/userRepository";
import db from "../../src/config/database";
import User from '../../src/models/user.js';
import bcrypt from 'bcrypt';

jest.mock('../../src/config/database.js');
jest.mock('../../src/models/user.js');
jest.mock('bcrypt');

describe("Update Password - Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

describe('updatePassword', () => {
    const email = 'test@example.com', password = 'newpassword123';

    it('should hash password, update user, and return a User instance', async () => {
      const hashed = 'hashedPassword';
      const mockResult = {
        rows: [{
          user_id: 1,
          email: email,
          name: 'Test User',
          created_at: new Date(),
          is_verified: true
        }]
      };

      bcrypt.hash.mockResolvedValue(hashed);
      db.query.mockResolvedValue(mockResult);
      User.mockImplementation((data) => data);

      const result = await UserRepository.updatePassword(email, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'), [hashed, email]);
      expect(result).toEqual(expect.objectContaining({ email: email }));
    });

    it('should throw error if DB update fails', async () => {
      const error = new Error('DB update failed');
      bcrypt.hash.mockResolvedValue('hashed');
      db.query.mockRejectedValue(error);

      await expect(UserRepository.updatePassword(email, password)).rejects.toThrow(error);
    });
  });
});