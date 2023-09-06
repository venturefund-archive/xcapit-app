import { Blockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';
import { rawSolanaData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { passEncryptedWallet, rawWalletData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-wallet-data';
import { FakeConnection } from '../../../../../swaps/shared-swaps/models/fakes/fake-connection';
import { FakeEthersWallet } from '../../../../../swaps/shared-swaps/models/fakes/fake-ethers-wallet';
import { FakeBlockchainTx } from '../../../../../swaps/shared-swaps/models/fakes/fake-blockchain-tx';
import { Wallet } from '../wallet';
import { SolanaWallet } from './solana-wallet';

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
