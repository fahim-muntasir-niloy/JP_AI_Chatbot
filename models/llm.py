import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

# llm = init_chat_model(
#     model="gemini-2.5-flash", model_provider="google_genai", temperature=0.5
# )

llm = init_chat_model(model="qwen/qwen3-32b", model_provider="groq", temperature=0.5)
