export interface DirectaDepositCreationData {
  amount: number;
  fiat_token: string;
  crypto_token: string;
  wallet: string;
  country: string;
  payment_method: string;
  mobile: boolean;
  language: string;
  back_url: string;
  success_url: string;
  error_url: string;
  notification_url: string;
  logo: string;
}
