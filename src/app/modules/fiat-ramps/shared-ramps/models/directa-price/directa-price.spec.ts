import { DirectaPrice } from './directa-price';
import { interval, of } from 'rxjs';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';

fdescribe('DirectaPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let directaPrice: DirectaPrice;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampService', {
      getDirectaExchangeRate: { fx_rate: 3 },
    });
    directaPrice = DirectaPrice.create(15, 'ars', coinSpy, fiatRampsServiceSpy);
  });

  it('new', () => {
    expect(new DirectaPrice(interval(1), 'ars', coinSpy, fiatRampsServiceSpy)).toBeTruthy();
  });

  it('create', () => {
    expect(directaPrice).toBeInstanceOf(DirectaPrice);
  });

  it('value', async () => {
    const subscription = await directaPrice.value().toPromise();
    expect(subscription).toEqual(3);
  });
});
