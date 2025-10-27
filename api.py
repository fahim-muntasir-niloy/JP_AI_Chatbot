import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from agent import agent
from rich import print

load_dotenv()

os.environ["LANGSMITH_TRACING_V2"] = "true"
os.environ["LANGSMITH_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGSMITH_PROJECT"] = "japan-ai"


app = FastAPI(
    title="Japan AI Chatbot API",
    description="API for Japan AI Chatbot using LangChain and Google Gemini",
    version="1.0.0",
)


class chatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat_endpoint(request: chatRequest):
    user_message = request.message

    response = agent.invoke(
        {"messages": [{"role": "user", "content": user_message}]},
        # config={"configurable": {"thread_id": "1"}},
    )
    print(response["messages"][-1].content)
    return {"response": response["messages"][-1].content}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=5500)
