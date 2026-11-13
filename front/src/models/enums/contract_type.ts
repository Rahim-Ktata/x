export enum ContractType{
    CDI = "CDI",
    CDD = "CDD",
    SIVP = "SIVP",
    APPRENTI = "APPRENTI"
}

export const contracts = [
    {label: 'Apprenti', value:ContractType.APPRENTI},
    {label: 'CDD', value:ContractType.CDD},
    {label: 'CDI', value:ContractType.CDI},
    {label: 'SIVP', value:ContractType.SIVP},
]

export const contracts_arr = Object.values(ContractType);