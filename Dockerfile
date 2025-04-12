# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Use env file (optional - can be overridden at runtime)
ENV NODE_ENV=production

# Run the compiled JavaScript file
CMD ["node", "dist/bot.js"]
