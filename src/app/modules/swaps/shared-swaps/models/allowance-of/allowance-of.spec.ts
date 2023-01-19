import { BigNumber } from "ethers";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { AllowanceOf } from "./allowance-of";
import { OneInch } from "../one-inch/one-inch";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawAllowanceData, rawNotAllowanceData } from "../fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../fixtures/raw-tokens-data";
import { rawWalletData } from "../fixtures/raw-wallet-data";
import { DefaultToken } from "../token/token";
import { DefaultWallet } from "../wallet/wallet";
import { Swap } from "../swap/swap";
import { DefaultBlockchain } from "../blockchain/blockchain";


describe('Allowance Of', () => {

  let allowance: AllowanceOf;

  const createAllowanceOf = (aRawAllowanceData: any): AllowanceOf => {
    return new AllowanceOf(
      new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData)),
      new DefaultWallet(rawWalletData, new DefaultBlockchain(rawEthereumData)),
      new OneInch(
        new DefaultBlockchain(rawEthereumData),
        new FakeHttpClient(aRawAllowanceData)
      )
    );
  }

  beforeEach(() => {
    allowance = createAllowanceOf(rawNotAllowanceData);
  });

  it('new', () => {
    expect(allowance).toBeTruthy();
  });

  it('vale access', async () => {
    const expectdAllowance = BigNumber.from(rawNotAllowanceData.allowance);

    expect(await allowance.value()).toEqual(expectdAllowance);
  });

  it('is not enough to swap', async () => {
    expect(await allowance.isNotEnough()).toEqual(true);
  });

  it('is enough to swap', async () => {
    allowance = createAllowanceOf(rawAllowanceData);

    expect(await allowance.isNotEnough()).toEqual(false);
  });
});
