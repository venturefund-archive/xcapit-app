import { BigNumber } from 'ethers';
import { FormattedFee } from './formatted-fee.model';
import { GasFeeOf } from '../gas-fee-of/gas-fee-of.model';

describe('FormattedFee', () => {
  let feeSpy: jasmine.SpyObj<GasFeeOf>;
  beforeEach(() => {
    feeSpy = jasmine.createSpyObj('GasFee', { value: Promise.resolve(BigNumber.from('15')) });
  });

  it('should create', () => {
    expect(new FormattedFee(feeSpy, 18)).toBeTruthy();
  });

  it('should get formatted fee', async () => {
    expect(await new FormattedFee(feeSpy, 18).value()).toEqual(1.5e-17);
  });
});
