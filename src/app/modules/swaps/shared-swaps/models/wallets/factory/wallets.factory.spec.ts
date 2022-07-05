import { FakeAppStorage } from "src/app/shared/services/app-storage/app-storage.service";
import { rawStoredWalletData } from "../../fixtures/raw-stored-wallet-data";
import { WalletsFactory } from "./wallets.factory";


describe('Wallets Factory', () => {

  it('new', () => {
    expect(new WalletsFactory()).toBeTruthy();
  });

  it('create', () => {
    expect(new WalletsFactory().create(new FakeAppStorage(rawStoredWalletData))).toBeTruthy();
  });
});
