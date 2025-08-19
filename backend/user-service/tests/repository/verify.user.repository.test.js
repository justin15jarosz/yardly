import UserRepository from "../../src/repository/user.repository.js";
import db from "../../src/config/database.js";

jest.mock("../../src/config/database.js");

describe("Verify User - Repository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    const mockUserId = '1';
    
    it('should return the updated user when user is found', async () => {
        const mockUser = { user_id: mockUserId, is_verified: true };
        db.query.mockResolvedValue({ rows: [mockUser] });

        const result = await UserRepository.verifyUser(mockUserId);

        expect(db.query).toHaveBeenCalledWith(
            'UPDATE users SET is_verified = TRUE WHERE user_id = $1',
            [mockUserId]
        );
        expect(result).toEqual(mockUser);
    });

    it('should return null when no user is found', async () => {
        db.query.mockResolvedValue({ rows: [] });

        const result = await UserRepository.verifyUser(mockUserId);

        expect(db.query).toHaveBeenCalledWith(
            'UPDATE users SET is_verified = TRUE WHERE user_id = $1',
            [mockUserId]
        );
        expect(result).toBeNull();
    });

    it('should throw an error if db.query fails', async () => {
        const mockError = new Error('Database error');
        db.query.mockRejectedValue(mockError);

        await expect(UserRepository.verifyUser(mockUserId)).rejects.toThrow('Database error');

        expect(db.query).toHaveBeenCalledWith(
            'UPDATE users SET is_verified = TRUE WHERE user_id = $1',
            [mockUserId]
        );
    });
});
