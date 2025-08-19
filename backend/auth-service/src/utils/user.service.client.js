import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.USER_SERVICE_URL;
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-internal-token': INTERNAL_TOKEN,
  },
});

class UserServiceClient {
  async markUserActive(userId) {
    await client.patch(`/users/${userId}/activate`);
  }

  async getUserByEmail(email) {
    const res = await client.get('/users/by-email', { params: email });
    return res.data.user;
  }
};

export default new UserServiceClient();
