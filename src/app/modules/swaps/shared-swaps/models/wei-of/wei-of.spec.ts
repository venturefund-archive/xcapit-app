import { BigNumber } from "ethers";
import { rawETHData } from "../fixtures/raw-tokens-data";
import { DefaultToken } from "../token/token";
import { WeiOf } from "./wei-of";


describe('WeiOf', () => {

  let wei: WeiOf;

  beforeEach(() => {
    wei = new WeiOf(1, new DefaultToken(rawETHData));
  });

  it('new', () => {
    expect(wei).toBeTruthy();
  });

  it('value', () => {
    expect(wei.value()).toEqual(BigNumber.from('1000000000000000000'));
  });
});
