import db from "../config/database.js";
import Address from "../models/address.js";

class AddressRepository {
    // Create new user address
    static async create(user_id, addressRequest, is_primary) {
        const { address_line1,
            address_line2,
            city,
            state,
            zip,
            country } = addressRequest;

        try {
            const query = `
        INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country, is_primary)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING address_id, user_id, address_line1, address_line2, city, state, postal_code, country, is_primary
      `;

            const result = await db.query(query, [user_id, address_line1, address_line2, city, state, zip, country, is_primary]);
            return new Address(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    // Get Addresses By User Id
    static async getAddressesByUserId(user_id) {
        try {
            const query = `
        SELECT address_id, address_line1, address_line2, city, state, postal_code, country, is_primary
        FROM addresses
        WHERE user_id = $1
      `;

            const result = await db.query(query, [user_id]);
            return result.rows.map(row => new Address(row));
        } catch (error) {
            throw error;
        }
    }
}

export default AddressRepository;
