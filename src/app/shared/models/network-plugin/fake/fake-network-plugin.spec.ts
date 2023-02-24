import { FakeNetworkPlugin } from './fake-network-plugin';

describe('FakeNetworkPlugin', () => {
  let networkPlugin: FakeNetworkPlugin;

  beforeEach(() => {
    networkPlugin = new FakeNetworkPlugin();
  });

  it('new', () => {
    expect(networkPlugin).toBeTruthy();
  });

  it('addListener', () => {
    networkPlugin.addListener('aName', (connectionStatus) => {
      expect(connectionStatus.connected).toBeTrue();
    });
  });

  it('getStatus', async () => {
    expect((await networkPlugin.getStatus()).connected).toBeTrue();
  });
});
