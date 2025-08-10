import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: config.sendgridApiKey,
  },
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    await transporter.sendMail({
      from: '"Yardly" <noreply@yardly.com>',
      to,
      subject,
      html: body,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}`, error);
  }
};
