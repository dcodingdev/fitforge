FROM node:20-alpine

WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy all frontend code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose Render port
ENV PORT 3000
EXPOSE $PORT

# Use shell form to expand $PORT correctly
CMD npm run start -- -p $PORT
