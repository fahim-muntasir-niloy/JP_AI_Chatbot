import os
from models.embedding_model import embedding_engine
from rich import print
from langchain.tools import tool
from dotenv import load_dotenv
from utils.pgvector_store import create_vector_store
import asyncio
import logging
from rich import print

load_dotenv()


TABLE_NAME = "jp_ai_bot"
VECTOR_SIZE = 3072


# Configure logging for better observability in production
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@tool()
async def search_knowledgebase(query: str) -> dict:
    """Search the knowledgebase for relevant information and return JSON-serializable results.

    The return value is a dict with a `results` key containing a list of
    objects with `content` and `metadata` fields. This is easier to consume
    by downstream callers (agents, API endpoints and the frontend).

    Args:
        query (str): The user query to search for.

    Returns:
        dict: {"results": [{"content": str, "metadata": dict}, ...]} or
              {"error": "..."} on failure.
    """

    try:
        # Initialize the vector store asynchronously
        vector_store = await create_vector_store(
            table_name=TABLE_NAME,
            vector_size=VECTOR_SIZE,
        )

        # Generate the embedding vector for the query
        query_vector = await embedding_engine.aembed_query(query)

        # Retrieve top-k similar documents
        docs = await vector_store.asimilarity_search_by_vector(query_vector, k=4)

        # Combine results into a single JSON-serializable response
        if not docs:
            logger.info("No relevant documents found for query: %s", query)
            return {"results": []}

        results = [
            {"content": doc.page_content, "metadata": doc.metadata} for doc in docs
        ]

        return {"results": results}

    except asyncio.CancelledError:
        logger.warning("Search task was cancelled.")
        raise

    except Exception as e:
        logger.exception("Error in search_knowledgebase: %s", str(e))
        return {"error": f"An internal error occurred while searching the knowledgebase: {e}"}


# if __name__ == "__main__":
#     # For testing purposes
#     query = "Is mobile phone subsidy available for low-income families?"
#     result = asyncio.run(search_knowledgebase(query))
#     print(result)