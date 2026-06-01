FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose the port the app runs on (update if your app uses a different port)
EXPOSE 4050

# Start the application
CMD ["node", "index.js"]
