FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cache optimization)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Vite dev server needs --host 0.0.0.0 for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
