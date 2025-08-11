# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package.json and package-lock.json (if available)
# This is done before copying the entire codebase to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Change ownership of the app directory to the nodejs user
RUN chown -R nodejs:nodejs /usr/src

# Switch to the non-root user
USER nodejs

# Expose the port your app runs on (adjust as needed)
EXPOSE 3000


# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# Command to run the application
CMD ["node", "index.js"]