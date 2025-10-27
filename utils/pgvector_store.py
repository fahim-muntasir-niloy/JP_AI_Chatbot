import os
from dotenv import load_dotenv
from sqlalchemy.exc import ProgrammingError
from langchain_postgres import Column
from langchain_postgres import PGVectorStore, PGEngine
from models.embedding_model import embedding_engine

load_dotenv()

USER = os.getenv("db_user")
PASSWORD = os.getenv("db_password")
HOST = os.getenv("db_host")
PORT = os.getenv("db_port")
DBNAME = os.getenv("db_name")

CONNECTION_STRING = f"postgresql+asyncpg://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
pg_engine = PGEngine.from_connection_string(url=CONNECTION_STRING)


async def create_vector_store(
    table_name: str, vector_size: int, schema_name: str = "public"
) -> PGVectorStore:
    try:
        await pg_engine.ainit_vectorstore_table(
            table_name=table_name,
            vector_size=vector_size,
            schema_name=schema_name,
            id_column=Column("langchain_id", "VARCHAR"),
            # metadata_columns=[
            #     Column("likes", "INTEGER"),
            #     Column("location", "TEXT"),
            #     Column("topic", "TEXT"),
            # ],
        )
    except ProgrammingError:
        print("Table already exists. Skipping creation.")

    vector_store = await PGVectorStore.create(
        engine=pg_engine,
        schema_name=schema_name,
        embedding_service=embedding_engine,
        table_name=table_name,
    )
    print("PGVector Store is loaded.")
    return vector_store
