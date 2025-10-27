import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings


load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

embedding_engine = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
