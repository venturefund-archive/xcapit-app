import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { NetworkConfig } from './network-config';

describe('NetworkConfig', () => {
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getGasPrice: of({ gas_price: '100000000' }) });
  });

  it('should create', () => {
    expect(new NetworkConfig('', apiWalletServiceSpy)).toBeTruthy();
  });

  it('should return empty config if network is not polygon', async () => {
    expect(await new NetworkConfig('ERC20', apiWalletServiceSpy).value()).toEqual({});
  });

  it('should return gas config if network is polygon', async () => {
    expect(await new NetworkConfig('MATIC', apiWalletServiceSpy).value()).toEqual({ gasPrice: '100000000' });
  });
});
