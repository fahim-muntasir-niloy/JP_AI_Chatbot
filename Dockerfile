# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY kireichat_-ai-japan-guide/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY kireichat_-ai-japan-guide/ ./

# Build the frontend (outputs to dist/)
RUN npm run build

# Stage 2: Python backend with frontend static files
FROM python:3.12-slim

# Set working directory in the container
WORKDIR /app

# Install system dependencies required for psycopg2-binary
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code
COPY . .

# Copy built frontend files from the frontend builder stage
COPY --from=frontend-builder /app/frontend/dist ./static

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]