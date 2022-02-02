import { BigNumber } from 'ethers';
import { TotalFeeOf } from './total-fee-of.model';

describe('TotalFeeOf', () => {
  let gasFees = [
    jasmine.createSpyObj('GasFeeOf', { value: Promise.resolve(BigNumber.from('5')) }),
    jasmine.createSpyObj('GasFeeOf', { value: Promise.resolve(BigNumber.from('25')) }),
  ];
  beforeEach(() => {});

  it('should create', () => {
    expect(new TotalFeeOf(gasFees)).toBeTruthy();
  });

  it('should get total value empty', async () => {
    expect(await new TotalFeeOf([]).value()).toEqual(BigNumber.from('0'));
  });

  it('should get total value', async () => {
    expect(await new TotalFeeOf(gasFees).value()).toEqual(BigNumber.from('30'));
  });
});
