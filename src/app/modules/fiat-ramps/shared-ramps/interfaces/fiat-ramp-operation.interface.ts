export interface FiatRampOperation { 
    operation_id: number;
    provider: string;
    operation_type: string;
    currency_in: string;
    amount_in: number;
    currency_out: string;
    amount_out: number;
    created_at: Date;
    status: string;
}