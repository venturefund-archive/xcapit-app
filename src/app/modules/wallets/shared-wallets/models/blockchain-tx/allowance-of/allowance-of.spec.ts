import { BigNumber } from "ethers";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { AllowanceOf } from "./allowance-of";
import { OneInch } from "../../../../../swaps/shared-swaps/models/one-inch/one-inch";
import { rawEthereumData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data";
import { rawAllowanceData, rawNotAllowanceData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-one-inch-response-data";
import { rawMATICData, rawUSDCData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { rawWalletData } from "../../../../../swaps/shared-swaps/models/fixtures/raw-wallet-data";
import { DefaultToken } from "../../../../../swaps/shared-swaps/models/token/token";
import { Swap } from "../../../../../swaps/shared-swaps/models/swap/swap";
import { Blockchain } from "../../../../../swaps/shared-swaps/models/blockchain/blockchain";
import { DefaultWallet } from "../../wallet/default/default-wallet";


describe('Allowance Of', () => {

  let allowance: AllowanceOf;

  const createAllowanceOf = (aRawAllowanceData: any): AllowanceOf => {
    return new AllowanceOf(
      new Swap('1', new DefaultToken(rawMATICData), new DefaultToken(rawUSDCData)),
      new DefaultWallet(rawWalletData, new Blockchain(rawEthereumData)),
      new OneInch(
        new Blockchain(rawEthereumData),
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
