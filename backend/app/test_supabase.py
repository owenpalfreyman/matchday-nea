import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_PUBLISHABLE_KEY"],
)


def test_insert_post():
    post = {
        "title": "Test post",
        "content": "This is a test post.",
    }

    response = supabase.table("posts").insert(post).execute()
    print(response.data)


if __name__ == "__main__":
    test_insert_post()
