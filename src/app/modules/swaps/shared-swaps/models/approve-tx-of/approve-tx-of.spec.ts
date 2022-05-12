import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { ApproveTxOf } from "./approve-tx-of";
import { OneInch } from "../one-inch/one-inch";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawApproveData } from "../fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../fixtures/raw-tokens-data";
import { Swap } from "../swap/swap";
import { DefaultToken } from "../token/token";
import { Blockchain } from "../blockchain/blockchain";


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
    expect(await approveTx.value()).toEqual(rawApproveData);
  });
});
