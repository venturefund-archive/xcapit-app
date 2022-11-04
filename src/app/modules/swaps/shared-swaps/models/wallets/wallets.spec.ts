import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { BlockchainRepo } from '../blockchain-repo/blockchain-repo';
import { Blockchain } from '../blockchain/blockchain';
import { Blockchains, DefaultBlockchains } from '../blockchains/blockchains';
import { FakeEthersWallet } from '../fakes/fake-ethers-wallet';
import { rawBlockchainsData, rawPolygonData, rawSolanaData } from '../fixtures/raw-blockchains-data';
import { rawStoredWalletData } from '../fixtures/raw-stored-wallet-data';
import { Password } from '../password/password';
import { WalletRepo } from '../wallet-repo/wallet-repo';
import { SolanaWallet } from '../wallet/wallet';
import { Wallets } from './wallets';

fdescribe('Wallets', () => {
  let wallets: Wallets;

  beforeEach(() => {
    wallets = new Wallets(
      new WalletRepo(new FakeAppStorage(rawStoredWalletData)),
      new FakeEthersWallet()
    );
  });

  it('new', () => {
    expect(wallets).toBeTruthy();
  });

  it('create from', async () => {
    const aPhrase = 'super test phrase';
    const aBlockchain = new Blockchain(rawPolygonData);
    const wallets = new Wallets(new WalletRepo(new FakeAppStorage()), new FakeEthersWallet());
    const blockchains: Blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

    await wallets.createFrom(aPhrase, new Password('test'), blockchains);

    expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
  });

  it('return one by blockchain', async () => {
    const expectedResult = rawStoredWalletData.enc_wallet.addresses.MATIC;
    const aBlockchain = new Blockchain(rawPolygonData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  });

  it('return one by blockchain solana', async () => {
    const expectedResult = rawStoredWalletData.enc_wallet.addresses.SOLANA;
    const aBlockchain = new Blockchain(rawSolanaData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
    expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  });
});
