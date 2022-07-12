import { BlockchainTokens } from '../blockchain-tokens/blockchain-tokens';
import { Blockchain } from '../blockchain/blockchain';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { rawTokensData } from '../fixtures/raw-tokens-data';
import { TokenRepo } from '../token-repo/token-repo';
import { DefaultTokens } from '../tokens/tokens';
import { NativeTokenOf } from './native-token-of';


fdescribe('NativeTokenOf', () => {

  let result: NativeTokenOf;

  beforeEach(() => {
    result = new NativeTokenOf(
      new BlockchainTokens(
        new Blockchain(rawEthereumData),
        new DefaultTokens(new TokenRepo(rawTokensData))
      )
    );
  });

  it('new', () => {
    expect(result).toBeTruthy();
  });

  it('value', async () => {
    expect(result.value()).toBeTruthy();
  });
});
