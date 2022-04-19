import covalentBalancesData from '../../fixtures/covalent-balances.json';
import { CovalentBalances } from './covalent-balances';
import { FakeHttpClient } from '../../../../../../testing/fakes/fake-http.spec';
import { Coin } from '../../interfaces/coin.interface';

fdescribe('CovalentBalances', () => {
  let covalentBalances: CovalentBalances;
  let maticSpy: jasmine.SpyObj<Coin>;
  let usdcSpy: jasmine.SpyObj<Coin>;
  let lunaSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    maticSpy = jasmine.createSpyObj(
      'MATIC',
      {},
      { value: 'MATIC', contract: '0x0000000000000000000000000000000000001010', chainId: 137 }
    );
    usdcSpy = jasmine.createSpyObj(
      'USDC',
      {},
      { value: 'USDC', contract: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', chainId: 137 }
    );

    lunaSpy = jasmine.createSpyObj('LUNA', {}, { value: 'LUNA', contract: '0x15987', chainId: 137 });
    covalentBalances = new CovalentBalances(
      '0x0001',
      [maticSpy, usdcSpy],
      new FakeHttpClient(covalentBalancesData),
      'https:/test/'
    );
  });

  it('should create', () => {
    expect(covalentBalances).toBeTruthy();
  });

  it('should create with default url', () => {
    covalentBalances = new CovalentBalances('0x0001', [maticSpy, usdcSpy], new FakeHttpClient(covalentBalancesData));
    expect(covalentBalances).toBeTruthy();
  });

  it('should get value', async () => {
    expect(await covalentBalances.value()).toEqual([
      { coin: maticSpy, balance: 1.6756807965451055 },
      { coin: usdcSpy, balance: 2e-13 },
    ]);
  });

  it('should get value of a coin', async () => {
    expect(await covalentBalances.valueOf(maticSpy)).toEqual({ coin: maticSpy, balance: 1.6756807965451055 });
  });

  it('should get 0 if not balance', async () => {
    expect(await covalentBalances.valueOf(lunaSpy)).toEqual({ coin: lunaSpy, balance: 0 });
  });
});
