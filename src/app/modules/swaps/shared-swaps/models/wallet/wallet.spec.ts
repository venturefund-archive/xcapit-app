import { FakeBlockchainTx } from '../fakes/fake-blockchain-tx';
import { FakeEthersWallet } from '../fakes/fake-ethers-wallet';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { passEncryptedWallet, rawWalletData } from '../fixtures/raw-wallet-data';
import { DefaultWallet, FakeWallet, Wallet } from './wallet';
import { providers } from '../fakes/fake-ethers-providers';
import { Blockchain } from '../blockchain/blockchain';

describe('DefaultWallet', () => {
  let wallet: Wallet;
  let testObject: any;
  const blockchain = new Blockchain(rawEthereumData);

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;
  });

  beforeEach(() => {
    wallet = new DefaultWallet(rawWalletData, blockchain, new FakeEthersWallet(), providers);
    testObject = { testMethod: () => Promise.resolve(passEncryptedWallet) };
    spyOn(testObject, 'testMethod').and.callThrough();
  });

  it('new', () => {
    expect(wallet).toBeTruthy();
  });

  it('address access', () => {
    expect(wallet.address()).toEqual('0x0');
  });

  it('on need pass subscribe', () => {
    wallet.onNeedPass().subscribe(() => 'superpass');

    expect(true).toBeTrue();
  });

  it('notify need pass on send tx with fakes', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());

    const result = await wallet.sendTxs([]);

    expect(result).toEqual(true);
    expect(testObject.testMethod).toHaveBeenCalledTimes(1);
  });

  it('notify wallet was decrypted', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());
    wallet.onDecryptedWallet().subscribe(() => testObject.testMethod());

    await wallet.sendTxs([]);

    expect(testObject.testMethod).toHaveBeenCalledTimes(2);
  });

  it('send a few transactions', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());
    const result = await wallet.sendTxs([new FakeBlockchainTx(), new FakeBlockchainTx()]);

    expect(result).toEqual(true);
  });

  describe('FakeWallet', () => {
    let fakeWallet: Wallet;

    beforeEach(() => {
      //fakeWallet = new FakeWallet(Promise.reject({message:'invalid password'}));
      fakeWallet = new FakeWallet();
    });

    it('notify need pass on send tx with fakes', async () => {
      fakeWallet.onNeedPass().subscribe(() => testObject.testMethod());

      await fakeWallet.sendTxs([]);

      expect(testObject.testMethod).toHaveBeenCalledTimes(1);
    });

    it('notify wallet was decrypted', async () => {
      fakeWallet.onNeedPass().subscribe(() => testObject.testMethod());
      fakeWallet.onDecryptedWallet().subscribe(() => testObject.testMethod());

      await fakeWallet.sendTxs([]);

      expect(testObject.testMethod).toHaveBeenCalledTimes(2);
    });

    it('send a few transactions', async () => {
      fakeWallet.onNeedPass().subscribe(() => testObject.testMethod());
      const result = await fakeWallet.sendTxs([new FakeBlockchainTx(), new FakeBlockchainTx()]);

      expect(result).toEqual(false);
    });
  });
});
