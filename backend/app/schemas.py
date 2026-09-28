from pydantic import BaseModel

class TestPost(BaseModel):
    title: str
    content: str