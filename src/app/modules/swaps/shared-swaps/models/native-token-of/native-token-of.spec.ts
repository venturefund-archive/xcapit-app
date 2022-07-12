import { BlockchainTokens } from '../blockchain-tokens/blockchain-tokens';
import { Blockchain } from '../blockchain/blockchain';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { rawETHData, rawTokensData } from '../fixtures/raw-tokens-data';
import { TokenRepo } from '../token-repo/token-repo';
import { Token } from '../token/token';
import { DefaultTokens } from '../tokens/tokens';


export class NativeTokenOf {

  constructor(private _aBlockchainTokens: BlockchainTokens) {}

  async value() {
    return (await this._aBlockchainTokens.value()).find(token => token.isNative() === true);
  }
}

fdescribe('NativeTokenOf', () => {

  let result: NativeTokenOf;

  beforeEach(() => {
    result = new NativeTokenOf(
      new BlockchainTokens(new Blockchain(rawEthereumData), new DefaultTokens(new TokenRepo(rawTokensData)))
    );
  });

  it('new', () => {
    expect(result).toBeTruthy();
  });

  it('value', async () => {
    expect(result.value()).toBeTruthy();
  });
});
