import { of } from 'rxjs';
import { AppStorageService } from '../../../../../shared/services/app-storage/app-storage.service';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { Password } from '../../../../swaps/shared-swaps/models/password/password';
import { SimpleSubject } from 'src/app/shared/models/simple-subject/simple-subject';
import { UpgradeWallets } from './upgrade-wallets';
import { WalletsFactory } from '../wallets/factory/wallets.factory';
import { DefaultWallets } from '../wallets/default-wallets';

describe('UpgradeWallets', () => {
  let upgradeWallets: UpgradeWallets;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletFactorySpy: jasmine.SpyObj<WalletsFactory>;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let walletsSpy: jasmine.SpyObj<DefaultWallets>;
  const onUpgradedSubject = new SimpleSubject();
  const onNeedPassSubject = new SimpleSubject();

  beforeEach(() => {
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', {
      get: Promise.resolve({ wallet: '', addresses: { ERC20: '0x123' } }),
    });
    walletsSpy = jasmine.createSpyObj('Wallets', {
      upgrade: Promise.resolve(),
      onUpgraded: onUpgradedSubject,
      onNeedPass: onNeedPassSubject
    });
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
    upgradeWallets.onNeedPass().subscribe(() => Promise.resolve(new Password('TestPass1234')));

    await upgradeWallets.run();
    await onNeedPassSubject.notify();
    await onUpgradedSubject.notify();

    expect(walletsSpy.upgrade).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.saveWalletAddresses).toHaveBeenCalledTimes(1);
  });

  it('run without upgrade', async () => {
    await upgradeWallets.run();

    expect(walletsSpy.upgrade).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.saveWalletAddresses).not.toHaveBeenCalled();
  });
});
