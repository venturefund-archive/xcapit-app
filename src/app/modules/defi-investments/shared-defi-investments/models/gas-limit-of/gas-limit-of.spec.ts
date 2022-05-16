import { GasFeeOf } from '../gas-fee-of/gas-fee-of.model';
import { BigNumber } from 'ethers';
import { GasLimitOf } from './gas-limit-of';

describe('GasLimitOf', () => {
  let feeSpy: jasmine.SpyObj<GasFeeOf>;

  beforeEach(() => {
    feeSpy = jasmine.createSpyObj('GasLimitOf', { value: Promise.resolve(BigNumber.from('10')) });
  });

  it('should create', () => {
    expect(new GasLimitOf(feeSpy, 50)).toBeTruthy();
  });

  it('should get value', async () => {
    expect(await new GasLimitOf(feeSpy).value()).toEqual('15');
  });

  it('should get value with custom percentage', async () => {
    expect(await new GasLimitOf(feeSpy, 110).value()).toEqual('21');
  });
});
