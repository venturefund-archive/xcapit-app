import { CovalentTransfersResponse } from './covalent-transfers-response';
import { Coin } from '../../interfaces/coin.interface';
const noNativeTransfersResponse = {
  data: {
    address: 'testAddress',
    quote_currency: 'USD',
    items: [
      {
        transfers: [
          {
            from_address: 'testFromAddress',
            to_address: 'testToAddress',
            contract_decimals: 18,
            contract_ticker_symbol: 'LINK',
            delta: '100000000000000000000',
            delta_quote: null,
            transfer_type: 'IN',
          },
          {
            from_address: 'testFromAddress',
            to_address: 'testToAddress',
            contract_decimals: 18,
            contract_ticker_symbol: 'LINK',
            delta: '100000000000000000000',
            delta_quote: null,
            transfer_type: 'OUT',
          },
        ],
      },
    ],
  },
};

const nativeTransfersResponse = {
  data: {
    address: 'testAddress',
    quote_currency: 'USD',
    items: [
      {
        from_address: 'testFromAddress',
        to_address: 'testToAddress',
        value: '10000000000000000',
        value_quote: 30,
      },
      {
        from_address: 'testFromAddress',
        to_address: 'testAddress',
        value: '10000000000000000',
        value_quote: 30,
      },
    ],
  },
};

const nativeAsset: Coin = {
  id: 2,
  name: 'ETH - Ethereum',
  logoRoute: '../../assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 42,
  rpc: 'http://testrpc.test',
};

const noNativeAsset: Coin = {
  id: 2,
  name: 'LINK - Link',
  logoRoute: '../../assets/img/coins/LINK.svg',
  last: false,
  value: 'LINK',
  network: 'ERC20',
  contract: 'someContractAddress',
  chainId: 42,
  rpc: 'http://testrpc.test',
};

describe('CovalentTransfersResponse', () => {
  it('should return a valid array with no native transfers', () => {
    const values = new CovalentTransfersResponse(noNativeTransfersResponse, noNativeAsset).value();
    expect(values[0].symbol).toBe('LINK');
    expect(values[0].type).toBe('IN');
    expect(values[0].amount).toBe(100);
    expect(values[1].symbol).toBe('LINK');
    expect(values[1].type).toBe('OUT');
    expect(values[1].amount).toBe(100);
  });

  it('should return a valid array with native transfers', () => {
    const values = new CovalentTransfersResponse(nativeTransfersResponse, nativeAsset).value();
    expect(values[0].symbol).toBe('ETH');
    expect(values[0].type).toBe('OUT');
    expect(values[0].amount).toBe(0.01);
    expect(values[1].symbol).toBe('ETH');
    expect(values[1].type).toBe('IN');
    expect(values[1].amount).toBe(0.01);
  });
});
