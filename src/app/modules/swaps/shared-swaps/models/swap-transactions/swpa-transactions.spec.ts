import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawMATICData, rawUSDCData } from "../fixtures/raw-tokens-data";
import { rawWalletData } from "../fixtures/raw-wallet-data";
import { Swap } from "../swap/swap";
import { DefaultToken } from "../token/token";
import { DefaultWallet } from "../wallet/wallet";
import { FakeOneInch } from "../fakes/fake-one-inch";
import { rawAllowanceData, rawNotAllowanceData } from "../fixtures/raw-one-inch-response-data";
import { SwapTransactions } from "./swpa-transactions";
import { DefaultBlockchain } from "../blockchain/blockchain";


describe('Swap Transactions', () => {

  let transactions: SwapTransactions;

  const createSwapTransactions = (aRawAllowanceData: any): SwapTransactions => {
    return new SwapTransactions(
      new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData)),
      new DefaultWallet(rawWalletData, new DefaultBlockchain(rawEthereumData)),
      new FakeOneInch(aRawAllowanceData)
    );
  };

  beforeEach(() => {
    transactions = createSwapTransactions(rawAllowanceData);
  });

  it('new', () => {
    expect(transactions).toBeTruthy();
  });

  it('blockchainTxs access', async () => {
    expect((await transactions.blockchainTxs()).length).toEqual(1);
  });

  it('blockchainTxs access, and an approve tx is in the group', async () => {
    const transactions = createSwapTransactions(rawNotAllowanceData);

    expect((await transactions.blockchainTxs()).length).toEqual(2);
  });
});
