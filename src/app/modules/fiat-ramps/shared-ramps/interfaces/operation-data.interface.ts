export interface OperationDataInterface {
  country?: string;
  type: string;
  amount_in: number;
  amount_out: number;
  currency_in: string;
  currency_out: string;
  price_in: string;
  price_out: number;
  wallet: string;
  provider: string;
  network: string;
  voucher?: boolean;
  operation_id?: number;
  created_at?: Date;
  fee?: number;
  providerFee?: number;
  payment_method_id?: number;
  operation_type?: string;
  status?: string;
  kripton_wallet?: string;
}
