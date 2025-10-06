# Use official Node.js LTS
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source
COPY src ./src

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "run", "dev"]
