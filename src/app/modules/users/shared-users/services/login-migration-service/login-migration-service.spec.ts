import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { XAuthService } from '../x-auth/x-auth.service';
import { LoginMigrationService } from './login-migration-service';


describe('LoginMigrationService', () => {
  let service: LoginMigrationService;
  let fakeStorage: FakeAppStorage;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let xAuthServiceSpy: jasmine.SpyObj<XAuthService>;

  beforeEach(() => {
    fakeStorage = new FakeAppStorage();
    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getDecryptedERC20Wallet: Promise.resolve({ signMessage: () => Promise.resolve('aSignedMsg') }),
    });
    xAuthServiceSpy = jasmine.createSpyObj('XAuthService', {
      saveToken: fakeStorage.set('x-auth', 'a_test_xAuth_token'),
    });
    service = new LoginMigrationService(
      xAuthServiceSpy,
      fakeStorage as unknown as IonicStorageService,
      walletEncryptionServiceSpy
    );
  });

  it('new', () => {
    expect(service).toBeTruthy();
  });

  it('migrate', async () => {
    await service.migrate('aFakePassword');

    expect(await fakeStorage.get('x-auth')).toBeTruthy();
    expect(await fakeStorage.get('loginToken')).toBeTruthy();
  });
});
