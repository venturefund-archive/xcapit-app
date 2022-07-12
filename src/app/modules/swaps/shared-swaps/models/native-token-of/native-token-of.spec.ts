import { BlockchainTokens } from '../blockchain-tokens/blockchain-tokens';
import { Blockchain } from '../blockchain/blockchain';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { rawETHData, rawTokensData } from '../fixtures/raw-tokens-data';
import { TokenRepo } from '../token-repo/token-repo';
import { Token } from '../token/token';
import { DefaultTokens } from '../tokens/tokens';


export class NativeTokenOf implements Token {

  private _token: Token;

  constructor(private _aBlockchainTokens: BlockchainTokens) {}

  blockchainId(): string {
    throw new Error('Method not implemented.');
  }

  symbol(): string {
    throw new Error('Method not implemented.');
  }

  decimals(): number {
    throw new Error('Method not implemented.');
  }

  address(): string {
    throw new Error('Method not implemented.');
  }

  json() {
    throw new Error('Method not implemented.');
  }
}

fdescribe('NativeTokenOf', () => {

  let token: NativeTokenOf;

  beforeEach(() => {
    token = new NativeTokenOf(
      new BlockchainTokens(new Blockchain(rawEthereumData), new DefaultTokens(new TokenRepo(rawTokensData)))
    );
  });

  it('new', () => {
    expect(token).toBeTruthy();
  });

  it('blockchain id access', () => {
    expect(token.blockchainId()).toEqual(`${rawETHData.chainId}`);
  });

  it('address access', () => {
    expect(token.address()).toEqual(rawETHData.contract);
  });

  it('json access', () => {
    expect(token.json()).toEqual(rawETHData);
  });
});
