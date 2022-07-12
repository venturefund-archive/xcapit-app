import { BlockchainTokens } from "../blockchain-tokens/blockchain-tokens";
import { Blockchain } from "../blockchain/blockchain";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawTokensData } from "../fixtures/raw-tokens-data";
import { TokenRepo } from "../token-repo/token-repo";
import { Token } from "../token/token";
import { DefaultTokens } from "../tokens/tokens";


export class NativeTokenOf implements Token {

  constructor(private _aBlockchainTokens: BlockchainTokens) { }
}


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
