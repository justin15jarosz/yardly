import express from 'express';
import { json } from 'body-parser';
import { sendNotification } from './controllers/notificationController';
import { connectQueue } from './queues/notificationQueue';
import { startWorker } from './workers/notificationWorker';

const app = express();
app.use(json());

const PORT = process.env.PORT || 3000;

// Routes
app.post('/send', sendNotification);

// Start the server and services
const start = async () => {
  await connectQueue();
  await startWorker();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
