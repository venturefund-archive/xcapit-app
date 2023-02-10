import { FakeNetworkPlugin } from '../../network-plugin/fake/fake-network-plugin';
import { Network } from './network';

describe('Network', () => {
  let network: Network;

  beforeEach(() => {
    network = new Network(new FakeNetworkPlugin({ connected: false, connectionType: 'wifi' }));
  });

  it('new', () => {
    expect(network).toBeTruthy();
  });

  it('new with defaults', () => {
    expect(new Network()).toBeTruthy();
  });

  it('status', () => {
    network.status().subscribe((status) => {
      expect(status.connected).toBeFalse();
    });
  });

  it('status multiple subscriptions', () => {
    network.status().subscribe((status) => {
      expect(status.connected).toBeFalse();
    });
    network.status().subscribe((status) => {
      expect(status.connected).toBeFalse();
    });
  });
});
