import { Wallet } from '../wallet';
import { Blockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';
import { rawEthereumData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { DefaultWallet } from './default-wallet';
import { passEncryptedWallet, rawWalletData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-wallet-data';
import { FakeEthersWallet } from '../../../../../swaps/shared-swaps/models/fakes/fake-ethers-wallet';
import { fakeProviders } from '../../../../../swaps/shared-swaps/models/fakes/fake-ethers-providers';
import { FakeBlockchainTx } from '../../../../../swaps/shared-swaps/models/fakes/fake-blockchain-tx';

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

  it('sign a transaction', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());
    expect(await wallet.signTransaction(new FakeBlockchainTx())).toEqual('a signed tx');
  });

  it('sign a message', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());
    const result = await wallet.signMessage('some message');

    expect(testObject.testMethod).toHaveBeenCalledTimes(1);
    expect(result).toEqual('signed message');
  });

  it('sign typed data', async () => {
    wallet.onNeedPass().subscribe(() => testObject.testMethod());

    await expectAsync(wallet.signTypedData(null, null, null)).toBeResolved();
    expect(testObject.testMethod).toHaveBeenCalledTimes(1);
  });
});
