import os
from models.embedding_model import embedding_engine
from rich import print
from langchain.tools import tool
from dotenv import load_dotenv
from utils.pgvector_store import create_vector_store
import asyncio

load_dotenv()


TABLE_NAME = "jp_ai_bot"
VECTOR_SIZE = 3072


# @tool
# async def search_knowledgebase(query: str) -> str:
#     """Search the knowledgebase for relevant information."""

#     vector_store = await create_vector_store(
#         table_name=TABLE_NAME,
#         vector_size=VECTOR_SIZE,
#     )

#     query_vector = await embedding_engine.aembed_query(query)
#     docs = await vector_store.asimilarity_search_by_vector(query_vector, k=4)
#     results = "\n\n".join([doc.page_content for doc in docs])
#     return results


@tool
def search_knowledgebase(query: str) -> str:
    """Search the knowledgebase for relevant information."""

    async def _run():
        vector_store = await create_vector_store(
            table_name=TABLE_NAME,
            vector_size=VECTOR_SIZE,
        )

        query_vector = await embedding_engine.aembed_query(query)
        docs = await vector_store.asimilarity_search_by_vector(query_vector, k=4)
        return "\n\n".join([doc.page_content for doc in docs])

    return asyncio.run(_run())
