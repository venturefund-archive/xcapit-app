import { rawETHTokenData } from "../fixtures/raw-one-inch-response-data";
import { OneInchToken } from "./one-inch-token";
import { Token } from "../token/token";


describe('OneInchToken', () => {

  let token: Token;

  beforeEach(() => {
    token = new OneInchToken(rawETHTokenData);
  });

  it('new', () => {
    expect(token).toBeTruthy();
  });

  it('value', () => {
    expect(token.symbol()).toEqual(rawETHTokenData.symbol);
  });

  it('decimals', () => {
    expect(token.decimals()).toEqual(rawETHTokenData.decimals);
  });
});
