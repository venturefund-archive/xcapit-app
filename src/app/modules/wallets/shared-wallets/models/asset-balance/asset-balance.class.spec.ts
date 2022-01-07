import { BalanceCacheService } from './../../services/balance-cache/balance-cache.service';
import { WalletBalanceService } from '../../services/wallet-balance/wallet-balance.service';
import { AssetBalanceModel } from './asset-balance.class';
import { Coin } from '../../interfaces/coin.interface';

const testCoin: Coin = {
  id: 0,
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 42,
  rpc: 'http://testrpc.test/',
  native: true,
};
describe('AssetBalanceModel', () => {
  let walletBalanceServiceSpy: jasmine.SpyObj<WalletBalanceService>;
  let balanceCacheServiceSpy: jasmine.SpyObj<BalanceCacheService>;
  let assetBalanceModel: AssetBalanceModel;
  beforeEach(() => {
    walletBalanceServiceSpy = jasmine.createSpyObj('WalletBalanceService', {
      priceOf: Promise.resolve(10),
      balanceOf: Promise.resolve(5),
    });

    balanceCacheServiceSpy = jasmine.createSpyObj('BalanceCacheService', {
      updateCoin: Promise.resolve(),
      coin: Promise.resolve({ balance: 8, price: 2, expiration_date: 1234 }),
    });

    assetBalanceModel = new AssetBalanceModel(testCoin, walletBalanceServiceSpy, balanceCacheServiceSpy);
  });

  it('should create', () => {
    expect(AssetBalanceModel).toBeTruthy();
  });

  it('should return price and update price cache', async () => {
    await assetBalanceModel.getPrice();
    expect(assetBalanceModel.price).toEqual(10);
    expect(walletBalanceServiceSpy.priceOf).toHaveBeenCalledOnceWith(testCoin);
    expect(balanceCacheServiceSpy.updateCoin).toHaveBeenCalledOnceWith(testCoin, { price: 10 });
  });

  it('should return balance and update balance cache', async () => {
    await assetBalanceModel.balance();
    expect(assetBalanceModel.amount).toEqual(5);
    expect(walletBalanceServiceSpy.balanceOf).toHaveBeenCalledOnceWith(testCoin);
    expect(balanceCacheServiceSpy.updateCoin).toHaveBeenCalledOnceWith(testCoin, { balance: 5 });
  });

  it('should return cached balance', async () => {
    await assetBalanceModel.cachedBalance();
    expect(assetBalanceModel.amount).toEqual(8);
    expect(assetBalanceModel.price).toEqual(2);
    expect(balanceCacheServiceSpy.coin).toHaveBeenCalledOnceWith(testCoin);
  });

  it('should return cached balance', async () => {
    assetBalanceModel.balance();
    assetBalanceModel.getPrice();
    await expectAsync(assetBalanceModel.quoteBalance()).toBeResolvedTo(50);
  });
});
