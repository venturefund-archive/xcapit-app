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
      amount_out: '2',
      costs: '0.02917868',
    },
  };

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC', network: 'MATIC' });
    fakeHttpClientSpy = jasmine.createSpyObj('HttpClient', {
      post: of(amountOutResponse),
    });
    kriptonPrice = new DefaultKriptonPrice('ars', coinSpy, fakeHttpClientSpy);
  });

  it('new', () => {
    expect(kriptonPrice).toBeTruthy();
  });

  it('value', async () => {
    const price = await kriptonPrice.value().toPromise();

    expect(price).toEqual(0.5);
    expect(fakeHttpClientSpy.post).toHaveBeenCalledOnceWith(
      'https://app.kriptonmarket.com/public/calculate_amount_out',
      {
        currency_in: 'ars',
        amount_in: 1,
        currency_out: coinSpy.value,
        type: 'cash-in',
        network_out: 'polygon',
      }
    );
  });
});
