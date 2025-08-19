import express from 'express';
import internalOnly from '../../middlewares/internal.only.js';
import UserRepository from '../../repository/user.repository.js';

const router = express.Router();

router.use(internalOnly);

router.patch('/users/:id/activate', async (req, res) => {
  const user_id = req.params.id;
  await UserRepository.verifyUser(user_id);
  res.sendStatus(204);
});

router.get('/users/by-email', async (req, res) => {
  const { email } = req.query;

  console.log("Email is:", email);
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = await UserRepository.findByEmail(email);
  console.log("User found:", user);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User found', user });
});

export default router;
