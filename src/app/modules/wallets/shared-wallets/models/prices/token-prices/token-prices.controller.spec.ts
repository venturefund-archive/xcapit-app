import { TestBed } from '@angular/core/testing';
import { TokenPricesController } from './token-prices.controller';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { TokenPrices } from './token-prices';

describe('TokenPricesController', () => {
  let service: TokenPricesController;

  beforeEach(() => {
    service = TestBed.inject(TokenPricesController);
  });

  it('should create', () => {
    expect(service.new([], new FakeHttpClient(), 'https://testurl.com')).toBeInstanceOf(TokenPrices);
  });

  it('should create with default', () => {
    expect(service.new([], new FakeHttpClient())).toBeInstanceOf(TokenPrices);
  });
});
