import { BlockchainTokens } from "../blockchain-tokens/blockchain-tokens";
import { Blockchain } from "../blockchain/blockchain";

export class NativeTokenOf { }


fdescribe('NativeTokenOf', () => {

  let token: NativeTokenOf;

  beforeEach(() => {
    token = new NativeTokenOf(
      new BlockchainTokens(
        new Blockchain(rawEthereumData),
        new DefaultTokens(new TokenRepo(rawTokensData)))
    );
  });

  it('new', () => {
    expect(token).toBeTruthy();
  });
});
