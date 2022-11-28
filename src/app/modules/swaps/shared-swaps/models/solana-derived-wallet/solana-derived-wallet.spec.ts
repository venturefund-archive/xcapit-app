import { solanaAddress2, solanaSeedPhrase2 } from "src/app/modules/wallets/shared-wallets/fixtures/raw-address-data";
import { Blockchain } from "../blockchain/blockchain";
import { rawSolanaData } from "../fixtures/raw-blockchains-data";
import { SolanaDerivedWallet } from "./solana-derived-wallet";


describe('SolanaDerivedWallet', () => {
  let wallet: SolanaDerivedWallet;
  const address = solanaAddress2;
  const seedPhrase = solanaSeedPhrase2;

  beforeEach(() => {
    wallet = new SolanaDerivedWallet(
      seedPhrase,
      new Blockchain(rawSolanaData)
    );
  });

  it('new', () => {
    expect(wallet).toBeTruthy();
  });

  it('value', () => {
    expect(wallet.value()).toBeTruthy();
  });

  it('address', () => {
    expect(wallet.address()).toEqual(address);
  });
});
