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

  it('blockchain access', () => {
    expect(wallet.blockchain().id()).toEqual('1');
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

  it('send a few transactions', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());
    const result = await wallet.sendTxs([new FakeBlockchainTx(), new FakeBlockchainTx()]);

    expect(result).toEqual(true);
  });

  it('send a single transaction', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());
    const result = await wallet.sendTransaction(new FakeBlockchainTx());

    expect(result.hash).toEqual('aTestHash');
  });

  it('sign a message', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());
    const result = await wallet.signMessage('some message');

    expect(testObject.testMethod).toHaveBeenCalledTimes(1);
    expect(result).toEqual('signed message');
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

    it('blockchain', () => {
      const wallet = new FakeWallet(Promise.resolve(false), null, null, blockchain);

      expect(wallet.blockchain().id()).toEqual('1');
    });

    it('send a few transactions', async () => {
      fakeWallet.onNeedPass().subscribe(() => testObject.testMethod());
      const result = await fakeWallet.sendTxs([new FakeBlockchainTx(), new FakeBlockchainTx()]);

      expect(result).toEqual(false);
    });

    it('send a single transaction', async () => {
      const result = await fakeWallet.sendTransaction(new FakeBlockchainTx());

      expect(result.hash).toEqual('aTxHash');
    });

    it('sign a message', async () => {
      const result = await fakeWallet.signMessage('some message');

      expect(result).toEqual('signed message');
    });
  });
});

describe('SolanaWallet', () => {
  let wallet: Wallet;
  let testObject: any;
  const blockchain = new Blockchain(rawSolanaData);

  beforeEach(() => {
    wallet = new SolanaWallet(rawWalletData, blockchain, new FakeConnection(), new FakeEthersWallet(), () => {});
    testObject = { testMethod: () => Promise.resolve(passEncryptedWallet) };
    spyOn(testObject, 'testMethod').and.callThrough();
  });

  it('new', () => {
    expect(wallet).toBeTruthy();
  });

  it('create', () => {
    expect(SolanaWallet.create(rawWalletData, blockchain)).toBeTruthy();
  });

  it('address access', () => {
    expect(wallet.address()).toEqual('0x0');
  });

  it('on need pass subscribe', () => {
    wallet.onNeedPass().subscribe(() => 'superpass');

    expect(true).toBeTrue();
  });

  it('sendTx', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());

    const result = await wallet.sendTxs([new FakeBlockchainTx()]);

    expect(result).toBeTrue();
  });

  it('notify need pass on send tx with fakes', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());

    const result = await wallet.sendTxs([]);

    expect(result).toEqual(true);
    expect(testObject.testMethod).toHaveBeenCalledTimes(1);
  });

  it('send a few transactions', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());

    const result = await wallet.sendTxs([new FakeBlockchainTx(), new FakeBlockchainTx()]);

    expect(result).toEqual(true);
  });

  it('blockchain', () => {
    expect(wallet.blockchain().id()).toEqual('1399811149');
  });
});
