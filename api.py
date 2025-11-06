import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from agent import agent
from rich import print
from uuid import uuid4
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

os.environ["LANGSMITH_TRACING_V2"] = "true"
os.environ["LANGSMITH_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGSMITH_PROJECT"] = "japan-ai"


app = FastAPI(
    title="Japan AI Chatbot API",
    description="API for Japan AI Chatbot",
    version="1.0.0",
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
    thread_id: str = str(uuid4())


@app.post("/chat")
@limiter.limit("10/minute")
async def chat_endpoint(request: Request, chat_request: chatRequest):
    user_message = chat_request.message
    thread_id = chat_request.thread_id

    print(f"Received message: {user_message} in thread: {thread_id}")

    response = await agent.ainvoke(
        {"messages": [{"role": "user", "content": user_message}]},
        config={"configurable": {"thread_id": thread_id}},
    )
    print(response["messages"][-1].content)
    return {"response": response["messages"][-1].content}


# Mount static files directory (frontend build) - must be before catch-all route
static_dir = "static"
if os.path.exists(static_dir):
    # Mount assets directory if it exists (Vite outputs to assets/)
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Serve index.html at root
    @app.get("/")
    async def serve_index():
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"status": "ok", "frontend": "index.html not found"}
    
    # Catch-all route for SPA routing (must be last, after all API routes)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Exclude API routes
        if full_path in ["chat"] or full_path.startswith("chat/"):
            return {"error": "Not found"}
        
        # Exclude assets (already handled by mount)
        if full_path.startswith("assets/"):
            return {"error": "Not found"}
        
        # Serve index.html for all other routes (SPA routing)
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not found"}
else:
    # Fallback if static directory doesn't exist
    @app.get("/")
    async def health_check():
        return {"status": "ok", "frontend": "not built"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="localhost", port=5500, reload=True)
