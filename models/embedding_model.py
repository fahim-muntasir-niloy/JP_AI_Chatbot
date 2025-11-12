import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings


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

# Only set environment variable if it exists (don't set to None)
# Also strip quotes in case .env file has quotes around values
google_key = os.getenv("GOOGLE_API_KEY")
if google_key:
    os.environ["GOOGLE_API_KEY"] = strip_quotes(google_key)

embedding_engine = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
