import { SplitStringPipe } from './split-string.pipe';

describe('SplitStringPipe', () => {
  const pipe = new SplitStringPipe();
  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should divide string with whitespace separator by default', () => {
    expect(pipe.transform('USDC USD Coin')).toEqual(['USDC', 'USD', 'Coin']);
  });

  it('should divide string with the specified separator when input is a string', () => {
    expect(pipe.transform('USDC - USD Coin', ' - ')).toEqual(['USDC', 'USD Coin']);
  });

  it('should return the input without transform when input is not a string', () => {
    expect(pipe.transform(123)).toEqual(123);
  });
});
