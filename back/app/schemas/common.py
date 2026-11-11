from pydantic import BaseModel

class MyBaseModel(BaseModel):
    class config:
        orm_mode = True

class Response(MyBaseModel):
    detail: str = ""
    status_code: int | None = None