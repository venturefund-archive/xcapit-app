import { SuitePipe } from './suite.pipe';

describe('SuitePipe', () => {
  it('create an instance', () => {
    const pipe = new SuitePipe();
    expect(pipe).toBeTruthy();
  });

  [
    {
      network: 'ERC20',
      suiteName: 'Ethereum',
    },
    {
      network: 'BSC_BEP20',
      suiteName: 'Binance Smart Chain',
    },
    {
      network: 'MATIC',
      suiteName: 'Polygon',
    },
    {
      network: 'test',
      suiteName: 'test',
    },
  ].forEach((o) => {
    it(`should return ${o.suiteName} when network is ${o.network} on transform`, () => {
      const pipe = new SuitePipe();
      expect(pipe.transform(o.network)).toEqual(o.suiteName);
    });
  });
});
