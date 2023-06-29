import { OperationDataInterface } from '../interfaces/operation-data.interface';

export const rawOperationData: OperationDataInterface = {
  country: 'country',
  type: 'cash-in',
  amount_in: 100,
  amount_out: 100,
  currency_in: 'ARS',
  currency_out: 'USDC',
  price_in: '1',
  price_out: 100,
  wallet: '0x000000000000000000000dead',
  provider: '1',
  network: 'MATIC',
};
export const rawPendingOperationData: OperationDataInterface = {
  country: 'country',
  type: 'cash-in',
  operation_type: 'cash-in',
  status: 'received',
  amount_in: 100,
  amount_out: 100,
  currency_in: 'ARS',
  currency_out: 'USDC',
  price_in: '1',
  price_out: 100,
  wallet: '0x000000000000000000000dead',
  provider: '1',
  network: 'MATIC',
};

export const rawCashOutOperationData: OperationDataInterface = {
  country: 'Argentina',
  type: 'cash-out',
  amount_in: 20,
  amount_out: 3500,
  currency_in: 'USDC',
  currency_out: 'ARS',
  price_in: '1',
  price_out: 175,
  wallet: '0x000000000000000000000dead',
  kripton_wallet: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
  provider: '1',
  network: 'MATIC',
  payment_method_id: 902,
  operation_id: 898,
};
