import { Request, Response } from 'express';
import { publishToQueue } from '../queues/notificationQueue';
import { Notification } from '../types/notification';

export const sendNotification = (req: Request, res: Response) => {
  const notification: Notification = req.body;

  // Basic validation
  if (!notification.type || !notification.to || !notification.body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  publishToQueue(notification);

  res.status(202).json({ message: 'Notification request received' });
};
