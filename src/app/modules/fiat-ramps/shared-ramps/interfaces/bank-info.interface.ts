export interface BankInfo {
    countryIsoCode: string;
    name: string;
    providerId: number;
    extras: Extra[];
}

interface Extra {
    key: string;
    value: string;
}