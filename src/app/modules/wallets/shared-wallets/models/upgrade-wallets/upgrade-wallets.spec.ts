import { of } from 'rxjs';
import { Wallets } from 'src/app/modules/swaps/shared-swaps/models/wallets/wallets';
import { AppStorageService } from '../../../../../shared/services/app-storage/app-storage.service';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { WalletsFactory } from '../../../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { Password } from '../../../../swaps/shared-swaps/models/password/password';
import { SimpleSubject } from 'src/app/shared/models/simple-subject/simple-subject';
import { UpgradeWallets } from './upgrade-wallets';

describe('UpgradeWallets', () => {
  let upgradeWallets: UpgradeWallets;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let walletsSpy: jasmine.SpyObj<Wallets>;
  let testSimpleSubject = new SimpleSubject();

  beforeEach(() => {
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', {
      get: Promise.resolve({ wallet: '', addresses: { ERC20: '0x123' } }),
    });
    walletsSpy = jasmine.createSpyObj('Wallets', { upgrade: Promise.resolve(), onUpgraded: testSimpleSubject });
    walletFactorySpy = jasmine.createSpyObj('WalletFactory', {
      create: walletsSpy,
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { saveWalletAddresses: of({}) });
    upgradeWallets = new UpgradeWallets(walletFactorySpy, appStorageServiceSpy, apiWalletServiceSpy);
  });

  it('new', () => {
    expect(upgradeWallets).toBeTruthy();
  });

  it('run', async () => {
    await upgradeWallets.run(new Password('TestPass1234'));
    await testSimpleSubject.notify();

    expect(walletsSpy.upgrade).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.saveWalletAddresses).toHaveBeenCalledTimes(1);
  });

  it('run without upgrade', async () => {
    await upgradeWallets.run(new Password('TestPass1234'));

    expect(walletsSpy.upgrade).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.saveWalletAddresses).not.toHaveBeenCalled();
  });
});
