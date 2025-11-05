# Japan Business Bot

A full-stack AI chatbot application for Japan business inquiries, combining a React/Vite frontend with a FastAPI backend, containerized in a single Docker image.


## Quick Start

### Build
```bash
docker build -t jp-bot .
```

### Run
```bash
docker run -d -p 80:80 --name jp-bot-container jp-bot
```

Access the application at:
- **Frontend**: `http://your-server-ip/`
- **API Docs**: `http://your-server-ip/docs`

## API Documentation

### POST `/chat`

Send a chat message to the AI assistant.

**Request Payload:**
```json
{
  "message": "string",        // Required: User's message/question
  "thread_id": "string"       // Optional: Conversation thread ID (auto-generated if not provided)
}
```

**Example Request:**
```json
{
  "message": "What subsidies are available for starting a business in Japan?",
  "thread_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "response": "string"  // AI assistant's response message
}
```

**Example Response:**
```json
{
  "response": "日本でビジネスを始めるための補助金について、いくつかの主要な制度があります..."
}
```

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Container**: Docker (multi-stage build)

## Project Structure

```
JP_AI_Chatbot/
├── api.py                    # FastAPI backend
├── kireichat_-ai-japan-guide/ # React frontend
│   ├── components/           # React components
│   ├── services/             # API service
│   └── dist/                  # Build output (generated)
├── static/                    # Served frontend build (in container)
└── Dockerfile                 # Multi-stage Docker build
```