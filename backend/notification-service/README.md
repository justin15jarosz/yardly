Responsibilities:

- Deliver notifications (email, SMS, push) for events: new booking, message, review, quote
- Throttling and batching of notifications

Technology:

- Node.js workers
- RabbitMQ or Kafka for asynchronous processing of events
- Integration with transactional email (SendGrid/Mailgun), SMS (Twilio), and push (FCM/APNs)

Communication:

- Consumes events from message bus
- REST API to query notification history/status
