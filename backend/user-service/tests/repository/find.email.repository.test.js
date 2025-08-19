import UserRepository from "../../src/repository/user.repository.js";
import db from "../../src/config/database.js";

jest.mock("../../src/config/database.js");

describe("Find By Email - Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';

    it('should return user without password if includePassword is false', async () => {
      const userRow = {
        user_id: 1,
        email,
        name: 'Test User',
        created_at: new Date(),
        is_verified: true
      };
      db.query.mockResolvedValue({ rows: [userRow] });

      const result = await UserRepository.findByEmail(email);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT user_id, email, name'), [email]);
      expect(result).toEqual(userRow);
    });

    it('should return user with password if includePassword is true', async () => {
      const userRow = {
        user_id: 1,
        email,
        password: 'hashed',
        name: 'Test User',
        created_at: new Date(),
        is_verified: true
      };
      db.query.mockResolvedValue({ rows: [userRow] });

      const result = await UserRepository.findByEmail(email, true);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT user_id, email, password'), [email]);
      expect(result).toEqual(userRow);
    });

    it('should return null if no user found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await UserRepository.findByEmail(email);

      expect(result).toBeNull();
    });

    it('should throw error if DB select fails', async () => {
      const error = new Error('DB select failed');
      db.query.mockRejectedValue(error);

      await expect(UserRepository.findByEmail(email)).rejects.toThrow(error);
    });
  });
});
