
export enum Role{
    ADMIN = "ADMIN",
    INVENTORY_MANAGER = "INVENTORY_MANAGER",
    VENDOR = "VENDOR",
    SUPERUSER = "SUPERUSER"
}


export const roles = [
    {label: 'Vendor', value:Role.VENDOR},
    {label: 'Admin', value:Role.ADMIN},
    {label: 'Inventory manager', value:Role.INVENTORY_MANAGER},
    {label: 'Superuser', value:Role.SUPERUSER},
]

export const roles_arr = Object.values(Role);
