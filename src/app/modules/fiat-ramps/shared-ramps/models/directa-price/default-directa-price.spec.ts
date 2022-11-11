import { of } from 'rxjs';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';
import { FakeProviderPrice, ProviderPrice } from '../provider-price/provider-price';
import { DefaultDirectaPrice } from './default-directa-price';


describe('DefaultDirectaPrice', () => {
  let directaPrice: ProviderPrice;
  let coinSpy: jasmine.SpyObj<Coin>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampService', {
      getDirectaExchangeRate: of({ fx_rate: 3 }),
    });
    directaPrice = new DefaultDirectaPrice('', coinSpy, fiatRampsServiceSpy);
  });
  it('new', () => {
    expect(directaPrice).toBeTruthy();
  });

  it('value', async () => {
    const exchange_rate = await directaPrice.value().toPromise();

    expect(exchange_rate).toEqual(3);
  });
});


describe('FakeDirectaPrice', () => {
  const testValue = 7;
  let directaPrice: ProviderPrice;

  beforeEach(() => {
    directaPrice = new FakeProviderPrice(testValue);
  });

  it('new', () => {
    expect(directaPrice).toBeTruthy();
  });

  it('value', async () => {
    expect(await directaPrice.value().toPromise()).toEqual(testValue);
  });
});
