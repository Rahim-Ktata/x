from app.schemas.common import MyBaseModel, Response


class ForgetPasswordOut(Response):
    pass

class ResetPasswordEntry(MyBaseModel):
    token : str
    password : str
    confirm_password : str

class ResetPasswordOut(Response):
    pass