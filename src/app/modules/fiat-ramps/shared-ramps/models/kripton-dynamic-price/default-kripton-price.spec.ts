import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { DefaultKriptonPrice, FakeKriptonPrice, KriptonPrice } from "./default-kripton-price";


describe('DefaultKriptonPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let kriptonPrice: KriptonPrice;
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

describe('FakeKriptonPrice', () => {
  const testValue = 7;
  let kriptonPrice: KriptonPrice;

  beforeEach(() => {
    kriptonPrice = new FakeKriptonPrice(testValue);
  });

  it('new', () => {
    expect(kriptonPrice).toBeTruthy();
  });

  it('value', async () => {
    expect(await kriptonPrice.value().toPromise()).toEqual(testValue);
  });
});

