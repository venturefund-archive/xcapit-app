import { rawTransfer } from '../../fixtures/covalent-transfers.fixture';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { JSONTransfer } from './json-transfer';
import { NativeTransfer } from '../transfer/native-transfer/native-transfer';
import { NoNativeTransfer } from '../transfer/no-native-transfer/no-native-transfer';
import { rawNoNativeTransfer } from '../../fixtures/covalent-no-native-transfers.fixture';

const expectedValue = {
  fee: 0.024715417086192657,
  token: rawMATICData,
  block_signed_at: '2022-08-19T15:59:38Z',
  block_height: 32077204,
  tx_hash: '0x7d81572bd8028f7a8a1ea1205f825ce0bf5dad2c757b38af4b78ec2e49e03db9',
  tx_offset: 2,
  successful: true,
  from_address: '0x72fdeb93a64a0eb2b789a9ed87e65bff967928c3',
  from_address_label: null,
  to_address: '0x1111111254fb6c44bac0bed2854e76f90643097d',
  to_address_label: null,  
  type: 'IN',
  icon: 'assets/img/wallet-transactions/received.svg',
  value: '500000000000000000',
  value_quote: 0.42984074354171753,
  gas_offered: 332741,
  gas_spent: 164769,
  gas_price: 150000407153,
  fees_paid: '24715417086192657',
  gas_quote: 0.021247386514545444,
  gas_quote_rate: 0.8596814870834351,
};

const expectedValueNoNative = {
  fee: 0.024715417086192657,
  token: rawMATICData,
  block_signed_at: '2022-08-19T15:59:38Z',
  block_height: 32077204,
  tx_hash: '0x7d81572bd8028f7a8a1ea1205f825ce0bf5dad2c757b38af4b78ec2e49e03db9',
  tx_offset: 2,
  successful: true,
  from_address: '0x1111111254fb6c44bac0bed2854e76f90643097d',
  from_address_label: null,
  to_address: '0x72fdeb93a64a0eb2b789a9ed87e65bff967928c3',
  to_address_label: null,
  type: 'IN',
  icon: 'assets/img/wallet-transactions/received.svg',
  value: '500000000000000000',
  value_quote: 0.42984074354171753,
  gas_offered: 332741,
  gas_spent: 164769,
  gas_price: 150000407153,
  fees_paid: null,
  gas_quote: 0.021247386514545444,
  gas_quote_rate: 0.8596814870834351,
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

fdescribe('JSONTransfer', () => {
  let jsonTransfer: JSONTransfer;
  const aTestAddress = '';

  beforeEach(() => {
    jsonTransfer = new JSONTransfer(new NativeTransfer(rawTransfer, rawMATICData, aTestAddress));
  });

  it('new', () => {
    expect(jsonTransfer).toBeTruthy();
  });

  it('value', () => {
    expect(jsonTransfer.value()).toEqual(expectedValue);
  });

  it('value when no native transfer', () => {
    jsonTransfer = new JSONTransfer(new NoNativeTransfer(rawNoNativeTransfer, rawMATICData, aTestAddress));
    expect(jsonTransfer.value()).toEqual(expectedValueNoNative);
  });


});
