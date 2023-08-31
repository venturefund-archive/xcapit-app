import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { ApproveTxOf } from "./approve-tx-of";
import { OneInch } from "../../../../../swaps/shared-swaps/models/one-inch/one-inch";
import { rawEthereumData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data";
import { rawApproveData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { Swap } from "../../../../../swaps/shared-swaps/models/swap/swap";
import { DefaultToken } from "../../../../../swaps/shared-swaps/models/token/token";
import { Blockchain } from "../../../../../swaps/shared-swaps/models/blockchain/blockchain";
import { BigNumber } from "ethers";


describe('ApproveTxOf', () => {

  let approveTx: ApproveTxOf;

  beforeEach(() => {
    approveTx = new ApproveTxOf(
      new Swap(
        1,
        new DefaultToken(rawMATICData),
        new DefaultToken(rawUSDCData)
      ),
      new OneInch(
        new Blockchain(rawEthereumData),
        new FakeHttpClient(rawApproveData)
      )
    );
  });

  it('new', () => {
    expect(approveTx).toBeTruthy();
  });

  it('value access', async () => {
    const txValue = {
      ...rawApproveData,
      gasPrice: BigNumber.from(rawApproveData.gasPrice),
      value: BigNumber.from(rawApproveData.value)
    };

    expect(await approveTx.value()).toEqual(txValue);
  });
});
