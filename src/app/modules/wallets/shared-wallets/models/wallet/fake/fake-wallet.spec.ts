import { FakeBlockchainTx } from '../../../../../swaps/shared-swaps/models/fakes/fake-blockchain-tx';
import { Wallet } from '../wallet';
import { FakeWallet } from './fake-wallet';
import { passEncryptedWallet } from '../../../../../swaps/shared-swaps/models/fixtures/raw-wallet-data';
import { Blockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';
import { rawEthereumData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';

describe('FakeWallet', () => {
  let fakeWallet: Wallet;
  let testObject: any;

  const blockchain = new Blockchain(rawEthereumData);

  beforeEach(() => {
    fakeWallet = new FakeWallet();
    testObject = { testMethod: () => Promise.resolve(passEncryptedWallet) };
    spyOn(testObject, 'testMethod').and.callThrough();
  });

  it('notify need pass on send tx with fakes', async () => {
    fakeWallet.onNeedPass().subscribe(() => testObject.testMethod());

    await fakeWallet.sendTxs([]);

    expect(testObject.testMethod).toHaveBeenCalledTimes(1);
  });

  it('address', () => {
    const addressTestValue = 'x';
    fakeWallet = new FakeWallet(Promise.resolve(false), null, addressTestValue);

    expect(fakeWallet.address()).toEqual(addressTestValue);
  });

  it('blockchain', () => {
    fakeWallet = new FakeWallet(Promise.resolve(false), null, null, blockchain);

    expect(fakeWallet.blockchain().id()).toEqual('1');
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

  it('sign a transaction', async () => {
    expect(await fakeWallet.signTransaction(new FakeBlockchainTx())).toEqual('a signed tx');
  });

  it('sign a message', async () => {
    const result = await fakeWallet.signMessage('some message');

    expect(result).toEqual('signed message');
  });

  it('sign typed data', async () => {
    fakeWallet.onNeedPass().subscribe(() => testObject.testMethod());

    await expectAsync(fakeWallet.signTypedData(null, null, null)).toBeResolved();
    expect(testObject.testMethod).toHaveBeenCalledTimes(1);
  });
});
