import { providers } from "./fake-ethers-providers";


describe('Fake Ethers Providers', () => {

  it('new JsonRpcProvider', () => {
    expect(new providers.JsonRpcProvider('aRPCUrl')).toBeTruthy();
  });
});
