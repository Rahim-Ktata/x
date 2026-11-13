export enum AccountStatus{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED= "BLOCKED"
}

export const account_status = [
    {label: 'Active', value:AccountStatus.ACTIVE},
    {label: 'Inactive', value:AccountStatus.INACTIVE},
    {label: 'Blocked', value:AccountStatus.BLOCKED},
]