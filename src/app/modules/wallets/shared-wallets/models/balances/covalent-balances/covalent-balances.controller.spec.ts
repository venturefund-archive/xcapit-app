import { CovalentBalancesController } from './covalent-balances.controller';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { CovalentBalances } from './covalent-balances';

describe('CovalentBalancesController', () => {
  let service: CovalentBalancesController;

  beforeEach(() => {
    service = new CovalentBalancesController(null);
  });

  it('should create', () => {
    expect(service.new('0x000001', null, new FakeHttpClient(), 'https://testurl.com')).toBeInstanceOf(CovalentBalances);
  });

  it('should create with default', () => {
    expect(service.new('0x000001', null)).toBeInstanceOf(CovalentBalances);
  });
});
