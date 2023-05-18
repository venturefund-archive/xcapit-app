import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { OneInch } from "./one-inch";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawNotAllowanceData, rawApproveData, rawSwapData, rawSwapInfoData } from "../fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../fixtures/raw-tokens-data";
import { rawWalletData } from "../fixtures/raw-wallet-data";
import { Referral } from "../referral/referral";
import { Slippage } from "../slippage/slippage";
import { Swap } from "../swap/swap";
import { DefaultToken } from "../token/token";
import { DefaultWallet } from "../wallet/default/default-wallet";
import { Blockchain } from "../blockchain/blockchain";


describe('One Inch', () => {

  let swap: Swap;
  let dex: OneInch;
  const referral = new Referral();
  const wallet = new DefaultWallet(rawWalletData, new Blockchain(rawEthereumData));

  beforeEach(() => {
    swap = new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData));
    dex = new OneInch(
      new Blockchain(rawEthereumData),
      new FakeHttpClient(rawApproveData)
    );
  });

  it('new', () => {
    expect(dex).toBeTruthy();
  });

  it('approve', async () => {
    expect(await dex.approve(swap)).toBeTruthy();
  });

  it('tokens', async () => {
    expect(await dex.tokens()).toEqual(rawApproveData);
  });

  it('swap', async () => {
    const slippage = new Slippage();
    const dex = new OneInch(
      new Blockchain(rawEthereumData),
      new FakeHttpClient(rawSwapData)
    );

    const swapData = await dex.swap(swap, wallet, slippage, referral);

    expect(swapData).toEqual(rawSwapData);
  });

  it('allowance', async () => {
    const dex = new OneInch(
      new Blockchain(rawEthereumData),
      new FakeHttpClient(rawNotAllowanceData)
    );

    expect(await dex.allowance(new DefaultToken(rawUSDCData), wallet)).toEqual(rawNotAllowanceData);
  });

  it('swap info', async () => {
    const dex = new OneInch(
      new Blockchain(rawEthereumData),
      new FakeHttpClient(rawSwapInfoData)
    );

    expect(await dex.swapInfo(swap, referral)).toEqual(rawSwapInfoData);
  });
})
