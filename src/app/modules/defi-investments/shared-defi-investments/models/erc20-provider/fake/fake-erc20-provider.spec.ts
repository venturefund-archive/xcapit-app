import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FakeProvider } from '../../../../../../shared/models/provider/fake-provider.spec';
import { FakeERC20Provider } from './fake-erc20-provider';

describe('FakeERC20Provider', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { name: 'USDC', value: 'USDC', network: 'MATIC' });
  });
  it('should create', () => {
    expect(new FakeERC20Provider()).toBeTruthy();
  });

  it('should return coin', () => {
    expect(new FakeERC20Provider(coinSpy).coin()).toEqual(coinSpy);
  });

  it('should return value', () => {
    expect(new FakeERC20Provider(null, new FakeProvider()).value()).toEqual(new FakeProvider());
  });
});
