import { BigNumber } from 'ethers';
import { Allowance } from './allowance';

describe('Allowance', () => {
  it('should create', () => {
    expect(new Allowance(BigNumber.from('200'))).toBeTruthy();
  });

  it('should return true if enough', () => {
    expect(new Allowance(BigNumber.from('200')).enoughFor(BigNumber.from('100'))).toBeTrue();
  });

  it('should return true if the same value', () => {
    expect(new Allowance(BigNumber.from('200')).enoughFor(BigNumber.from('200'))).toBeTrue();
  });

  it('should return false if not enough', () => {
    expect(new Allowance(BigNumber.from('200')).enoughFor(BigNumber.from('300'))).toBeFalse();
  });
});
