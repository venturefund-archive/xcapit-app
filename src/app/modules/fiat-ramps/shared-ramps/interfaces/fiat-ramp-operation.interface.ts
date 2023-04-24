export interface FiatRampOperation {
  operation_id: number;
  provider: string;
  operation_type: string;
  currency_in: string;
  amount_in: number;
  currency_out: string;
  amount_out: number;
  created_at: Date;
  wallet_address?: string;
  status: string;
  voucher: boolean;
  tx_hash?: string;
  network?: string;
  fiat_fee?: number;
  provider_fee?: number;
  payment_method_id?: number;
}
