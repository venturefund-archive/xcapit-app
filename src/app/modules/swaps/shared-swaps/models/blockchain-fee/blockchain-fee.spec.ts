import { FormattedFee } from "src/app/modules/defi-investments/shared-defi-investments/models/formatted-fee/formatted-fee.model";
import { BlockchainTokens } from "../blockchain-tokens/blockchain-tokens";
import { Blockchain } from "../blockchain/blockchain";
import { DummyFee } from "../fakes/fake-fee";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawETHTokenData } from "../fixtures/raw-one-inch-response-data";
import { rawTokensData } from "../fixtures/raw-tokens-data";
import { NativeTokenOf } from "../native-token-of/native-token-of";
import { TokenRepo } from "../token-repo/token-repo";
import { DefaultTokens } from "../tokens/tokens";
import { BlockchainFee } from "./blockchain-fee";


fdescribe('BlockchainFee', () => {

  const testData = 100;
  let currentFee: BlockchainFee;

  beforeEach(() => {
    currentFee = new BlockchainFee(
      new DummyFee(testData),
      new NativeTokenOf(
        new BlockchainTokens(
          new Blockchain(rawEthereumData),
          new DefaultTokens(new TokenRepo(rawTokensData))
        )
      ));
  });

  it('new', () => {
    expect(currentFee).toBeTruthy();
  });

  it('json', async () => {
    const expectedValue = await new FormattedFee(new DummyFee(testData)).value();

    const feeAmount = await currentFee.json();

    expect(feeAmount.value).toEqual(expectedValue);
    expect(feeAmount.token).toEqual(rawETHTokenData.symbol);
  });
});
