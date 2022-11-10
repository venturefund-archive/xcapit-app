import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { ProviderPrice } from "../provider-price/provider-price";
import { DefaultKriptonPrice } from "./default-kripton-price";


describe('DefaultKriptonPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let kriptonPrice: ProviderPrice;
  const amountOutResponse = {
    data: {
      amount_out: '2',
      costs: '0.02917868',
    },
  };

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
    kriptonPrice = new DefaultKriptonPrice('ars', coinSpy, new FakeHttpClient({}, amountOutResponse));
  });

  it('new', () => {
    expect(kriptonPrice).toBeTruthy();
  });


  it('value', async () => {
    const price = await kriptonPrice.value().toPromise();

    expect(price).toEqual(0.5);
  });
});