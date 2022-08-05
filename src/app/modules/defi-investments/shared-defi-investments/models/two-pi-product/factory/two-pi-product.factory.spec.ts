import { ApiWalletService } from '../../../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Vault } from '@2pi-network/sdk';
import { TwoPiProductFactory } from './two-pi-product.factory';


describe('TwoPiProductFactory', () => {
  let productFactory: TwoPiProductFactory;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let aVaultSpy: jasmine.SpyObj<Vault>;

  beforeEach(() => {
    productFactory = new TwoPiProductFactory(apiWalletServiceSpy);
  });

  it('new', () => {
    expect(productFactory).toBeTruthy();
  });

  it('create', () => {
    expect(productFactory.create(aVaultSpy)).toBeTruthy();
  });
});
