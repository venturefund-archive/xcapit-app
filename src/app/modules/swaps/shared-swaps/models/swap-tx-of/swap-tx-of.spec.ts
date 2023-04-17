import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { OneInch } from "../one-inch/one-inch";
import { FixedIncreasedNumber } from "../fixed-increased-number/fixed-increased-number";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawSwapData } from "../fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../fixtures/raw-tokens-data";
import { rawWalletData } from "../fixtures/raw-wallet-data";
import { Referral } from "../referral/referral";
import { Slippage } from "../slippage/slippage";
import { Swap } from "../swap/swap";
import { SwapTxOf } from "./swap-tx-of";
import { DefaultToken } from "../token/token";
import { DefaultWallet } from "../wallet/default/default-wallet";
import { Blockchain } from "../blockchain/blockchain";
import { BigNumber } from "ethers";


describe('Swap Tx Of', () => {

  let swapTx: SwapTxOf;

  beforeEach(() => {
    swapTx = new SwapTxOf(
      new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData)),
      new DefaultWallet(rawWalletData, new Blockchain(rawEthereumData)),
      new OneInch(new Blockchain(rawEthereumData), new FakeHttpClient(rawSwapData)),
      new Slippage(),
      new Referral()
    );
  });

  it('new', () => {
    expect(swapTx).toBeTruthy();
  });

  it('value access', async () => {
    const expectedValue = {
      data: rawSwapData.tx.data,
      to: rawSwapData.tx.to,
      value: BigNumber.from(rawSwapData.tx.value),
      gasPrice: BigNumber.from(rawSwapData.tx.gasPrice),
      gasLimit: BigNumber.from(new FixedIncreasedNumber(rawSwapData.tx.gas, 25).value())
    };

    expect(await swapTx.value()).toEqual(expectedValue);
  });
});
