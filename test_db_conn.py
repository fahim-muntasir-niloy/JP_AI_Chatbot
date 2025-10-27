import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


def test_db_connection():
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("db_name"),
            user=os.getenv("db_user"),
            password=os.getenv("db_password"),
            host=os.getenv("db_host"),
            port=os.getenv("db_port"),
        )
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        result = cur.fetchone()
        assert result[0] == 1
        cur.close()
    except Exception as e:
        assert False, f"Database connection failed: {e}"
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    test_db_connection()
    print("Database connection test passed.")
