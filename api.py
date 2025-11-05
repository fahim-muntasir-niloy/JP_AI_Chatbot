import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import agent
from rich import print
from uuid import uuid4

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
async def chat_endpoint(request: chatRequest):
    user_message = request.message
    thread_id = request.thread_id

    print(f"Received message: {user_message} in thread: {thread_id}")

    response = await agent.ainvoke(
        {"messages": [{"role": "user", "content": user_message}]},
        config={"configurable": {"thread_id": thread_id}},
    )
    print(response["messages"][-1].content)
    return {"response": response["messages"][-1].content}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="localhost", port=5500, reload=True)
