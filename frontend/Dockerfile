# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json only
COPY package*.json ./

# Install dependencies inside container (Linux)
RUN npm ci

# Copy source code and index.html
COPY src ./src
COPY index.html ./

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]
