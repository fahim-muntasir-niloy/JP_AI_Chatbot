import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import BaseModel
from typing import Optional
from agent import agent
from rich import print
from uuid import uuid4
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from utils.stream_generator import event_generator

load_dotenv()

# Helper function to strip quotes from environment variable values
def strip_quotes(value: str) -> str:
    """Strip single or double quotes from string if present."""
    if not value:
        return value
    value = value.strip()
    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
        return value[1:-1]
    return value

os.environ["LANGSMITH_TRACING_V2"] = "true"
os.environ["LANGSMITH_ENDPOINT"] = "https://api.smith.langchain.com"
# Only set LANGCHAIN_API_KEY if it exists (don't set to None)
# Also strip quotes in case .env file has quotes around values
langchain_key = os.getenv("LANGCHAIN_API_KEY")
if langchain_key:
    os.environ["LANGCHAIN_API_KEY"] = strip_quotes(langchain_key)
os.environ["LANGSMITH_PROJECT"] = "japan-ai"


app = FastAPI(
    title="Japan AI Chatbot API",
    description="API for Japan AI Chatbot",
    version="1.1.0",
)

# rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)


class chatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None


@app.post("/chat")
@limiter.limit("10/minute")
async def chat_endpoint(request: Request, chat_request: chatRequest):
    user_message = chat_request.message
    thread_id = chat_request.thread_id or str(uuid4())

    print(f"Received message: {user_message} in thread: {thread_id}")

    response = await agent.ainvoke(
        {"messages": [{"role": "user", "content": user_message}]},
        config={"configurable": {"thread_id": thread_id}},
    )
    print(response["messages"][-1].content)
    return {"response": response["messages"][-1].content}

@app.post("/chat/stream")
@limiter.limit("10/minute")
async def chat_stream(request: Request, chat_request: chatRequest):
    """Streaming endpoint for chat using Server-Sent Events (SSE).

    slowapi requires the endpoint to accept a `request` or `websocket`
    parameter so it can extract the client key (IP) for rate limiting.
    Accept a `chatRequest` JSON body and stream agent events back.
    """
    user_input = chat_request.message
    thread_id = chat_request.thread_id or str(uuid4())

    print(f"Streaming chat for thread: {thread_id} with input: {user_input}")

    return StreamingResponse(
        event_generator(agent, user_input, thread_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

# Mount static files for assets (JS, CSS, images, etc.)
# Use absolute path to ensure it works regardless of working directory
static_dir = Path(__file__).parent.resolve() / "static"

# Mount static files at /assets path - must be done before other routes
# StaticFiles automatically handles MIME types and serves files correctly
if static_dir.exists() and (static_dir / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets"), html=False), name="assets")

# Serve index.html for root route
@app.get("/")
async def serve_index():
    """Serve the frontend React app index.html."""
    index_path = static_dir / "index.html"
    assets_dir = static_dir / "assets"
    
    if index_path.exists() and index_path.is_file():
        return FileResponse(
            str(index_path),
            media_type="text/html",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
            }
        )
    else:
        # Return helpful error if static files not found (for debugging)
        import os
        return {
            "error": "Frontend not found",
            "message": "Please build the frontend and ensure the 'static' directory exists.",
            "static_dir": str(static_dir),
            "static_dir_exists": static_dir.exists(),
            "index_html_exists": index_path.exists() if static_dir.exists() else False,
            "assets_dir_exists": assets_dir.exists() if static_dir.exists() else False,
            "working_directory": os.getcwd(),
            "api_file_location": str(Path(__file__)),
        }

# Exception handler for SPA routing - handles 404s by serving index.html
# This must be registered after routes but handles all 404s
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle 404s by serving index.html for SPA routing."""
    if exc.status_code == 404:
        # Don't serve index.html for API routes, docs, or assets
        path = request.url.path
        if any(path.startswith(prefix) for prefix in ["/chat", "/docs", "/redoc", "/openapi.json", "/assets"]):
            raise exc
        # Serve index.html for all other 404s (SPA routing)
        index_path = static_dir / "index.html"
        if index_path.exists() and index_path.is_file():
            return FileResponse(
                str(index_path),
                media_type="text/html",
                headers={
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                }
            )
    # Re-raise the exception for non-404 errors
    raise exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="localhost", port=5500, reload=True)
