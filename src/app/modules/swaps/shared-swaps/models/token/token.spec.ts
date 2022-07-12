import { rawETHData } from "../fixtures/raw-tokens-data";
import { DefaultToken, Token } from "./token";


describe('Token', () => {

  let token: Token;

  beforeEach(() => {
    token = new DefaultToken(rawETHData);
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

  it('is native', () => {
    expect(token.isNative()).toBeTrue();
  });
});
