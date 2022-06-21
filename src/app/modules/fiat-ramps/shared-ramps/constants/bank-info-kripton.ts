import { BankInfo } from "../interfaces/bank-info.interface";

export const BANK_INFO_KRIPTON: BankInfo[] = [
    {
        providerId: 1,
        countryIsoCode: "COL",
        name: "Bancolombia",
        extras: [
            {
                key: "Darico Market",
                value: "NIT 9015741364"
            }
        ]
    },
    {
        providerId: 1,
        countryIsoCode: "ARS",
        name: "Santander",
        extras: [
            {
                key: "CBU",
                value: "0720042720000001730586"
            },
            {
                key: "Alias",
                value: "kriptonmarket.ars"
            }
        ]
    }
]