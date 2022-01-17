import { Vault } from '@2pi-network/sdk';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiInvestmentProduct } from './two-pi-investment-product.model';

const usdc_coin = [
  {
    id: 8,
    name: 'USDC - USD Coin',
    logoRoute: 'assets/img/coins/USDC.png',
    last: false,
    value: 'USDC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    moonpayCode: 'usdc_polygon',
    decimals: 6,
    symbol: 'USDCUSDT',
  },
];

const testVaultUSDC = {
  apy: 0.12392847454895217,
  balances: [],
  contract_address: '0xCB50fF1863cBBAd718d3A1eEEf403a95C58d3B16',
  deposits: [],
  identifier: 'polygon_usdc',
  pid: 1,
  token: 'USDC',
  token_address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  tvl: 15800500,
} as Vault;

describe('TwoPiInvestmentProduct', () => {
  let twoPiInvestmentProduct: TwoPiInvestmentProduct;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  beforeEach(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getCoins: usdc_coin });
  });

  it('should create', () => {
    twoPiInvestmentProduct = new TwoPiInvestmentProduct(testVaultUSDC, apiWalletServiceSpy);
    expect(twoPiInvestmentProduct).toBeTruthy();
  });
});
