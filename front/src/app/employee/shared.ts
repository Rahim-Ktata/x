import { AccountStatus, account_status } from "../../models/enums/account_status"
import { ContractType, contracts } from "../../models/enums/contract_type"
import { Gender, genders } from "../../models/enums/gender"
import { Role, roles } from "../../models/enums/role"

export class Shared{

    // stuff used for select in forms
    static contracts = contracts
    static roles = roles
    static account_status = account_status
    static genders = genders

}
