import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { OneInch } from "../../../../../swaps/shared-swaps/models/one-inch/one-inch";
import { FixedIncreasedNumber } from "../../../../../swaps/shared-swaps/models/fixed-increased-number/fixed-increased-number";
import { rawEthereumData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data";
import { rawSwapData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { rawWalletData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-wallet-data";
import { Referral } from "../../../../../swaps/shared-swaps/models/referral/referral";
import { Slippage } from "../../../../../swaps/shared-swaps/models/slippage/slippage";
import { Swap } from "../../../../../swaps/shared-swaps/models/swap/swap";
import { SwapTxOf } from "./swap-tx-of";
import { DefaultToken } from "../../../../../swaps/shared-swaps/models/token/token";
import { Blockchain } from "../../../../../swaps/shared-swaps/models/blockchain/blockchain";
import { BigNumber } from "ethers";
import { DefaultWallet } from "../../wallet/default/default-wallet";


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
