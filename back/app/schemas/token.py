
from app.schemas.common import MyBaseModel


class Token(MyBaseModel):
    access_token: str
    token_type: str


class TokenData(MyBaseModel):
    email: str | None = None