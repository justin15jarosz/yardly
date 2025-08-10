import twilio from 'twilio';
import { config } from '../config';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export const sendSms = async (to: string, body: string) => {
  try {
    await client.messages.create({
      body,
      from: config.twilio.phoneNumber,
      to,
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}`, error);
  }
};
