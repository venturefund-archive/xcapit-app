export interface Operation {
    provider: any;
    currency_in: string;
    currency_out: string;
    operation_type: string;
    amount_in: number;
    amount_out: number;
    created_at: Date;
    status: string;
}