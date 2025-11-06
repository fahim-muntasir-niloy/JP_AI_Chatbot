import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()

os.environ["ANTHROPIC_API_KEY"] = os.getenv("ANTHROPIC_API_KEY")
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

# llm = init_chat_model(model="qwen/qwen3-32b", model_provider="groq", temperature=0.5)
llm = init_chat_model(
    model="claude-haiku-4-5-20251001", model_provider="anthropic", temperature=0.5
)
