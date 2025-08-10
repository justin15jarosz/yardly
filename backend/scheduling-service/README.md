Responsibilities:

- Manage bookings, calendar slots, and appointment lifecycle
- Suggest optimal service dates based on business availability, travel time, and estimated job duration
- Conflict detection and tentative holds

Technology:

- Node.js (Express) with scheduling libraries (e.g., node-schedule, agenda) or custom constraint solver
- PostgreSQL for appointments and business availability
- Optional integration with external calendar APIs (Google Calendar)

Communication:

- REST API for frontend and Business Service
- Consumes quote.accepted or booking.requested events
- Emits booking.created, booking.updated
