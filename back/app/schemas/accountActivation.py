
from app.schemas.common import MyBaseModel, Response


class AccountActivation(MyBaseModel):
    token : str
    password : str
    confirm_password : str

class AccountActivationOut(Response):
    pass

