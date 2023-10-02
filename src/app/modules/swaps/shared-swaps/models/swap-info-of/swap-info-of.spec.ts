import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { OneInch } from "../one-inch/one-inch";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawSwapOneInchInfoData } from "../fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../fixtures/raw-tokens-data";
import { Referral } from "../referral/referral";
import { Swap } from "../swap/swap";
import { SwapInfoOf } from "./swap-info-of";
import { DefaultToken } from "../token/token";
import { Blockchain } from "../blockchain/blockchain";


describe('Swap Info Of', () => {

  let swapInfo: SwapInfoOf;

  beforeEach(() => {
    swapInfo = new SwapInfoOf(
      new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData)),
      new OneInch(new Blockchain(rawEthereumData), new FakeHttpClient(rawSwapOneInchInfoData)),
      new Referral()
    );
  });

  it('new', () => {
    expect(swapInfo).toBeTruthy();
  });

  it('estimatedGas access', async () => {
    expect((await swapInfo.estimatedGas()).value().eq(rawSwapOneInchInfoData.gas)).toBeTrue();
  });

  it('toTokenAmount access', async () => {
    expect((await swapInfo.toTokenAmount()).value()).toEqual(0.495454);
  });

  it('multiple access', async () => {
    expect(await swapInfo.estimatedGas()).toBeTruthy();
    expect((await swapInfo.toTokenAmount()).value()).toBeTruthy();
  });
});
