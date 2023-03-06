import { FakeEthersWallet } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-ethers-wallet';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { MnemonicOf } from './mnemonic-of';


describe('Mnemonic Of', () => {
  let aMnemonic: MnemonicOf;
  const aPhrase = 'test test';

  beforeEach(() => {
    aMnemonic = new MnemonicOf(
      new Password('aPassword'),
      'aEncryptedWalletStringRepresentation',
      new FakeEthersWallet({phrase: aPhrase})
    );
  });

  it('new', () => {
    expect(aMnemonic).toBeTruthy();
  });

  it('phrase', async () => {
    expect(await aMnemonic.phrase()).toEqual(aPhrase);
  });
});
