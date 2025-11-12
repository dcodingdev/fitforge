FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose Render port
ENV PORT 3000
EXPOSE $PORT

# Start production server
CMD ["npm", "run", "start", "--", "-p", "$PORT"]
