import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampsService } from '../../../services/fiat-ramps.service';
import { DirectaPriceFactory } from './directa-price-factory';
import { DirectaPrice } from '../directa-price';

describe('DirectaPriceFactory', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;

  it('create', () => {
    expect(new DirectaPriceFactory().new(2000, 'ARS', coinSpy, fiatRampsServiceSpy)).toBeInstanceOf(DirectaPrice);
  });
});