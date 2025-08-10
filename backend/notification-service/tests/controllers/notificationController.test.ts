import { getMockReq, getMockRes } from '@jest-mock/express';
import { sendNotification } from '../../src/controllers/notificationController';
import { publishToQueue } from '../../src/queues/notificationQueue';
import { NotificationType } from '../../src/types/notification';

jest.mock('../../src/queues/notificationQueue');

describe('Notification Controller', () => {
  it('should return 202 and call publishToQueue', () => {
    const req = getMockReq({
      body: {
        type: NotificationType.EMAIL,
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test body',
      },
    });
    const { res } = getMockRes();

    sendNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(publishToQueue).toHaveBeenCalledWith({
      type: NotificationType.EMAIL,
      to: 'test@example.com',
      subject: 'Test',
      body: 'Test body',
    });
  });

  it('should return 400 for invalid request', () => {
    const req = getMockReq({
      body: {},
    });
    const { res } = getMockRes();

    sendNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
