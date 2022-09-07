import { ethers } from "ethers";
import { FakeAppStorage } from "src/app/shared/services/app-storage/app-storage.service";
import { Blockchain } from "../blockchain/blockchain";
import { rawPolygonData, rawSolanaData } from "../fixtures/raw-blockchains-data";
import { rawStoredWalletData } from "../fixtures/raw-stored-wallet-data";
import { NewWalletRepo, WalletRepo } from "../wallet-repo/wallet-repo";
import { SolanaWallet } from "../wallet/wallet";
import { Wallets } from "./wallets";

describe('Wallets', () => {
  it('new', () => {
    expect(new Wallets(new WalletRepo(new FakeAppStorage()))).toBeTruthy();
  });

  it('return one by blockchain', async () => {
    const expectedResult = rawStoredWalletData.enc_wallet.addresses.MATIC;
    const aBlockchain = new Blockchain(rawPolygonData);
    const wallets = new Wallets(new WalletRepo(new FakeAppStorage(rawStoredWalletData)));

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
  });

  it('return one by blockchain solana', async () => {
    const expectedResult = rawStoredWalletData.enc_wallet.addresses.SOLANA;
    const aBlockchain = new Blockchain(rawSolanaData);
    const wallets = new Wallets(new WalletRepo(new FakeAppStorage(rawStoredWalletData)));

    expect((await wallets.oneBy(aBlockchain)).address()).toEqual(expectedResult);
    expect(await wallets.oneBy(aBlockchain)).toBeInstanceOf(SolanaWallet);
  });
  
  it('return one by blockchain with NewWalletRepo', async () => {
    const walletSpy: jasmine.SpyObj<ethers.Wallet> = jasmine.createSpyObj('Wallet', { encrypt: Promise.resolve()}, { address: ''});
    const spy = spyOn(ethers.Wallet, 'fromMnemonic').and.returnValue(walletSpy);
    const aBlockchain = new Blockchain(rawPolygonData);
    const wallets = new Wallets(new NewWalletRepo('testPhrase', 'testPassword'));
    (await wallets.oneBy(aBlockchain)).address()
    expect(spy).toHaveBeenCalledWith('testPhrase', jasmine.any(String), ethers.wordlists.en);
  });
});
