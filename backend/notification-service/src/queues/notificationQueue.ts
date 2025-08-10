import amqp from 'amqplib';
import { config } from '../config';
import { Notification } from '../types/notification';

const QUEUE_NAME = 'notifications';

let channel: amqp.Channel;

export const connectQueue = async () => {
  try {
    const connection = await amqp.connect(config.rabbitmqUrl);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    process.exit(1);
  }
};

export const publishToQueue = (notification: Notification) => {
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(notification)), { persistent: true });
};
