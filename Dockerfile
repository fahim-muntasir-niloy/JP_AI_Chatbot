# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY chatbot-ui/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY chatbot-ui/ ./

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
# .dockerignore will exclude static/ directory so we use the one from build stage
COPY . .

# Copy built frontend files from the frontend builder stage
# This ensures we use the fresh build, not any local static directory
COPY --from=frontend-builder /app/frontend/dist ./static

# Verify static files were copied correctly
RUN ls -la ./static/ && \
    ls -la ./static/assets/ 2>/dev/null || echo "No assets directory" && \
    test -f ./static/index.html || echo "ERROR: index.html not found!"

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
# Note: Environment variables must be passed at runtime using -e flags or --env-file
# The .env file is excluded from the Docker image for security reasons
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]