import os

from dotenv import load_dotenv
from fastapi import FastAPI
from supabase import create_client

from app.schemas import TestPost


# Load SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from backend/.env.
load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_PUBLISHABLE_KEY"],
)

app = FastAPI()


# Insert a post into the Supabase posts table.
@app.post("/post-test")
def post_test(post: TestPost):
    response = supabase.table("test").insert(post.model_dump()).execute()
    return response.data


@app.get("/hello-world")
def hello_world():
    return {"message": "Hello, World!"}