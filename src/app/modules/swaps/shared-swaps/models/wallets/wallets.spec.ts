import { FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { BlockchainRepo } from '../blockchain-repo/blockchain-repo';
import { Blockchain } from '../blockchain/blockchain';
import { Blockchains, DefaultBlockchains } from '../blockchains/blockchains';
import { FakeEthersWallet } from '../fakes/fake-ethers-wallet';
import { rawBlockchainsData, rawPolygonData, rawSolanaData } from '../fixtures/raw-blockchains-data';
import { rawStoredWalletData, rawStoredWalletDataNew } from '../fixtures/raw-stored-wallet-data';
import { Password } from '../password/password';
import { SolanaDerivedWallet } from '../solana-derived-wallet/solana-derived-wallet';
import { WalletRepo } from '../wallet-repo/wallet-repo';
import { SolanaWallet } from '../wallet/wallet';
import { Wallets } from './wallets';

describe('Wallets', () => {
  let wallets: Wallets;
  const blockchains: Blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(() => {
    wallets = new Wallets(
      new WalletRepo(new FakeAppStorage(rawStoredWalletDataNew)),
      blockchains,
      new FakeEthersWallet()
    );
  });

  it('new', () => {
    expect(wallets).toBeTruthy();
  });

  it('create from', async () => {
    spyOn(SolanaDerivedWallet.prototype, 'address').and.returnValue('0x3');
    const saveSpy = spyOn(WalletRepo.prototype, 'save').and.callThrough();
    const aPhrase = 'super test phrase';
    const aBlockchain = new Blockchain(rawPolygonData);

    await wallets.createFrom(aPhrase, new Password('test'), 'default');

    expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
    expect(saveSpy).toHaveBeenCalledOnceWith({ ERC20: '0x1', MATIC: '0x1', SOLANA: '0x3' }, jasmine.any(String));
  });

  it('create from (legacy)', async () => {
    spyOn(SolanaDerivedWallet.prototype, 'address').and.returnValue('0x3');
    const saveSpy = spyOn(WalletRepo.prototype, 'save').and.callThrough();
    const aPhrase = 'super test phrase';
    const aBlockchain = new Blockchain(rawPolygonData);

    await wallets.createFrom(aPhrase, new Password('test'), 'legacy');

    expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
    expect(saveSpy).toHaveBeenCalledOnceWith({ ERC20: '0x1', MATIC: '0x2', SOLANA: '0x3' }, jasmine.any(String));
  });

  it('return one by blockchain', async () => {
    const expectedResult = rawStoredWalletDataNew.enc_wallet.addresses.MATIC;
    const aBlockchain = new Blockchain(rawPolygonData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  });

  it('return one by blockchain solana', async () => {
    const expectedResult = rawStoredWalletDataNew.enc_wallet.addresses.SOLANA;
    const aBlockchain = new Blockchain(rawSolanaData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
    expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  });

  it('return one by blockchain (legacy)', async () => {
    wallets = new Wallets(new WalletRepo(new FakeAppStorage(rawStoredWalletData)), blockchains, new FakeEthersWallet());

    const expectedResult = rawStoredWalletData.enc_wallet.addresses.MATIC;
    const aBlockchain = new Blockchain(rawPolygonData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  });

  it('return one by blockchain solana (legacy)', async () => {
    wallets = new Wallets(new WalletRepo(new FakeAppStorage(rawStoredWalletData)), blockchains, new FakeEthersWallet());

    const expectedResult = rawStoredWalletData.enc_wallet.addresses.SOLANA;
    const aBlockchain = new Blockchain(rawSolanaData);

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
    expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  });
});
