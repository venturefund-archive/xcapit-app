import { AppStorageService, FakeAppStorage } from 'src/app/shared/services/app-storage/app-storage.service';
import { BlockchainRepo } from '../blockchain-repo/blockchain-repo';
import { Blockchain, DefaultBlockchain } from '../blockchain/blockchain';
import { Blockchains, DefaultBlockchains } from '../blockchains/blockchains';
import { FakeEthersWallet } from '../fakes/fake-ethers-wallet';
import { rawBlockchainsData, rawPolygonData, rawSolanaData } from '../fixtures/raw-blockchains-data';
import { rawStoredWalletDataDefaultMethod, rawStoredWalletDataLegacy, rawStoredWalletDataNew, rawStoredWalletDataNoneMethod } from '../fixtures/raw-stored-wallet-data';
import { Password } from '../password/password';
import { SolanaDerivedWallet } from '../solana-derived-wallet/solana-derived-wallet';
import { WalletRepo } from '../wallet-repo/wallet-repo';
import { SolanaWallet } from '../wallet/wallet';
import { Wallets } from './wallets';

fdescribe('Wallets', () => {
  let wallets: Wallets;
  const blockchains: Blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(() => {
    wallets = new Wallets(new WalletRepo(new FakeAppStorage(rawStoredWalletDataNoneMethod)), new FakeEthersWallet());
  });

  it('new', () => {
    expect(wallets).toBeTruthy();
  });

  it('create from with none method', async () => {
    const aPhrase = 'super test phrase';
    const aBlockchain = new DefaultBlockchain(rawPolygonData);
    const wallets = new Wallets(new WalletRepo(new FakeAppStorage({ wallet: 'wallet' })), new FakeEthersWallet());

    await wallets.createFrom(aPhrase, new Password('test'), blockchains, 'legacy');

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(rawStoredWalletDataLegacy.enc_wallet.addresses.MATIC);
  });

  it('create from with legacy method', async () => {
    const aPhrase = 'super test phrase';
    const aBlockchain = new DefaultBlockchain(rawPolygonData);
    const wallets = new Wallets(new WalletRepo(new FakeAppStorage({ wallet: 'wallet', creationMethod: 'legacy' })), new FakeEthersWallet());

    await wallets.createFrom(aPhrase, new Password('test'), blockchains, 'legacy');

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(rawStoredWalletDataLegacy.enc_wallet.addresses.MATIC);
  });

  it('create from with default method', async () => {
    const aPhrase = 'super test phrase';
    const aBlockchain = new DefaultBlockchain(rawPolygonData);
    const wallets = new Wallets(new WalletRepo(new FakeAppStorage({ wallet: 'wallet', creationMethod: 'default' })), new FakeEthersWallet());

    await wallets.createFrom(aPhrase, new Password('test'), blockchains, 'default');

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(rawStoredWalletDataDefaultMethod.enc_wallet.addresses.ERC20);
  });

  // it('create from', async () => {
  //   // spyOn(SolanaDerivedWallet.prototype, 'address').and.returnValue('0x3');
  //   // const saveSpy = spyOn(WalletRepo.prototype, 'save').and.callThrough();
  //   const aPhrase = 'super test phrase';
  //   const aBlockchain = new DefaultBlockchain(rawPolygonData);

  //   await wallets.createFrom(aPhrase, new Password('test'), 'default');

  //   expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
  //   expect(saveSpy).toHaveBeenCalledOnceWith({ ERC20: '0x1', MATIC: '0x1', SOLANA: '0x3' }, jasmine.any(String));
  // });

  // it('create from (legacy)', async () => {
  //   spyOn(SolanaDerivedWallet.prototype, 'address').and.returnValue('0x3');
  //   const saveSpy = spyOn(WalletRepo.prototype, 'save').and.callThrough();
  //   const aPhrase = 'super test phrase';
  //   const aBlockchain = new DefaultBlockchain(rawPolygonData);

  //   await wallets.createFrom(aPhrase, new Password('test'), 'legacy');

  //   expect((await wallets.oneBy(aBlockchain)).address()).toBeTruthy();
  //   expect(saveSpy).toHaveBeenCalledOnceWith({ ERC20: '0x1', MATIC: '0x2', SOLANA: '0x3' }, jasmine.any(String));
  // });

  // it('return one by blockchain', async () => {
  //   const expectedResult = rawStoredWalletDataNew.enc_wallet.addresses.MATIC;
  //   const aBlockchain = new DefaultBlockchain(rawPolygonData);

  //   expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  // });

  // it('return one by blockchain solana', async () => {
  //   const expectedResult = rawStoredWalletDataNew.enc_wallet.addresses.SOLANA;
  //   const aBlockchain = new DefaultBlockchain(rawSolanaData);

  //   expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  //   expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  // });

  // it('return one by blockchain (legacy)', async () => {
  //   storageSpy.get.and.resolveTo(rawStoredWalletData.enc_wallet);

  //   const expectedResult = rawStoredWalletData.enc_wallet.addresses.MATIC;
  //   const aBlockchain = new DefaultBlockchain(rawPolygonData);

  //   expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  // });

  // it('return one by blockchain solana (legacy)', async () => {
  //   storageSpy.get.and.resolveTo(rawStoredWalletData.enc_wallet);

  //   const expectedResult = rawStoredWalletData.enc_wallet.addresses.SOLANA;
  //   const aBlockchain = new DefaultBlockchain(rawSolanaData);

  //   expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  //   expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  // });
});
