import { InvestmentProduct } from './../../interfaces/investment-product.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { Vault } from '@2pi-network/sdk';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiInvestmentProduct } from './two-pi-investment-product.model';

const coins = [
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
  } as Coin,
];

const testVaultUSDC = {
  apy: 0.12392847454895217,
  identifier: 'polygon_usdc',
  token: 'USDC',
  tvl: '15800500',
  tokenDecimals: '6',
  pid: 2,
} as Vault;

describe('TwoPiInvestmentProduct', () => {
  let twoPiInvestmentProduct: InvestmentProduct;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  beforeEach(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getCoins: coins });
    twoPiInvestmentProduct = new TwoPiInvestmentProduct(testVaultUSDC, apiWalletServiceSpy);
  });

  it('should create', () => {
    expect(twoPiInvestmentProduct).toBeTruthy();
  });

  it('should return name when name method is called', () => {
    expect(twoPiInvestmentProduct.name()).toEqual('polygon_usdc');
  });

  it('should return token when token method is called', () => {
    expect(twoPiInvestmentProduct.token()).toEqual(coins[0]);
  });

  it('should return apy when apy method is called', () => {
    expect(twoPiInvestmentProduct.apy()).toEqual(12.392847454895218);
  });

  it('should return type when type method is called', () => {
    expect(twoPiInvestmentProduct.type()).toEqual('Vault');
  });

  it('should return product id when id method is called', () => {
    expect(twoPiInvestmentProduct.id()).toEqual(2);
  });

  it('should return provider when provider method is called', () => {
    expect(twoPiInvestmentProduct.provider()).toEqual('2PI');
  });

  it('should return formatted tvl when tvl method is called and tvl is in safe integer range', () => {
    expect(twoPiInvestmentProduct.tvl()).toEqual(15.8005);
  });
});
