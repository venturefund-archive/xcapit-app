import { FakeEthersProvider } from "./fake-ethers-provider";

describe('FakeEthersProviders', () => {
    const aHash = '';

    it('new', () => {
      expect(new FakeEthersProvider()).toBeTruthy();
    });

    it('getTransaction', async () => {
      expect(await new FakeEthersProvider().getTransaction(aHash)).toBeTruthy();
    });

  });
