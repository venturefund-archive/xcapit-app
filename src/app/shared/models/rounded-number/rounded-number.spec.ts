import RoundedNumber from './rounded-number';

describe('RoundedNumber', () => {
  it('new', () => {
    expect(new RoundedNumber(10.4153)).toBeTruthy();
  });

  it('value', () => {
    expect(new RoundedNumber(10.4153, 2).value()).toEqual(10.42);
  });

  it('value with 3 decimals', () => {
    expect(new RoundedNumber(10.4153, 3).value()).toEqual(10.415);
  });

  it('value with 5 decimals', () => {
    expect(new RoundedNumber(10.4153567, 5).value()).toEqual(10.41536);
  });

  it('value with less decimals than required', () => {
    expect(new RoundedNumber(10.42, 5).value()).toEqual(10.42);
  });

  it('value with more decimals than required', () => {
    expect(new RoundedNumber(10.425555, 2).value()).toEqual(10.43);
  });
});
