import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ProviderPrice } from '../provider-price/provider-price';
import { DefaultKriptonPrice } from './default-kripton-price';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('DefaultKriptonPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let kriptonPrice: ProviderPrice;
  let fakeHttpClientSpy: jasmine.SpyObj<HttpClient>;
  const amountOutResponse = {
    data: {
      amount_in: '10000.0',
      amount_out: '26.0',
      costs: '1.0',
      commissions: {
        percentage: 1.5,
        amount: 0.42374845,
      },
      taxes: {
        percentage: 1.5,
        amount: 0.42374845,
      },
      fee_of_network: '0.6',
    },
  };

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' });
    fakeHttpClientSpy = jasmine.createSpyObj('HttpClient', {
      post: of(amountOutResponse),
    });
    kriptonPrice = new DefaultKriptonPrice('ars',coinSpy,'cash-in', fakeHttpClientSpy);
  });

  it('new', () => {
    expect(kriptonPrice).toBeTruthy();
  });

  it('value', async () => {
    const price = await kriptonPrice.value().toPromise();

    expect(price).toEqual(370.3703703703703);
    expect(fakeHttpClientSpy.post).toHaveBeenCalledOnceWith(
      'https://app.kriptonmarket.com/public/calculate_amount_out',
      {
        currency_in: 'ars',
        amount_in: 10000,
        currency_out: coinSpy.value,
        type: 'cash-in',
        network_out: 'polygon',
      }
    );
  });
});
