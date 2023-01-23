import { CovalentBalancesInjectable } from './covalent-balances-injectable.service';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { CovalentBalances } from './covalent-balances';

describe('CovalentBalancesInjectable', () => {
  let service: CovalentBalancesInjectable;

  beforeEach(() => {
    service = new CovalentBalancesInjectable(null);
  });

  it('should create', () => {
    expect(service.create('0x000001', null, new FakeHttpClient(), 'https://testurl.com')).toBeInstanceOf(CovalentBalances);
  });

  it('should create with default', () => {
    expect(service.create('0x000001', null)).toBeInstanceOf(CovalentBalances);
  });
});
