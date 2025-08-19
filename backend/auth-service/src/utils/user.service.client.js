import axios from 'axios';

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
    const res = await client.get(`/users/email/${email}`);
    return res.data;
  }
};

export default new UserServiceClient();
