import { of } from 'rxjs';

import { FiatRampsService } from '../../services/fiat-ramps.service';
import { ProviderPrice } from '../provider-price/provider-price';
import { DefaultMoonpayPrice } from './default-moonpay-price';

describe('DefaultMoonpayPrice', () => {
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let moonpayPrice: ProviderPrice;
  
  beforeEach(() => {
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', { getMoonpayQuotation: of({ ARG: 1 }) });
    moonpayPrice = new DefaultMoonpayPrice('USDC_polygon', 'ARG', fiatRampsServiceSpy);
  });

  it('new', () => {
    expect(moonpayPrice).toBeTruthy();
  });

  it('value', async () => {
    const price = await moonpayPrice.value().toPromise();
    expect(price).toEqual(1);
  });
});
