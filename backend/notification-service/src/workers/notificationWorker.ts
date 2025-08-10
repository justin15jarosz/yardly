import amqp from 'amqplib';
import { config } from '../config';
import { Notification, NotificationType } from '../types/notification';
import { sendEmail } from '../services/emailService';
import { sendSms } from '../services/smsService';

const QUEUE_NAME = 'notifications';

export const startWorker = async () => {
  try {
    const connection = await amqp.connect(config.rabbitmqUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('Worker started and waiting for messages');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const notification: Notification = JSON.parse(msg.content.toString());
        console.log('Processing notification:', notification);

        try {
          switch (notification.type) {
            case NotificationType.EMAIL:
              await sendEmail(notification.to, notification.subject || 'Notification', notification.body);
              break;
            case NotificationType.SMS:
              await sendSms(notification.to, notification.body);
              break;
            // Add other notification types here
          }
          channel.ack(msg);
        } catch (error) {
          console.error('Failed to process notification', error);
          // Re-queue the message or send to a dead-letter queue
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error('Worker failed to start', error);
    process.exit(1);
  }
};
