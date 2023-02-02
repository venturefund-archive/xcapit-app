import { FakeBlockchainTx } from '../fakes/fake-blockchain-tx';
import { FakeEthersWallet } from '../fakes/fake-ethers-wallet';
import { rawEthereumData, rawSolanaData } from '../fixtures/raw-blockchains-data';
import { passEncryptedWallet, rawWalletData } from '../fixtures/raw-wallet-data';
import { DefaultWallet, FakeWallet, SolanaWallet, Wallet } from './wallet';
import { fakeProviders } from '../fakes/fake-ethers-providers';
import { Blockchain } from '../blockchain/blockchain';
import { FakeConnection } from '../fakes/fake-connection';

describe('DefaultWallet', () => {
  let wallet: Wallet;
  let testObject: any;
  const blockchain = new Blockchain(rawEthereumData);

  beforeEach(() => {
    wallet = new DefaultWallet(rawWalletData, blockchain, new FakeEthersWallet(), fakeProviders);
    testObject = { testMethod: () => Promise.resolve(passEncryptedWallet) };
    spyOn(testObject, 'testMethod').and.callThrough();
  });

  it('new', () => {
    expect(wallet).toBeTruthy();
  });

  it('address access', () => {
    expect(wallet.address()).toEqual('0x0');
  });

  it('notify need pass on send tx with fakes', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());

    const result = await wallet.sendTxs([]);

    expect(result).toEqual([]);
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

    expect(result).toEqual(['testHash', 'testHash']);
  });

  describe('FakeWallet', () => {
    let fakeWallet: Wallet;

    beforeEach(() => {
      fakeWallet = new FakeWallet();
    });

    it('notify need pass on send tx with fakes', async () => {
      fakeWallet.onNeedPass().subscribe(() => testObject.testMethod());

      await fakeWallet.sendTxs([]);

      expect(testObject.testMethod).toHaveBeenCalledTimes(1);
    });

    it('address', () => {
      const addressTestValue = 'x';
      const wallet = new FakeWallet(Promise.resolve(false), null, addressTestValue);

      expect(wallet.address()).toEqual(addressTestValue);
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

      expect(result).toEqual(['testHash']);
    });
  });
});

describe('SolanaWallet', () => {
  let wallet: Wallet;
  let testObject: any;
  const blockchain = new Blockchain(rawSolanaData);

  beforeEach(() => {
    wallet = new SolanaWallet(
      rawWalletData,
      blockchain,
      new FakeConnection(),
      new FakeEthersWallet()
    );
    testObject = { testMethod: () => Promise.resolve(passEncryptedWallet) };
    spyOn(testObject, 'testMethod').and.callThrough();
  });

  it('new', () => {
    expect(wallet).toBeTruthy();
  });

  it('create', () => {
    wallet = SolanaWallet.create(rawWalletData, blockchain);
    expect(wallet).toBeTruthy();
  });

  it('address access', () => {
    expect(wallet.address()).toEqual('0x0');
  });

  it('sendTxs', async () => {
    const result = await wallet.sendTxs([new FakeBlockchainTx(), new FakeBlockchainTx()]);
    expect(result).toEqual(['testHash', 'testHash']);
  });
});
