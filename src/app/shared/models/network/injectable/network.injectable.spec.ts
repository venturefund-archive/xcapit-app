import { NetworkInjectable } from './network.injectable';

describe('NetworkInjectable', () => {
  let networkInjectable: NetworkInjectable;

  beforeEach(() => {
    networkInjectable = new NetworkInjectable();
  });

  it('new', () => {
    expect(networkInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(networkInjectable.create()).toBeTruthy();
  });
});
