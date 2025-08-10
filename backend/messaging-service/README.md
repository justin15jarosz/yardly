Responsibilities:

- Real-time chat between customers and businesses
- Chat history persistence and message delivery guarantees
- Push notifications for new messages

Technology:

- Node.js with Socket.io (WebSocket fallback)
- PostgreSQL for message history (or a document store like MongoDB for flexibility)
- Redis for presence/room management and pub/sub

Communication:

- WebSockets (Socket.io) to clients
- REST for message history retrieval
- Publish message.sent events to message queue for Notification Service
