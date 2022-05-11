import { EquivalentTokenOf } from './equivalent-token-of';

describe('EquivalentTokenOf', () => {
  it('should create', () => {
    expect(new EquivalentTokenOf('USDC', { ETH: 'WETH' })).toBeTruthy();
  });

  it('should get btc equivalent', () => {
    expect(new EquivalentTokenOf('BTC').value()).toEqual('WBTC');
  });
});
