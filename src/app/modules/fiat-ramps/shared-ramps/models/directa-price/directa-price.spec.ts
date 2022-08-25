import { DirectaPrice } from './directa-price';
import { interval, of } from 'rxjs';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';
import { take } from 'rxjs/operators';

describe('DirectaPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let directaPrice: DirectaPrice;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampService', {
      getDirectaExchangeRate: of({ fx_rate: 3 }),
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
    const exchange_rate = await directaPrice.value().pipe(take(1)).toPromise();
    expect(exchange_rate).toEqual(3);
  });
});
