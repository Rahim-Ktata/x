
from pydantic import BaseModel
from app.enums import ContractType, Gender, AccountStatus, Role
from datetime import date, datetime
from typing import List

from schemas.common import MyBaseModel


class EmployeeRole(MyBaseModel):

    employee_id : int
    role : Role

