import { AccountStatus } from "../enums/account_status"
import { ContractType } from "../enums/contract_type"
import { Gender } from "../enums/gender"
import { Role } from "../enums/role"
import { Response } from "./common"

export interface EmployeeBase{
    first_name : string  
    last_name : string 
    email : string  
    number : number 
    birth_date : Date 
    address : string 
    cnss_number : string 
    contract_type : ContractType 
    gender : Gender 
    account_status : AccountStatus 
    phone_number : string 
}

export interface EmployeeInDB extends EmployeeBase{
    id: number
    password: string | undefined
    created_on: Date
    roles: [Role]
}

export interface EmployeePublic extends EmployeeBase,Response{
    id: number
    created_on: Date
    roles: [Role]
}

export interface EmployeeCreate extends EmployeeBase{
    roles: [Role]
}

export interface EditEmployeeEntry{
    first_name : string
    last_name : string 
    birth_date : Date 
    address : string 
    cnss_number : string 
    contract_type : ContractType
    gender : Gender
    account_status : AccountStatus
    phone_number : string 
    roles: [Role]
}

export interface EmployeeUploadResponse{
    errs : [string]
    warnings : [string]
    detail: string
    stautus_code: number | undefined
}

export interface EditEmployeeOut{
    msg: string
    status_code: string
}

export interface PagedResponse{
    page_number: number
    page_size: number
    number_of_pages: number
    total_records: number
}

export interface GetAllEmployees extends PagedResponse{
    employees: [EmployeePublic]
}

export interface DeleteEmployeeResponse extends Response{}