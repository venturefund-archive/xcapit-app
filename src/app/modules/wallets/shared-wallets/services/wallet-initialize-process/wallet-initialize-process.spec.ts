import { TestBed } from '@angular/core/testing';
import { WalletInitializeProcess } from './wallet-initialize-process';
import { BlockchainsFactory } from '../../../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { XAuthService } from '../../../../users/shared-users/services/x-auth/x-auth.service';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { IonicStorageService } from '../../../../../shared/services/ionic-storage/ionic-storage.service';
import { WalletBackupService } from '../wallet-backup/wallet-backup.service';
import { NotificationsService } from '../../../../notifications/shared-notifications/services/notifications/notifications.service';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { of } from 'rxjs';
import { Wallet } from 'ethers';
import { FakeEthersWallet } from '../../../../swaps/shared-swaps/models/fakes/fake-ethers-wallet';
import { NullNotificationsService } from '../../../../notifications/shared-notifications/services/null-notifications/null-notifications.service';

describe('WalletInitializeProcess', () => {
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  let service: WalletInitializeProcess;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let authServiceSpy: jasmine.SpyObj<XAuthService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let walletSpy: jasmine.SpyObj<Wallet>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let nullNotificationServiceSpy: jasmine.SpyObj<NullNotificationsService>;

  beforeEach(() => {
    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getEncryptedWallet: Promise.resolve({ addresses: { MATIC: '0x0000001' }, wallet: '{}' }),
    });

    walletSpy = jasmine.createSpyObj(
      'Wallet',
      {
        signMessage: Promise.resolve('aSignedMessage'),
      },
      { mnemonic: { path: 'aDerivedPath' }, address: 'anAddress' }
    );

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
      set: Promise.resolve(null),
    });

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { saveWalletAddresses: of({}) }, {});
    authServiceSpy = jasmine.createSpyObj('XAuthService', { saveToken: Promise.resolve() });
    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
      disableModal: Promise.resolve(),
      enableModal: Promise.resolve(),
    });

    nullNotificationServiceSpy = jasmine.createSpyObj('NullNotificationsService', ['subscribeTo', 'unsubscribeFrom']);

    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', {
      getInstance: nullNotificationServiceSpy,
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: XAuthService, useValue: authServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
      ],
    });
    service = TestBed.inject(WalletInitializeProcess);
    service.ethersWallet = new FakeEthersWallet();
  });

  it('create', () => {
    expect(service).toBeTruthy();
  });

  it('run', async () => {
    await service.run(new Password('aPassword'), true);
    expect(authServiceSpy.saveToken).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.saveWalletAddresses).toHaveBeenCalledTimes(1);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('protectedWallet', true);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith(
      'loginToken',
      'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA=='
    );
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('loggedIn', true);
    expect(walletBackupServiceSpy.disableModal).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
    expect(walletBackupServiceSpy.enableModal).not.toHaveBeenCalled();
  });

  it('run with disabled notifications', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(null));
    await service.run(new Password('aPassword'), true);
    expect(authServiceSpy.saveToken).toHaveBeenCalledTimes(1);
    expect(apiWalletServiceSpy.saveWalletAddresses).toHaveBeenCalledTimes(1);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('_enabledPushNotifications', true);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('protectedWallet', true);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith(
      'loginToken',
      'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA=='
    );
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('loggedIn', true);
    expect(walletBackupServiceSpy.disableModal).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.subscribeTo).toHaveBeenCalledTimes(1);
    expect(nullNotificationServiceSpy.unsubscribeFrom).toHaveBeenCalledTimes(1);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('userAcceptedToS', true);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('tokens_structure_migrated', true);
    expect(walletBackupServiceSpy.enableModal).toHaveBeenCalledTimes(1);
  });
});
