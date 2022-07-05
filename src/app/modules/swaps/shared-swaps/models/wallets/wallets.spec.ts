import { FakeAppStorage } from "src/app/shared/services/app-storage/app-storage.service";
import { Blockchain } from "../blockchain/blockchain";
import { rawPolygonData } from "../fixtures/raw-blockchains-data";
import { rawStoredWalletData } from "../fixtures/raw-stored-wallet-data";
import { WalletRepo } from "../wallet-repo/wallet-repo";
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
});
