import { AccountStatus } from "../../models/enums/account_status"
import { ContractType } from "../../models/enums/contract_type"
import { Gender } from "../../models/enums/gender"
import { Role } from "../../models/enums/role"

export class Shared{

    // stuff used for select in forms
    static contracts = [
        {label: 'Apprenti', value:ContractType.APPRENTI},
        {label: 'CDD', value:ContractType.CDD},
        {label: 'CDI', value:ContractType.CDI},
        {label: 'SIVP', value:ContractType.SIVP},
    ]
    static roles = [
        {label: 'Vendor', value:Role.VENDOR},
        {label: 'Admin', value:Role.ADMIN},
        {label: 'Inventory manager', value:Role.INVENTORY_MANAGER},
        {label: 'Superuser', value:Role.SUPERUSER},
    ]
    static account_status = [
        {label: 'Active', value:AccountStatus.ACTIVE},
        {label: 'Inactive', value:AccountStatus.INACTIVE},
        {label: 'Blocked', value:AccountStatus.BLOCKED},
    ]
    static genders =[
        {label: 'Male', value:Gender.MALE},
        {label: 'Female', value:Gender.FEMALE},
    ]

}
