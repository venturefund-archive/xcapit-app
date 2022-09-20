import { Token } from '../token';
import { rawSOLData } from '../../fixtures/raw-tokens-data';
import { SolanaToken } from './solana-token';

describe('SolanaToken', () => {
  let token: Token;

  beforeEach(() => {
    token = new SolanaToken(rawSOLData);
  });

  it('new', () => {
    expect(token).toBeTruthy();
  });

  it('blockchain id access', () => {
    expect(token.blockchainId()).toEqual(`${rawSOLData.chainId}`);
  });

  it('address access', () => {
    expect(token.address()).toEqual(rawSOLData.contract);
  });

  it('json access', () => {
    expect(token.json()).toEqual(rawSOLData);
  });
});
