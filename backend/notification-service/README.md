# Notification Service

This service is responsible for sending notifications (email, SMS, push) to users.

## Getting Started

### Prerequisites

- Node.js
- Docker
- RabbitMQ

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file by copying the `.env.example` file and fill in the required values.
4. Start the service: `npm start`

### API

**POST /send**

Sends a notification.

**Request Body**

```json
{
  "type": "email", // or "sms"
  "to": "recipient@example.com", // or phone number for SMS
  "subject": "Optional subject for email",
  "body": "The message to send"
}
```

### Running with Docker

1. Build the image: `docker build -t notification-service .`
2. Run the container: `docker run -p 3000:3000 notification-service`