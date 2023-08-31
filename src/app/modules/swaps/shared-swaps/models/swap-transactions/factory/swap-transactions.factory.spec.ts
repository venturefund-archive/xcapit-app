import { Blockchain } from "../../blockchain/blockchain";
import { FakeOneInch } from "../../fakes/fake-one-inch";
import { rawEthereumData } from "../../fixtures/raw-blockchains-data";
import { rawAllowanceData } from "../../fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../../fixtures/raw-tokens-data";
import { rawWalletData } from "../../fixtures/raw-wallet-data";
import { Swap } from "../../swap/swap";
import { DefaultToken } from "../../token/token";
import { DefaultWallet } from "../../../../../wallets/shared-wallets/models/wallet/default/default-wallet";
import { SwapTransactionsFactory } from "./swap-transactions.factory";


describe('Swap Transactions Factory', () => {

  it('new', () => {
    expect(new SwapTransactionsFactory()).toBeTruthy();
  });

  it('create', () => {
    const swapTransactions = new SwapTransactionsFactory().create(
      new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData)),
      new DefaultWallet(rawWalletData, new Blockchain(rawEthereumData)),
      new FakeOneInch(rawAllowanceData)
    );

    expect(swapTransactions).toBeTruthy();
  });
});
