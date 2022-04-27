import { TestBed } from '@angular/core/testing';
import { CovalentBalancesController } from './covalent-balances.controller';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { CovalentBalances } from './covalent-balances';

describe('CovalentBalancesController', () => {
  let service: CovalentBalancesController;

  beforeEach(() => {
    service = TestBed.inject(CovalentBalancesController);
  });

  it('should create', () => {
    expect(service.new('0x000001', [], new FakeHttpClient(), 'https://testurl.com')).toBeInstanceOf(CovalentBalances);
  });

  it('should create with default', () => {
    expect(service.new('0x000001', [], new FakeHttpClient())).toBeInstanceOf(CovalentBalances);
  });
});
