import dotenv from 'dotenv';

dotenv.config();

export const config = {
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  sendgridApiKey: process.env.SENDGRID_API_KEY,
};
