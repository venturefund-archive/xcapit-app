import { FakeEthersWallet } from './fake-ethers-wallet';

describe('Fake Ethers Wallet', () => {
  let fakeWallet: FakeEthersWallet;

  beforeEach(() => {
    fakeWallet = new FakeEthersWallet();
  });

  it('new', () => {
    expect(fakeWallet).toBeTruthy();
  });

  it('address', () => {
    expect(fakeWallet.address).toBeUndefined();
  });

  it('fromEncryptedJson', async () => {
    expect(await fakeWallet.fromEncryptedJson()).toBeTruthy();
  });

  it('fromMnemonic', () => {
    expect(fakeWallet.fromMnemonic()).toBeTruthy();
  });

  it('connect', () => {
    expect(fakeWallet.connect()).toBeTruthy();
  });

  it('encrypt', async () => {
    expect(await fakeWallet.encrypt()).toEqual('');
  });

  it('mnemonic', () => {
    expect(fakeWallet.mnemonic.phrase).toEqual('');
  });

  it('custom mnemonic', () => {
    const aPhrase = 'test test';
    fakeWallet = new FakeEthersWallet({ phrase: aPhrase });

    expect(fakeWallet.mnemonic.phrase).toEqual(aPhrase);
  });

  it('signMessage', async () => {
    expect(await fakeWallet.signMessage()).toEqual('signed message');
  });
});
