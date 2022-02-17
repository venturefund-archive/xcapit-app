import { FormattedNetworkPipe } from './formatted-network.pipe';

describe('FormattedNetworkPipe', () => {
  it('create an instance', () => {
    const pipe = new FormattedNetworkPipe();
    expect(pipe).toBeTruthy();
  });

  [
    {
      network: 'ERC20',
      formatted: 'ERC20',
    },
    {
      network: 'BSC_BEP20',
      formatted: 'BSC BEP20',
    },
    {
      network: 'MATIC',
      formatted: 'Polygon',
    },
    {
      network: 'test',
      formatted: 'test',
    },
  ].forEach((o) => {
    it(`should return ${o.formatted} when network is ${o.network} on transform`, () => {
      const pipe = new FormattedNetworkPipe();
      expect(pipe.transform(o.network)).toEqual(o.formatted);
    });
  });
});
