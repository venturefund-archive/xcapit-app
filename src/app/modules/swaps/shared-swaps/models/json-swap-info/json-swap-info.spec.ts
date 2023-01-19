import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { OneInch } from "../one-inch/one-inch";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawSwapInfoData } from "../fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../fixtures/raw-tokens-data";
import { JSONSwapInfo, NullJSONSwapInfo } from "./json-swap-info";
import { Referral } from "../referral/referral";
import { Swap } from "../swap/swap";
import { SwapInfoOf } from "../swap-info-of/swap-info-of";
import { DefaultToken } from "../token/token";
import { DefaultBlockchain } from "../blockchain/blockchain";


describe('JSON Swap Info', () => {

  let jsonSwapInfo: JSONSwapInfo;
  const swapInfo = new SwapInfoOf(
    new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData)),
    new OneInch(new DefaultBlockchain(rawEthereumData), new FakeHttpClient(rawSwapInfoData)),
    new Referral()
  );

  beforeEach(() => {
    jsonSwapInfo = new JSONSwapInfo(swapInfo);
  });

  it('new', () => {
    expect(jsonSwapInfo).toBeTruthy();
  });

  it('value access', async () => {
    const jsonInfo = await jsonSwapInfo.value();

    expect(jsonInfo.toTokenAmount).toEqual((await swapInfo.toTokenAmount()).value());
    expect(jsonInfo.estimatedGas).toEqual((await swapInfo.estimatedGas()).value().toNumber());
  });
});


describe('Null JSON Swap Info', () => {

  let nullJSONSwapInfo: NullJSONSwapInfo;

  beforeEach(() => {
    nullJSONSwapInfo = new NullJSONSwapInfo();
  });

  it('new', () => {
    expect(nullJSONSwapInfo).toBeTruthy();
  })

  it('value access', () => {
    expect(nullJSONSwapInfo.value().estimatedGas).toEqual(0);
    expect(nullJSONSwapInfo.value().toTokenAmount).toEqual(0);
  });
});
