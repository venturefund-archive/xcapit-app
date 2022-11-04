import { Blockchain } from "../blockchain/blockchain";
import { rawSolanaData } from "../fixtures/raw-blockchains-data";
import { SolanaDerivedWallet } from "./solana-derived-wallet";


fdescribe('SolanaDerivedWallet', () => {
  let wallet: SolanaDerivedWallet;
  const address = '5vftMkHL72JaJG6ExQfGAsT2uGVHpRR7oTNUPMs68Y2N';
  const seedPhrase = 'neither lonely flavor argue grass remind eye tag avocado spot unusual intact';

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
