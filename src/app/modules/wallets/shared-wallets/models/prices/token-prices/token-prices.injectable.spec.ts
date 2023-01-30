import { TokenPricesInjectable } from './token-prices.injectable';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { TokenPrices } from './token-prices';

describe('TokenPricesInjectable', () => {
  let service: TokenPricesInjectable;

  beforeEach(() => {
    service = new TokenPricesInjectable(null);
  });

  it('should create', () => {
    expect(service.create(null, new FakeHttpClient(), 'https://testurl.com')).toBeInstanceOf(TokenPrices);
  });

  it('should create with default', () => {
    expect(service.create(null)).toBeInstanceOf(TokenPrices);
  });
});
