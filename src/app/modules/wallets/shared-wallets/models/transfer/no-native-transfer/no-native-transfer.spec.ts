import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { Transfer } from '../transfer.interface';
import { NoNativeTransfer } from './no-native-transfer';
import { rawNoNativeTransfer } from '../../../fixtures/covalent-no-native-transfers.fixture';
import { RawTransfer } from '../../../types/raw-transfer.type';

const expectedValue = {
  block_signed_at: '2022-08-19T15:59:38Z',
  tx_hash: '0x7d81572bd8028f7a8a1ea1205f825ce0bf5dad2c757b38af4b78ec2e49e03db9',
  from_address: '0x1111111254fb6c44bac0bed2854e76f90643097d',
  from_address_label: null,
  to_address: '0x72fdeb93a64a0eb2b789a9ed87e65bff967928c3',
  to_address_label: null,
  contract_decimals: 6,
  contract_name: 'USD Coin (PoS)',
  contract_ticker_symbol: 'USDC',
  contract_address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  logo_url: 'https://logos.covalenthq.com/tokens/0x2791bca1f2de4661ed88a30c99a7a9449aa84174.png',
  transfer_type: 'IN',
  delta: '389646',
  balance: null,
  quote_rate: 1.1119537353515625,
  delta_quote: 0.4332683251647949,
  balance_quote: null,
  method_calls: null,
};

fdescribe('NoNativeTransfer', () => {
  let noNativeTransfer: Transfer;

  beforeEach(() => {
    noNativeTransfer = new NoNativeTransfer(rawNoNativeTransfer, rawMATICData);
  });

  it('new', () => {
    expect(noNativeTransfer).toBeTruthy();
  });

  it('fee', () => {
    expect(noNativeTransfer.fee()).toEqual(0.024715417086192657);
  });
  it('token', () => {
    expect(noNativeTransfer.token()).toEqual(rawMATICData);
  });

  it('raw', () => {
    expect(noNativeTransfer.raw()).toEqual(expectedValue as RawTransfer);
  });
});
