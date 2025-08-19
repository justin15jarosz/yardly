import express from 'express';
import internalOnly from '../../middlewares/internal.only.js';

const router = express.Router();

router.use(internalOnly);

router.patch('/users/:id/activate', (req, res) => {
  console.log(`User ${req.params.id} activated`);
  res.sendStatus(204);
});

router.get('/users/email/:email', (req, res) => {
  res.json({ userId: 'user-123', status: 'ACTIVE' });
});

export default router;
