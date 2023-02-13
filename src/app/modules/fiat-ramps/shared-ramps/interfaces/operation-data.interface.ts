export interface OperationDataInterface {
  country?: string;
  type: string;
  amount_in: string;
  amount_out: string;
  currency_in: string;
  currency_out: string;
  price_in: string;
  price_out: string;
  wallet: string;
  provider: string;
  network: string;
  voucher?: boolean;
  operation_id?: number;
  created_at?: Date;
  // fee?: string;
}
