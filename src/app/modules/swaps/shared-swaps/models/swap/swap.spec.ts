import { BigNumber } from "ethers";
import { rawETHData } from "../fixtures/raw-tokens-data";
import { Swap } from "./swap";
import { DefaultToken } from "../token/token";


describe('Swap', () => {

  let swap: Swap;

  beforeEach(() => {
    swap = new Swap('1', new DefaultToken(rawETHData), new DefaultToken(rawETHData));
  });

  it('new', () => {
    expect(swap).toBeTruthy();
  });

  it('tokens access', () => {
    expect(swap.fromToken()).toBeTruthy();
    expect(swap.toToken()).toBeTruthy();
  });

  it('wei access', () => {
    expect(swap.weiAmount().value()).toEqual(BigNumber.from('1000000000000000000'));
  });
});
