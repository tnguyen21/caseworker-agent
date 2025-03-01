# Use a Node.js base image for the Next.js app
FROM node:18-alpine as frontend

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy the frontend application code
COPY frontend/ ./

# Build the frontend application
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

# Copy frontend from the frontend stage
COPY --from=frontend /app/frontend /app/frontend

# Install Python dependencies - install minimal dependencies first
RUN pip install --no-cache-dir fastapi uvicorn

# Copy the Python backend code
COPY backend/ /app/backend/

# Create a health check endpoint
RUN mkdir -p /app/frontend/public/api
RUN echo '{"status":"ok"}' > /app/frontend/public/api/health

# Expose ports for frontend and Python backend
EXPOSE 3000 8000

# Set environment variables
ENV PORT=3000
ENV PYTHON_BACKEND_PORT=8000
ENV NODE_ENV=production

# Start supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN apt-get update && apt-get install -y supervisor && apt-get clean

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]