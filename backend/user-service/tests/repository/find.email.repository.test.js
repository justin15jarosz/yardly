import UserRepository from "../../src/repository/user.repository.js";
import db from "../../src/config/database.js";

jest.mock("../../src/config/database.js");

describe("Find By Email - Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';

    it('should return user', async () => {
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
