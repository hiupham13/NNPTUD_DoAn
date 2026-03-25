FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cache optimization)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3000

# Start with nodemon for dev
CMD ["npm", "start"]
