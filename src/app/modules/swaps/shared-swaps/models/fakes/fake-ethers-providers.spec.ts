import { fakeProviders } from "./fake-ethers-providers";


describe('Fake Ethers Providers', () => {

  it('new JsonRpcProvider', () => {
    expect(new fakeProviders.JsonRpcProvider('aRPCUrl')).toBeTruthy();
  });
});
