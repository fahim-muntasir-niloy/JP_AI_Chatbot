import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

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

# Only set environment variables if they exist (don't set to None)
# Also strip quotes in case .env file has quotes around values
anthropic_key = os.getenv("ANTHROPIC_API_KEY")
if anthropic_key:
    os.environ["ANTHROPIC_API_KEY"] = strip_quotes(anthropic_key)

groq_key = os.getenv("GROQ_API_KEY")
if groq_key:
    os.environ["GROQ_API_KEY"] = strip_quotes(groq_key)

# llm = init_chat_model(model="qwen/qwen3-32b", model_provider="groq", temperature=0.5)
llm = init_chat_model(
    model="claude-haiku-4-5-20251001", model_provider="anthropic", temperature=0.5
)
