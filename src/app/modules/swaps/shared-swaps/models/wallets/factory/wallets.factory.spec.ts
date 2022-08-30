import { Mnemonic } from 'ethers/lib/utils';
import { WalletMnemonicService } from 'src/app/modules/wallets/shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { rawStoredWalletData } from '../../fixtures/raw-stored-wallet-data';
import { WalletsFactory } from './wallets.factory';

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test phrase other word number another rooster keyboard confort destroy jingle july',
};
describe('Wallets Factory', () => {
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  beforeEach(() => {
    walletMnemonicServiceSpy = jasmine.createSpyObj(
      'WalletMnemonicService',
      {
        newMnemonic: testMnemonic,
      },
      {
        mnemonic: testMnemonic,
      }
    );
  });
  it('new', () => {
    expect(new WalletsFactory()).toBeTruthy();
  });

  it('createFromStorage', () => {
    expect(new WalletsFactory().createFromStorage(new FakeAppStorage(rawStoredWalletData))).toBeTruthy();
  });

  it('createFromPhrase', () => {
    expect(new WalletsFactory().createFromPhrase('testPhrase', 'testPassword')).toBeTruthy();
  });
});
