import { TokenPricesController } from './token-prices.controller';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { TokenPrices } from './token-prices';

describe('TokenPricesController', () => {
  let service: TokenPricesController;

  beforeEach(() => {
    service = new TokenPricesController(null);
  });

  it('should create', () => {
    expect(service.new(null, new FakeHttpClient(), 'https://testurl.com')).toBeInstanceOf(TokenPrices);
  });

  it('should create with default', () => {
    expect(service.new(null)).toBeInstanceOf(TokenPrices);
  });
});
