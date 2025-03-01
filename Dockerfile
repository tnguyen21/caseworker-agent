# Use a Node.js base image for the Next.js app
FROM node:18-alpine as frontend

WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm ci

# Copy the Next.js application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a Python base image for the backend
FROM python:3.11-slim

WORKDIR /app

# Install Node.js in the Python image
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy Next.js app from the frontend stage
COPY --from=frontend /frontend /frontend

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python backend code
COPY backend/ /backend/

# Install supervisord to manage multiple processes
RUN apt-get update && apt-get install -y supervisor && apt-get clean

# Configure supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports for Next.js and Python backend
EXPOSE 3000 8000

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]