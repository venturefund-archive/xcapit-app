import { FakeEthersWallet } from "./fake-ethers-wallet";


describe('Fake Ethers Wallet', () => {

  let fakeWallet: FakeEthersWallet;

  beforeEach(() => {
    fakeWallet = new FakeEthersWallet();
  });

  it('new', () => {
    expect(fakeWallet).toBeTruthy();
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
});
