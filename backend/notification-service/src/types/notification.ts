export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export interface Notification {
  type: NotificationType;
  to: string;
  subject?: string;
  body: string;
  data?: { [key: string]: string };
}
