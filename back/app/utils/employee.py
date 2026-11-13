from typing import List

from fastapi import BackgroundTasks, FastAPI

from datetime import datetime
import re
import uuid

from fastapi import FastAPI, Depends, status, HTTPException
from app import schemas, enums, models, database
from sqlmodel import Field, Session, create_engine, select

from app.enums.tokenStatus import TokenStatus
from app.externel_services import email_service
from app.schemas.matchy import WrongCell
from app.utils.errors import get_err_msg

def get_session():
    with Session(database.engine) as session:
        yield session
app = FastAPI()


email_regex = r'^[A-Za-z0-9\.]+@[\w]+\.[\w]+$'
cnss_regex = r'^\d{8}-\d{2}$'
phone_number_regex = r'^\d{8}$'

# front checking is done with conditions below
options = [
    schemas.MatchyOption(display_value="first_name", value="first_name", mandatory=True, type=enums.FieldType.string, conditions=[]),
    schemas.MatchyOption(display_value="last_name", value="last_name", mandatory=True, type=enums.FieldType.string, conditions=[]),
    schemas.MatchyOption(display_value="email", value="email", mandatory=True, type=enums.FieldType.string, conditions=[
        schemas.MatchyCondition(property=enums.ConditonProperty.regex, comparer=enums.Comparer.e, value=email_regex, custom_fail_message="invalid email!")
    ]),
    schemas.MatchyOption(display_value="number", value="number", mandatory=True, type=enums.FieldType.integer, conditions=[]),
    #TODO: add birth_date validation
    schemas.MatchyOption(display_value="birth_date", value="birth_date", mandatory=False, type=enums.FieldType.string, conditions=[]),
    schemas.MatchyOption(display_value="address", value="address", mandatory=False, type=enums.FieldType.string, conditions=[]),
    schemas.MatchyOption(display_value="cnss_number", value="cnss_number", mandatory=False, type=enums.FieldType.string, conditions=[
        schemas.MatchyCondition(property=enums.ConditonProperty.regex, comparer=enums.Comparer.e, value=cnss_regex, custom_fail_message="invalid cnss number!")
    ]),
    schemas.MatchyOption(display_value="contract_type", value="contract_type", mandatory=True, type=enums.FieldType.string, conditions=[
        schemas.MatchyCondition(property=enums.ConditonProperty.val, comparer=enums.Comparer.inn, value=enums.ContractType.getPossibleValues(), custom_fail_message="invalid contract type!")
    ]),
    schemas.MatchyOption(display_value="gender", value="gender", mandatory=True, type=enums.FieldType.string, conditions=[
        schemas.MatchyCondition(property=enums.ConditonProperty.val, comparer=enums.Comparer.inn, value=enums.Gender.getPossibleValues(), custom_fail_message=f"gender must be in: { ", ".join(enums.Gender.getPossibleValues()) }")
    ]),
    schemas.MatchyOption(display_value="phone_number", value="phone_number", mandatory=False, type=enums.FieldType.string, conditions=[
        schemas.MatchyCondition(property=enums.ConditonProperty.regex, comparer=enums.Comparer.e, value=phone_number_regex, custom_fail_message="invalid phone_number!")
    ]),
    schemas.MatchyOption(display_value="roles", value="roles", mandatory=True, type=enums.FieldType.string, conditions=[]),
]

# back fields checking

def is_regex_matched(pattern,field):
    return field if re.match(pattern, field) else None

def is_valid_mail(employee, field):
    return is_regex_matched(email_regex,field)

def is_valid_cnss_number(employee,field):
    contract_type = employee["contract_type"]
    if(contract_type in ['CDI', 'CDD']):
        if is_regex_matched(cnss_regex, field):
            return field
    elif field:
        if is_regex_matched(cnss_regex, field):
            return field
    else: return None


def is_positive_int(employee, field: str|int):
    # .isdigit don't work here
    # "²".isdigit()   # True
    # int("²")        # ValueError!
    # "١٢٣".isdigit() # True
    try:
        res = int(field)
    except Exception as e:
        return None
    return res
    # return res >= 0

def is_valid_birth_date(employee, date_text):
    format = "%Y-%m-%d"
    res = True
    try:
        res = bool(datetime.strptime(date_text, format))
    except ValueError:
        return None
    return date_text

def is_valid_phone_number(employee, field):
    return is_regex_matched(phone_number_regex,field)

def are_valid_roles(employee, field):
    roles_list = field.split(',')
    for role in roles_list:
        if not enums.Role.isValidEnumValue(role):
            return None
    return field


fields_check = {
    # field to validate: (func to validate, err msg)
    "email": (lambda employee,field: is_valid_mail(employee,field), "wrong mail address"),
    "gender": (lambda employee,field: enums.Gender.isValidEnumValue(field), f"gender must be in { enums.Gender.getPossibleValues() }"),
    "contract_type": (lambda employee,field: enums.ContractType.isValidEnumValue(field), f"contract_type must be in { enums.ContractType.getPossibleValues() }"),
    # if cnss_number is empty with contract type in cdi cdd it'll be handled without calling this func
    "cnss_number": (lambda employee,field: is_valid_cnss_number(employee,field),f"cnss number should follow the format: xxxxxxxx-xx"),
    "number": (lambda employee,field: is_positive_int(employee,field), "number should be a positive integer"),
    "birth_date": (lambda employee,field: is_valid_birth_date(employee,field), "birth_date should have the format YYYY-MM-DD"),
    "roles": (lambda employee,field: are_valid_roles(employee,field), f"roles should be in { enums.Role.getPossibleValues() }"),
    "phone_number": (lambda employee,field: is_valid_phone_number(employee,field),"phone number must be 8 digits"),
}


mandatory_fields = {
    "first_name": "First Name",
    "last_name": "Last Name",
    "email": "Email",
    "number": "Number",
    "contract_type": "Contract Type",
    "gender": "Gender",
    "roles": "Roles"
}
optional_fields = {
    "birth_date": "Birth Date",
    "address": "Address",
    "phone_number": "Phone Number",
}
mandatory_with_condition_fields = {
    "cnss_number": "CNSS number"
}
unique_fields = {
    "phone_number": models.Employee.phone_number,
    "email": models.Employee.email
}
possible_fields = {
    **mandatory_fields,
    **optional_fields,
    **mandatory_with_condition_fields
}


# extra protection layer, after the front check, before the db check
def validate_employee_data(employee):
    wrong_cells = []
    employee_data = { field: cell.value for field, cell in employee.items() }

    for field in possible_fields:
        # field not included (missing col)
        issues = []
        if field not in employee_data:
            if field in mandatory_fields or (field == "cnss_number" and employee['contract_type'].value in ['CDI','CDD']):
                errs = []
                if(field=="cnss_number"):
                    errs.append(f"line { employee[field].rowIndex }: { possible_fields[field] } is required when Contract type is CDI or CDD")
                else:
                    errs.append(f"line { employee[field].rowIndex }: { possible_fields[field] } is a required field")
                return schemas.EmployeeUploadResponse(
                    detail= "Missing mandatory fields",
                    status_code=400,
                    errs=errs,
                )

        # field included with empty val
        elif employee_data[field] == '':
                wrong_cells.append(WrongCell(rowIndex=employee[field].rowIndex,colIndex=employee[field].colIndex,issues=["required when Contract type is CDI or CDD"]))
        else:
            # if it has condition
            if field in fields_check:
                # condition not satisfied
                # converted (the val in lower upper.. or none if err)
                converted_field = fields_check[field][0](employee_data, employee_data[field]) 
                if converted_field is None:
                    wrong_cells.append(WrongCell(rowIndex=employee[field].rowIndex,colIndex=employee[field].colIndex,issues=[{ fields_check[field][1] }]))
                else:
                    # we might make it lower | upper case
                    employee_data[field] = converted_field

    return (employee_data, wrong_cells)




def validate_employees_data_and_upload(employees: list, background_tasks: BackgroundTasks, db: Session = Depends(get_session)):

    wrong_cells : List[WrongCell]= []
    employees_to_add = []
    roles_per_email = {}
    for employee in employees:
        emp_data, emp_wrong_cells = validate_employee_data(employee)
        wrong_cells.extend(emp_wrong_cells)
        roles_per_email[emp_data.get('email')] = emp_data.get('roles').split(',')
        emp_data.pop("roles")
        employees_to_add.append(models.Employee(**emp_data))



    # mail | phone.. exist already in db | given twice
    for field in unique_fields:
        vals = set() # to check for duplicates in the same file
        issues = [] # issues of each wrong cell
        # enumerate : adds index number (0 based) (to add the line number)
        for line, employee in enumerate(employees):
            issues = []
            val = employee[field].value.strip()
            # empty val
            if val == '':
                continue

            # check duplicate vals for unique fields (from the user input)
            elif val in vals:
                issues.append('Value must be unique, but it exists more than once in the file')
                
            else: vals.add(val)

            # check duplicate exist in db
            try:
                dup = db.query(models.Employee).filter(getattr(models.Employee,field) == employee[field].value.strip()).first()
            except Exception as e:
                from app import crud
                crud.add_error(db=db,text=str(e))
                raise HTTPException(status_code=500, detail=get_err_msg(str(e)))
            if dup:
                issues.append('Value must be unique but it already exists in database')

            if(issues):
                wrong_cells.append(WrongCell(rowIndex=employee[field].rowIndex,colIndex=employee[field].colIndex,issues=issues))


    if(wrong_cells):
        return schemas.EmployeeUploadResponse(
            wrong_cells = wrong_cells,
            status_code = 400,
        )


    try:
        # --------------- add all to db --------------------------
        db.add_all(employees_to_add)
        db.flush()
        # ---------------- adding roles --------------------------
        employees_roles_to_add = []
        for emp in employees_to_add:
            for role in roles_per_email[emp.email]:
                employees_roles_to_add.append(models.EmployeeRole(employee_id=emp.id, role=role.strip().upper()))
        db.add_all(employees_roles_to_add)
        # db.commit()

        #----------- store a token -------------------------
        tokens_to_add = []
        for emp in employees_to_add:
            db_token = models.AccountActivation(
                employee_id = emp.id,
                email = emp.email,
                token = uuid.uuid1(),
                status = TokenStatus.PENDING
            )
            tokens_to_add.append(db_token)
        db.add_all(tokens_to_add)
        #------------ send mail -----------------------------------
        #------------ we need each employees data for the mail ----
        employees_mails = {}
        for emp in employees_to_add:
            employees_mails[emp.email] = emp.__dict__

        for token in tokens_to_add:
            background_tasks.add_task(
                email_service.simple_send,[token.email],
                {**employees_mails[token.email],'token':token.token},
                template_name=enums.emailTemplates.EmailTemplate.ACCOUNT_ACTIVATION.value
            )

        db.commit()

    except Exception as e:
        from app import crud
        db.rollback()
        crud.add_error(db=db,text=str(e))
        raise HTTPException(status_code=500, detail=get_err_msg(str(e)))

    return schemas.EmployeeUploadResponse(
        detail="Employees uploaded successfully",
        status_code=201
    )


