export interface IFiatRampOperation { 
    operation_id: number;
    provider: string;
    currency_in: string;
    amount_in: number;
    created_at: Date;
    status: string;
}